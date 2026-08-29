const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
    if (transporter) return transporter;

    transporter = nodemailer.createTransport({
        // Explicit host/port instead of the "service: gmail" shorthand —
        // the shorthand doesn't expose a `family` option, and Render's
        // network can't route the IPv6 address Gmail's SMTP sometimes
        // resolves to, causing ENETUNREACH. Forcing IPv4 avoids that.
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_APP_PASSWORD
        },
        family: 4
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