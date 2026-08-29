const { BrevoClient } = require("@getbrevo/brevo");

let brevo = null;

const getClient = () => {
    if (brevo) return brevo;
    brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });
    return brevo;
};

// Same interface as before (to, subject, html) — every caller
// (sendVerificationEmailFor, forgotPassword, resendVerification) needs
// zero changes. EMAIL_FROM must be the exact address verified under
// Senders, Domains & Dedicated IPs > Senders in Brevo's dashboard.
//
// @getbrevo/brevo v6 uses a single BrevoClient with resource namespaces
// (client.transactionalEmails.sendTransacEmail) rather than the older
// per-resource *Api classes (TransactionalEmailsApi) used in v3.x.
const sendEmail = async ({ to, subject, html }) => {
    const client = getClient();

    try {
        await client.transactionalEmails.sendTransacEmail({
            sender: { email: process.env.EMAIL_FROM },
            to: [{ email: to }],
            subject,
            htmlContent: html
        });
    } catch (err) {
        console.error("BREVO ERROR BODY:", JSON.stringify(err.response?.body || err.body || err.message));
        throw err;
    }
};

module.exports = sendEmail;