const nodemailer = require("nodemailer");
 
let transporter = null;
 
const getTransporter = () => {
    if (transporter) return transporter;
 
    transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });
 
    return transporter;
};
 
// Fire-and-forget from the caller's perspective is tempting but wrong here —
// callers await this so a delivery failure can be logged/surfaced rather
// than silently vanishing.
const sendEmail = async ({ to, subject, html }) => {
    const mailer = getTransporter();
 
    await mailer.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html
    });
};

module.exports = sendEmail;