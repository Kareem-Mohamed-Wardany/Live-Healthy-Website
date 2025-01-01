require('dotenv').config(); // Load environment variables

const nodemailer = require("nodemailer");

// Create a transporter object using your email service's settings
const transporter = nodemailer.createTransport({
    service: 'gmail', // or any email service like 'outlook', 'yahoo', etc.
    auth: {
        user: process.env.EMAIL_USER,  // Use the environment variable for the email address
        pass: process.env.EMAIL_PASS   // Use the environment variable for the password
    }
});

// Email options (who you're sending it to, subject, body, etc.)
const mailOptions = {
    from: process.env.EMAIL_USER,  // Your email address (sender)
    to: 'recipient-email@example.com',  // Recipient's email address
    subject: 'Test Email from Nodemailer',  // Subject line
    text: 'Hello, this is a test email sent using Nodemailer in Node.js.'  // Email body
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error occurred:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});
