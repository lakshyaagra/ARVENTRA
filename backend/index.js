const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to Financial OS Backend 🚀");
});

app.listen(3000, () => {
    console.log("Server is running on Port 3000");
});