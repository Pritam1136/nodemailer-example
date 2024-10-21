const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secretKey = process.env.SECRET;
let otpStore = {};

// Function to send OTP
const sendOtp = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  // Create transporter for nodemailer
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Your OTP Code",
    html: `
      <body style="background-color: aliceblue; font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0;">
  <table align="center" cellpadding="0" cellspacing="0" style="max-width: 800px; width: 100%; margin: 3rem auto; background-color: aliceblue;">
    <tr>
      <td align="center" style="padding: 1rem;">
        <!-- Logo and Welcome Section -->
        <img src="https://media.licdn.com/dms/image/v2/C4D0BAQH6fJz1s57_eA/company-logo_200_200/company-logo_200_200/0/1630509348990/forwardcode_techstudio_logo?e=1736985600&v=beta&t=nlMSUu3V4zzN6zA9rlbOjdJE7IdnugYYZniJ09UTlNo" 
        alt="logo" style="width: 90px; height: 90px; background-color: white; border-radius: 50%; margin-bottom: 1rem;">
        <p style="font-size: 1.6rem; margin: 2px; text-align: center;">Hi <strong>James,</strong></p>
        <p style="font-size: 1.6rem; margin: 2px; text-align: center;">Just a friendly reminder to verify your email address.</p>
      </td>
    </tr>

    <!-- Process Section -->
    <tr>
      <td align="start" style="background-color: #ffffff; border-radius: 1rem; padding: 2rem 5rem; margin: 1.5rem 0;">
        <p style="font-size: 13px; color: #5e5e5e; text-align: start; margin: 1rem 0 0;">As Diwali approaches, let's celebrate together at the office by honoring our rich culture and creating lasting memories! 
        Here's what we have planned:${otp}</p><br/>
        <ol>
          <li style="font-size: 13px; color: #5e5e5e; text-align: start; margin: 1rem 0 0;">Traditional/Cultural Attire Day (30/10/2024): Wear your traditional outfits, like sarees, kurtas, or attire from your culture, and bring Diwali's vibrant spirit to the workplace.</li>
          <li style="font-size: 13px; color: #5e5e5e; text-align: start; margin: 1rem 0 0;">Workspace Decoration: Get creative! Decorate your desks with colourful rangoli, lights, and traditional Diwali items.</li>
          <li style="font-size: 13px; color: #5e5e5e; text-align: start; margin: 1rem 0 0;">Diwali Treats & Sweets: Enjoy delicious Diwali snacks and sweets.</li>
          <li style="font-size: 13px; color: #5e5e5e; text-align: start; margin: 1rem 0 0;">Diwali Gift: A surprise gift for everyone to spread joy and celebrate together.</li>
        </ol>
        <br/>
        <p style="font-size: 13px; color: #5e5e5e; text-align: start; margin: 1rem 0 0;">We hope this celebration brings us closer and helps us appreciate our cultural richness. Please mark your calendars for 30/10/24 and join in the festivities. If you have questions or suggestions, feel free to reach out.</p>
        <br/>
        <p style="font-size: 13px; color: #5e5e5e; text-align: start; margin: 1rem 0 0;">Wishing you & your family a joyful and prosperous Diwali in advance!</p>
      </td>
    </tr>

    <!-- Signature Section -->
    <tr style="padding: 1rem;" align="start">
  <td>
    <table width="100%" style="text-align: start;">
      <tr>
        <td style="padding-bottom: 1rem;" width="90">
          <img src="https://media.licdn.com/dms/image/v2/C4D0BAQH6fJz1s57_eA/company-logo_200_200/company-logo_200_200/0/1630509348990/forwardcode_techstudio_logo?e=1736985600&v=beta&t=nlMSUu3V4zzN6zA9rlbOjdJE7IdnugYYZniJ09UTlNo" 
          alt="logo" style="width: 90px; height: 90px; background-color: white; margin-bottom: 1rem;">
        </td>
        <td style="padding-left: 1rem;">
          <p style="font-size: 14px; font-weight: bold; color: #333;">TEAM HR</p>
          <p style="font-size: 12px; color: #5e5e5e;">Forwardcode TechStudio</p>
          <p style="font-size: 12px; color: #5e5e5e;">Jamshedpur, JH - 831018</p>
          <p style="font-size: 12px; color: #5e5e5e;">hr@forwardcode.in</p>
          <p style="padding-top: 1rem;">
            <a href="#" style="font-size: 12px; color: #007bff; text-decoration: none;">Check what's new:</a>
          </p>
          <p style="font-size: 12px; color: #007bff;">https://forwardcode.in</p>
        </td>
      </tr>
    </table>
  </td>
</tr>


    <!-- Footer Section -->
    <tr>
      <td align="start" style="padding: 1rem;">
        <p style="font-size: 8px; margin: 0;">PLEASE CONSIDER THE ENVIRONMENT BEFORE PRINTING THIS EMAIL.</p>
        <p style="font-size: 8px; margin: 0;">THIS MESSAGE IS INTENDED ONLY FOR THE USE OF THE INDIVIDUAL OR ENTITY TO WHICH IT IS ADDRESSED AND MAY CONTAIN INFORMATION THAT IS PRIVILEGED, CONFIDENTIAL AND EXEMPT FROM DISCLOSURE UNDER APPLICABLE LAW. IF THE READER OF THIS MESSAGE IS NOT THE INTENDED RECIPIENT, OR THE EMPLOYEE OR AGENT RESPONSIBLE FOR DELIVERING THE MESSAGE TO THE INTENDED RECIPIENT, YOU ARE HEREBY NOTIFIED THAT ANY DISSEMINATION, DISTRIBUTION OR COPYING OF THIS COMMUNICATION IS STRICTLY PROHIBITED. IF YOU HAVE RECEIVED THIS COMMUNICATION IN ERROR, PLEASE NOTIFY US IMMEDIATELY BY TELEPHONE AND/OR RETURN E-MAIL. THANK YOU</p>
      </td>
    </tr>
  </table>
</body>
`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending OTP" });
    }
    res.status(200).json({ message: `OTP sent to ${email}`, info });
    console.log("send otp");

    // Clear OTP after 10 minutes
    setTimeout(() => {
      delete otpStore[email];
    }, 600000); // 10 minutes
  });
};

// Function to verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] && otpStore[email] == otp) {
    // OTP is correct, generate a JWT token
    const token = jwt.sign({ email }, secretKey, {
      expiresIn: "1h",
    });

    delete otpStore[email]; // Clear OTP after successful login
    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: "Invalid OTP" });
  }
};

module.exports = { sendOtp, verifyOtp };
