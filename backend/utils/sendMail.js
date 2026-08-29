const { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } = require("@getbrevo/brevo");

let emailApi = null;

const getEmailApi = () => {
    if (emailApi) return emailApi;

    emailApi = new TransactionalEmailsApi();
    emailApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    return emailApi;
};

// Same interface as before (to, subject, html) — every caller
// (sendVerificationEmailFor, forgotPassword, resendVerification) needs
// zero changes. EMAIL_FROM must be the exact address verified under
// Senders, Domains & Dedicated IPs > Senders in Brevo's dashboard.
const sendEmail = async ({ to, subject, html }) => {
    const api = getEmailApi();

    try {
        await api.sendTransacEmail({
            sender: { email: process.env.EMAIL_FROM },
            to: [{ email: to }],
            subject,
            htmlContent: html
        });
    } catch (err) {
        // Brevo puts the useful detail in err.response.body/err.body rather
        // than err.message — surface it so it actually shows in Render logs.
        console.error("BREVO ERROR BODY:", JSON.stringify(err.response?.body || err.body || err.message));
        throw err;
    }
};

module.exports = sendEmail;