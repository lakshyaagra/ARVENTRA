const express = require("express");
const app = express();
const dashboardRouter=require('./routes/dashboard');
const loansRouter=require('./routes/loans');

app.use("/dashboard",dashboardRouter);
app.use("/loans",loansRouter);

// part of index.js file
app.get("/", (req, res) => {
    res.send("Welcome to Financial OS Backend 🚀");
});

app.listen(3000, () => {
    console.log("Server is running on Port 3000");
});