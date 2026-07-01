const express = require("express");
const router = express.Router();


router.get("/history", (req, res) => {
    res.send("Loan History");
});

router.get("/:loanId", (req, res) => {
    res.send(`Loan ID: ${req.params.loanId}`);
});

module.exports = router;