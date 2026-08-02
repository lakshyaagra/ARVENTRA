const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { simpleInterestCalculator,compoundInterestCalculator,roiCalculator
    ,fdCalculator,rdCalculator,sipCalculator,lumpsumCalculator,
    emiCalculator,incomeTaxCalculator,retirementCalculator
 } = require("../controllers/calculatorsController");

router.get("/simple-interest", authMiddleware, simpleInterestCalculator);
router.get("/compound-interest", authMiddleware, compoundInterestCalculator);
router.get("/return-on-investment", authMiddleware, roiCalculator);
router.get("/fd", authMiddleware, fdCalculator);
router.get("/rd", authMiddleware, rdCalculator);
router.get("/sip", authMiddleware, sipCalculator);
router.get("/lumpsum", authMiddleware, lumpsumCalculator);
router.get("/personal-loan-emi", authMiddleware, emiCalculator);
router.get("/home-loan-emi", authMiddleware, emiCalculator);
router.get("/car-loan-emi", authMiddleware, emiCalculator);
router.get("/education-loan-emi", authMiddleware, emiCalculator);
router.get("/income-tax", authMiddleware, incomeTaxCalculator);
router.get("/retirement", authMiddleware, retirementCalculator);

module.exports = router;