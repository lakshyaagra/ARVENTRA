const { Resend } = require("resend");

let resend = null;

const getResendClient = () => {
    if (resend) return resend;
    resend = new Resend(process.env.RESEND_API_KEY);
    return resend;
};

// Same interface as before (to, subject, html) — every caller
// (sendVerificationEmailFor, forgotPassword, resendVerification) needs
// zero changes. Only the delivery mechanism changed: this now sends over
// HTTPS via Resend's API instead of raw SMTP, which Render's free tier
// blocks outbound (ports 25/465/587) as of Sep 2025.
const sendEmail = async ({ to, subject, html }) => {
    const client = getResendClient();

    const { data, error } = await client.emails.send({
        from: process.env.EMAIL_FROM, // must be a verified sender/domain in your Resend account
        to,
        subject,
        html
    });

    if (error) {
        // Surface it the same way a thrown SMTP error used to — callers
        // already await sendEmail and handle/log failures themselves.
        throw new Error(error.message || "Failed to send email via Resend");
    }

    return data;
};

module.exports = sendEmail;