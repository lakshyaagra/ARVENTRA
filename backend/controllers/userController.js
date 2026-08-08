const bcrypt=require('bcrypt')
const User=require('../models/User');
const jwt=require('jsonwebtoken');

const registerUser=async (req,res)=>{
    try{
        const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
        req.body.password = hashedPassword;
        const user = await User.create(req.body);
        // user.password = undefined; //password ko response me nahi bhejna chahte , isliye undefined kar diya
        res.status(201).json({
            message: "User Registered",
            success: true,
            user: user
        })
    }
    catch(err){
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}
// ab tk register krne se databse mai mera information phch ya keh skte hai store ho chuka hai
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
        //JWT WILL BE GENERATED AND SENT TO THE USER AS TOKEN AFTER SUCCESSFULLY BEING LOGIN
        const token=jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            { expiresIn: "7d"}
        )
        res.status(200).json({
            message: "User Logged In",
            success: true,
            token: token
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}

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

module.exports={registerUser, loginUser, getCurrentUser}