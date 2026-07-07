require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());

// const dashboardRouter=require('./routes/dashboard');
// const loansRouter=require('./routes/loans');
const connectDB=require('./config/db');
const goalsRouter=require('./routes/goals');

app.use("/goals", goalsRouter);
// app.use((req,res,next)=>{

//     console.log(`${req.method} request for ${req.url}`);

//     next();
// })
// app.use((req,res,next)=>{

//     console.log("authentication middleware");

//     next();
// })
// app.use((req,res,next)=>{

//     const isLoggedIn=false;
//     if(!isLoggedIn){
//         return res.send("Please Login first");
//     }
//     // console.log(`${req.method} request for ${req.url}`);

//     next();
// })

// app.post('/goals',validateGoal,createGoal);


// app.use("/loans",loansRouter);

// part of index.js file
app.get("/", (req, res) => {
    res.send("Welcome to Financial OS Backend 🚀");
});

app.listen(3000, () => {
    console.log("Server is running on Port 3000");
});