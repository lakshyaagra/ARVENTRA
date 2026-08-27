const bcrypt=require('bcrypt')
const User=require('../models/User');
const sendEmail = require('../utils/sendMail');
const { generateToken, hashToken } = require('../utils/token')

// Ye email verification aur password reset ke liye random secret token banane/hash karne ke kaam aa rahe hain
const {
    signAccessToken,
    generateRefreshToken,
    hashRefreshToken,
    refreshCookieOptions,
    REFRESH_COOKIE_NAME
} = require('../utils/tokens');

const EMAIL_VERIFICATION_MS = 24 * 60 * 60 * 1000; // Verification link 24 hours tak valid hai.
const PASSWORD_RESET_MS = 30 * 60 * 1000; // Password reset link sirf 30 minutes valid hai.

// Strips any trailing slash(es) from FRONTEND_URL before we append a path —
// otherwise "http://host/" + "/reset-password/..." becomes a double-slash
// URL that the frontend router won't match against "/reset-password/:token".
const frontendBaseUrl = () => (process.env.FRONTEND_URL || "").replace(/\/+$/, "");


const registerUser=async (req,res)=>{
    try{
        const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
        req.body.password = hashedPassword;
        const user = await User.create(req.body);

        try {
            await sendVerificationEmailFor(user);
        } catch (emailErr) {
            // Don't fail registration just because the email didn't send —
            // the account still exists and the user can request a new
            // verification link via /resend-verification.
            console.error("REGISTER VERIFICATION EMAIL ERROR:", emailErr);
        }

        // select:false on the schema only hides the password on find/findOne
        // queries — it does NOT apply to the document .create() hands back,
        // so without this the (hashed) password would be sent in the response.
        user.password = undefined;
        res.status(201).json({
            message: "User Registered",
            success: true,
            user: user
        })
    }
    catch(err){
        console.error(err);

        // Duplicate email: the schema's unique index rejects this at the DB
        // level (race-safe, unlike a pre-check in validation middleware).
        if (err.code === 11000 && err.keyPattern?.email) {
            return res.status(409).json({
                message: "An account with this email already exists.",
                success: false
            })
        }

        if (err.name === "ValidationError") {
            return res.status(400).json({
                message: Object.values(err.errors)[0]?.message || "Invalid registration data.",
                success: false
            })
        }

        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}
const loginUser=async (req,res)=>{
    try{
        const user=await User.findOne({
            email:req.body.email
        }).select('+password')  //password ko retrieve karne ke liye select('+password') use kiya gaya hai
        if(!user){
            return res.status(401).json({
                message: "Invalid Email or Password",
                success: false
            })
        }
        const isPasswordValid=await bcrypt.compare(
            req.body.password,
            user.password
        )
        if(!isPasswordValid){
            return res.status(401).json({
                message: "Invalid Email or Password",
                success: false
            })
        }

        //ek access token bnalo
        const accessToken = signAccessToken(user._id);
 
        const { rawToken, hashedToken } = generateRefreshToken();
        user.refreshTokenHash = hashedToken;
        await user.save();
 
        res.cookie(REFRESH_COOKIE_NAME, rawToken, refreshCookieOptions());
 
        res.status(200).json({
            message: "User Logged In",
            success: true,
            token: accessToken
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}

// REFRESH / LOGOUT
const refreshAccessToken = async (req, res) => {
    try {
        const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];
        if (!rawToken) {
            return res.status(401).json({
                success: false,
                message: "No refresh token provided."
            });
        }
 
        const hashedToken = hashRefreshToken(rawToken);
        const user = await User.findOne({ refreshTokenHash: hashedToken });
 
        if (!user) {
            // Either never logged in, already logged out, or (notably) a
            // stale/stolen refresh token being replayed after rotation —
            // clear whatever cookie the caller has either way.
            res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions());
            return res.status(401).json({
                success: false,
                message: "Session expired. Please log in again."
            });
        }
 
        // Rotate: issue a new refresh token and invalidate this one, so a
        // captured-then-replayed old token can't be reused going forward.
        const { rawToken: newRawToken, hashedToken: newHashedToken } = generateRefreshToken();
        user.refreshTokenHash = newHashedToken;
        await user.save();
 
        res.cookie(REFRESH_COOKIE_NAME, newRawToken, refreshCookieOptions());
 
        const accessToken = signAccessToken(user._id);
 
        res.status(200).json({
            success: true,
            token: accessToken
        });
    } catch (err) {
        console.error("REFRESH TOKEN ERROR:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
 
const logoutUser = async (req, res) => {
    try {
        const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];
 
        if (rawToken) {
            const hashedToken = hashRefreshToken(rawToken);
            // Best-effort: if it doesn't match any user (already expired/
            // rotated/logged out elsewhere), there's nothing left to revoke.
            await User.updateOne(
                { refreshTokenHash: hashedToken },
                { $unset: { refreshTokenHash: 1 } }
            );
        }
 
        res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions());
 
        res.status(200).json({
            success: true,
            message: "Logged out."
        });
    } catch (err) {
        console.error("LOGOUT ERROR:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
const getCurrentUser = async (req, res) => { 
    try { 
        const user = await User.findById(req.user.id); 
        if (!user) {
            return res.status(404).json({ 
                message: "User not found", 
                success: false 
            }); 
        } 
        res.status(200).json({ 
            success: true, 
            user: user 
        }); 
        } catch (err) { 
            console.error("GET CURRENT USER ERROR:",err); 
            res.status(500).json({ 
                message: "Internal Server Error", 
                success: false 
            }); 
        } 
};

// EMAIL SEND FOR VERIFICATION
const sendVerificationEmailFor = async (user) => {
    const { rawToken, hashedToken } = generateToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = new Date(Date.now() + EMAIL_VERIFICATION_MS);
    await user.save();

    const verifyUrl = `${frontendBaseUrl()}/verify-email/${rawToken}`;
    // User email mein ye link click karega.

    await sendEmail({
        to: user.email,
        subject: "Verify your Arventra email",
        html: `<p>Hi ${user.name},</p>
        <p>Please verify your email address to finish setting up your Arventra account. This link expires in 24 hours:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>If you didn't create this account, you can ignore this email.</p>`
    });
};

//  IMPORTANT :- REAL EMAIL VERIFICATION
const verifyEmail = async (req, res) => {
    try {
        // User clicked:      /verify-email/abc123xyz    Token comes from:req.params.token
        const hashedToken = hashToken(req.params.token);
        const user = await User.findOne({
            // Aisa user dhoondo jiska token same hai AND token ki expiry abhi future mein hai.
            emailVerificationToken: hashedToken,
            emailVerificationExpires: { $gt: new Date() }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "This verification link is invalid or has expired."
            });
        }
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined; // B/c verification once ho gaya.Ab same link ko dobara use karne ki zarurat nahi.
        user.emailVerificationExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully."
        });
    } catch (err) {
        console.error("VERIFY EMAIL ERROR:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// FOR :- "Verification link not recieved, send again"
const resendVerification = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        const genericResponse = {
            success: true,
            message: "If an account with that email exists and isn't verified yet, a new verification link has been sent."
        };
        if (!user || user.isEmailVerified) {  //agr user nhi hai ya pehle se verified hai
            return res.status(200).json(genericResponse);
        }

        try {
            await sendVerificationEmailFor(user);
        } catch (emailErr) {
            console.error("RESEND VERIFICATION EMAIL ERROR:", emailErr);
        }
        res.status(200).json(genericResponse);
    } catch (err) {
        console.error("RESEND VERIFICATION ERROR:", err);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
};
const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        // Same response whether or not the account exists — otherwise this
        // endpoint becomes an account-enumeration oracle.
        const genericResponse = {
            success: true,
            message: "If an account with that email exists, a password reset link has been sent."
        }; 
        if (!user) {
            return res.status(200).json(genericResponse);
        }
        const { rawToken, hashedToken } = generateToken();
        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = new Date(Date.now() + PASSWORD_RESET_MS);
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

        try {
            await sendEmail({
                to: user.email,
                subject: "Reset your Arventra password",
                html: `<p>Hi ${user.name},</p>
                <p>We received a request to reset your password. This link expires in 30 minutes:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                <p>If you didn't request this,you can safely ignore this email — your password won't be changed.</p>`
            });
        } catch (emailErr) {
            console.error("FORGOT PASSWORD EMAIL ERROR:", emailErr);
            // Roll back the token so a failed send doesn't leave a dangling
            // reset link the user can never actually receive. :- refer to line 225 and 226
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            return res.status(500).json({
                success: false,
                message: "Could not send reset email. Please try again later."
            });
        }
        res.status(200).json(genericResponse);
    } catch (err) {
        console.error("FORGOT PASSWORD ERROR:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        // Now user actually clicks the reset link.
        const hashedToken = hashToken(req.params.token);
        //ab ye jo hashedToken hai to wo already mera db mai hona chaiye to be eligible to reset
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "This reset link is invalid or has expired."
            });
        }

        const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;
        user.password = await bcrypt.hash(req.body.password, SALT_ROUNDS);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        // A password reset should invalidate any existing session — e.g. an
        // attacker who had the old password shouldn't stay logged in.
        user.refreshTokenHash = undefined;
        // "Password change hua hai, purane login sessions ko invalidate kar do."

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password has been reset successfully. Please log in."
        });
    } catch (err) {
        console.error("RESET PASSWORD ERROR:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports={
    registerUser, loginUser, getCurrentUser,refreshAccessToken,
    logoutUser,verifyEmail, resendVerification,
    forgotPassword, resetPassword
}