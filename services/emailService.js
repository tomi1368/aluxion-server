const sgMail = require('@sendgrid/mail')

const sendMail = async ({ email, message, subject}) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: email,
        from: {
            name: process.env.COMPANY_NAME,
            email: process.env.ADMIN_EMAIL
        },
        subject: subject,
        html: message,
        replyTo: email
    }
    let status = {
        error: false,
        message: `Email sent to ${email}`
    }
    try {
        await sgMail.send(msg)
    } catch (err) {
        status = {
            error: true,
            message: err
        }
    } finally {
        return status
    }
}

module.exports = { sendMail }