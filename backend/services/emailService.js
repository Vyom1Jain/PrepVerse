const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yourplatformemail@gmail.com',
    pass: 'your_app_password'
  }
});
async function sendOTP(email, otp) {
  return transporter.sendMail({
    to: email,
    subject: 'Your PrepVerse OTP',
    text: `Your OTP for PrepVerse sign up/reset is: ${otp}`
  });
}
module.exports = { sendOTP };
