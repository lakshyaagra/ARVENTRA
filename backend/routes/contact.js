const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const validateContact = require("../middleware/validateContact");

const {createContact,getMyContacts,deleteContactById}=require("../controllers/contactController");


router.post("/",authMiddleware,validateContact,createContact);
router.get("/",authMiddleware,getMyContacts);
router.delete("/:id",authMiddleware,deleteContactById);

module.exports = router;