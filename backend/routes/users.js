const express=require('express');
const router=express.Router();
const upload=require('../config/multer')

const {registerUser,loginUser}= require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register',registerUser);
router.post('/login',loginUser);
// router.post("/profile/upload",authMiddleware,
//     upload.single("image"),
//     (req,res)=>{
//         res.status(200).json({
//             success:true,
//             body:req.body,
//             file:req.file
//         })
//     }
// )

module.exports=router;