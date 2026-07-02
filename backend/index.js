const express = require("express");
const app = express();
app.use(express.json());

const dashboardRouter=require('./routes/dashboard');
const loansRouter=require('./routes/loans');

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

app.post('/goals',(req,res)=>{
    console.log(req.body);
    // res.send("Goal created successfully");
    // res.send(req.body);
    const goal=req.body;
    console.log(goal.goalName);
    // res.send(`Goal "${goal.goalName}" created successfully`);
    res.send({
        message: "Goal Created",
        goal: goal.goalName
    });
    
});
app.use("/dashboard",dashboardRouter);
// app.use("/loans",loansRouter);

// part of index.js file
app.get("/", (req, res) => {
    res.send("Welcome to Financial OS Backend 🚀");
});

app.listen(3000, () => {
    console.log("Server is running on Port 3000");
});