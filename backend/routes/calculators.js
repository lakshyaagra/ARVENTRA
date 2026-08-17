const express = require("express");
const router = express.Router();

const { simpleInterestCalculator,compoundInterestCalculator,roiCalculator
    ,fdCalculator,rdCalculator,sipCalculator,lumpsumCalculator,
    emiCalculator,incomeTaxCalculator,retirementCalculator
 } = require("../controllers/calculatorsController");

router.get("/simple-interest",simpleInterestCalculator);
router.get("/compound-interest",compoundInterestCalculator);
router.get("/return-on-investment",roiCalculator);
router.get("/fd",fdCalculator);
router.get("/rd",rdCalculator);
router.get("/sip",sipCalculator);
router.get("/lumpsum",lumpsumCalculator);
router.get("/personal-loan-emi",emiCalculator);
router.get("/home-loan-emi",emiCalculator);
router.get("/car-loan-emi",emiCalculator);
router.get("/education-loan-emi",emiCalculator);
router.get("/income-tax",incomeTaxCalculator);
router.get("/retirement",retirementCalculator);

module.exports = router;