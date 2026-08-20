const express = require("express");
 
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuth");
const validateContact = require("../middleware/validateContact");
 
const {createContact,getMyContacts,deleteContactById}=require("../controllers/contactController");
 
// Public: anyone can submit a contact request. If logged in (token sent),
// it's linked to their account; otherwise name/email are required instead.
router.post("/",optionalAuth,validateContact,createContact);
 
// Account-only: viewing/deleting your own request history requires login.
router.get("/",authMiddleware,getMyContacts);
router.delete("/:id",authMiddleware,deleteContactById);
 
module.exports = router;