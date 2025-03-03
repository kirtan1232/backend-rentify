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
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; background-color: #f4f4f4; border-radius: 8px;">
        <h1 style="color: #333; text-align: center;">New Contact Form Submission</h1>
        <p style="color: #555; font-size: 14px; text-align: center;">You have received a new contact form submission. Details are as follows:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold; width: 30%;">Full Name</td>
            <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Phone Number</td>
            <td style="padding: 10px;font-weight: bold; border: 1px solid #ddd;">${phoneNumber}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Email</td>
            <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Location</td>
            <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">${location}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Rental Type</td>
            <td style="padding: 10px;font-weight: bold;  border: 1px solid #ddd;">${rentalType}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Tole/Area</td>
            <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">${toleArea}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Message</td>
            <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">${message}</td>
          </tr>
        </table>
      </div>
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