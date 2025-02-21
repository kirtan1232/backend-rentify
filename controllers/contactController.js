const nodemailer = require('nodemailer');
require('dotenv').config();

exports.sendContactForm = async (req, res) => {
  const { fullName, phoneNumber, email, location, rentalType, toleArea, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: 'rentify20@gmail.com',
    subject: 'New Contact Form Submission',
    text: `
      Full Name: ${fullName}
      Phone Number: ${phoneNumber}
      Email: ${email}
      Location: ${location}
      Rental Type: ${rentalType}
      Tole/Area: ${toleArea}
      Message: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
};
