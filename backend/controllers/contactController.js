const Contact = require("../models/Contact");

const createContact = async (req, res) => {
    try {
        const payload = {
            subject: req.body.subject,
            message: req.body.message
        };
        // req.user is set by optionalAuth on this route.
        if (req.user) {
            payload.user = req.user.id;
        } else {
            payload.name = req.body.name;
            payload.email = req.body.email;
        }

        const contact = await Contact.create(payload);
        res.status(201).json({
            success: true,
            message: "Contact request submitted successfully.",
            contact
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const getMyContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({user: req.user.id}).sort({createdAt: -1});
        res.status(200).json({
            success: true,
            contacts
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const deleteContactById = async (req, res) => {
    try {
        const id = req.params.id;
        const contact = await Contact.findOne({
            _id: id,
            user: req.user.id
        });
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact request not found."
            });
        }

        await contact.deleteOne();

        res.status(200).json({
            success: true,
            message: "Contact request deleted."
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {createContact,getMyContacts,deleteContactById};