const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000; // Render assigns PORT

app.use(cors({ origin: 'https://mhnursinghomes.co.uk' }));
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use env variable
    pass: process.env.EMAIL_PASS, // Use env variable
  },
});

transporter.verify((error, success) => {
  if (error) console.error('Transporter verification failed:', error);
  else console.log('Transporter is ready to send emails');
});

app.post('/api/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  console.log('Received form data:', { name, email, message });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, // Same as sender for simplicity
    subject: `New Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});