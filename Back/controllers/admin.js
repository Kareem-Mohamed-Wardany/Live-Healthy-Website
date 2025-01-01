const fs = require('fs');
const path = require('path');
const RadiologyCenter = require("../models/radiologyCenter");
const User = require("../models/user");
const sendEmail = require('../util/mailer')

const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const ApiResponse = require('../custom-response/ApiResponse');

const nodemailer = require('nodemailer');

// Create the transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: process.env.EMAIL_USER, // Store your email in an environment variable
    pass: process.env.EMAIL_PASS  // Store your email password in an environment variable
  }
});

exports.getAllRadiologyCenters = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 items per page

  // Convert page and limit to integers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Calculate the skip value
  const skip = (pageNumber - 1) * limitNumber;

  // Fetch paginated data
  const radiologyCenters = await RadiologyCenter.find()
    .skip(skip)
    .limit(limitNumber);

  // Count total documents for pagination meta-data
  const totalCount = await RadiologyCenter.countDocuments();

  if (!radiologyCenters.length) {
    throw new NotFoundError("No radiology centers found");
  }

  // Prepare response
  const response = new ApiResponse({
    msg: "Radiology centers retrieved successfully",
    data: {
      centers: radiologyCenters,
      metaData: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    },
    statusCode: StatusCodes.OK
  });

  res.status(response.statusCode).json(response);
};

const generateCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  let length = 16;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
};

exports.addRadiologyCenter = async (req, res, next) => {
  const code = generateCode();
  req.body.code = code;
  const radiologyCenter = await RadiologyCenter.create(req.body);
  const response = new ApiResponse({
    msg: "Radiology center created successfully",
    data: radiologyCenter,
    statusCode: StatusCodes.CREATED,
  });
  res.status(response.statusCode).json(response);
};

exports.deleteCenter = async (req, res, next) => {
  const id = req.params.id;
  const center = await RadiologyCenter.findByIdAndDelete(id);
  if (!center) {
    throw new NotFoundError("Radiology center not found");
  }
  const response = new ApiResponse({
    msg: "Radiology center deleted successfully",
    statusCode: StatusCodes.OK,
  });
  res.status(response.statusCode).json(response);
};


exports.getAllDoctors = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 items per page

  // Convert page and limit to integers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Calculate the skip value
  const skip = (pageNumber - 1) * limitNumber;

  const doctors = await User.find({ accountType: { $in: ["specialist", "consultant"] } }).select("-password").skip(skip).limit(limitNumber);
  const totalCount = await User.countDocuments({ accountType: { $in: ["specialist", "consultant"] } });
  if (!doctors.length) {
    throw new NotFoundError("No doctors found");
  }
  const response = new ApiResponse({
    msg: "Doctors retrieved successfully",
    data: {
      doctors: doctors,
      metaData: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
        currentPage: pageNumber,
        itemsPerPage: limitNumber,
      },
    },
    statusCode: StatusCodes.OK,
  });
  res.status(response.statusCode).json(response);
}


exports.deleteDoctor = async (req, res) => {
  const doctorId = req.params.id;
  // Get the doctor's data from the database to access file paths
  const doctor = await User.findById(doctorId);

  if (!doctor) {
    throw new NotFoundError("No Doctor found");
  }
  const emailContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #dddddd;
            border-radius: 8px;
            background-color: #f9f9f9;
          }
          .header {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #FF0000;
            margin-bottom: 20px;
          }
          .content {
            font-size: 16px;
            margin-bottom: 20px;
          }
          .button-container {
            text-align: center;
            margin-top: 20px;
          }
          .button {
            display: inline-block;
            background-color: #007BFF;
            color: #ffffff;
            padding: 15px 25px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 18px;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
          }
          .button:hover {
            background-color: #0056b3;
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
          }
          .footer {
            font-size: 14px;
            color: #555555;
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">Profile Verification Failed</div>
          <div class="content">
            <p>Dear ${doctor.name},</p>
            <p>
              Unfortunately, your current profile did not meet the necessary requirements for verification.
            </p>
            <p>
              To ensure a seamless experience on our platform, we kindly ask you to create a new account with all the correct and complete information.
            </p>
            <p>
              Please make sure to provide accurate details and upload all required documents during the registration process. This will help us verify your profile without any issues.
            </p>
            <div class="button-container">
              <a href="${process.env.PLATFORM_URL}/signup" class="button">Create New Account</a>
            </div>
            <p>
              If you have any questions or need further assistance, feel free to reach out to our support team at any time.
            </p>
          </div>
          <div class="footer">
            Best regards, <br />
            LiveHealthy Support Team
          </div>
        </div>
      </body>
    </html>
    `;

  sendEmail(doctor.mail, 'Your Doctor Profile Verification Failed', emailContent)

  // File paths to be removed (replace with your specific file fields)
  const rootDir = process.cwd();
  const filePaths = [
    path.join(rootDir, `${doctor.docData.IDFront}`),
    path.join(rootDir, `${doctor.docData.IDBack}`),
    path.join(rootDir, `${doctor.docData.ProfFront}`),
    path.join(rootDir, `${doctor.docData.ProfBack}`)
  ];
  filePaths.forEach((filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      }
    });
  });
  // Proceed to delete the doctor record
  const deletedUser = await User.findByIdAndDelete(doctorId);
  if (!deletedUser) {
    throw new NotFoundError("No Doctor found");
  }
  const response = new ApiResponse({
    msg: "Doctor deleted successfully",
    statusCode: StatusCodes.OK,
  });
  res.status(response.statusCode).json(response);
};

exports.verifyDoctor = async (req, res, next) => {
  const id = req.params.id;
  const doctor = await User.findByIdAndUpdate(id, { $set: { "docData.verified": true } })  // Set only the "verified" field to true
  // const doctor = await User.findById(id);
  if (!doctor) {
    throw new NotFoundError("Doctor not found");
  }
  const emailContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #dddddd;
            border-radius: 8px;
            background-color: #f9f9f9;
          }
          .header {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #007BFF;
            margin-bottom: 20px;
          }
          .content {
            font-size: 16px;
            margin-bottom: 20px;
          }
          .footer {
            font-size: 14px;
            color: #555555;
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">Congratulations, ${doctor.name}!</div>
          <div class="content">
            <p>We are thrilled to inform you that your profile has been successfully verified! 🎉</p>
            <p>
              With your verified status, you can now offer your professional services to patients 
              with added credibility and trust. This recognition will enhance your reputation and 
              help you connect with more patients effectively.
            </p>
            <p>
              If you have any questions or require assistance, our support team is here to help. 
              Feel free to reach out at any time.
            </p>
            <p>Thank you for being a valued member of our platform. We wish you great success in your journey ahead!</p>
          </div>
          <div class="footer">
            Best regards, <br />
            The Team
          </div>
        </div>
      </body>
    </html>
    `;

  // To Do
  // Send the email
  sendEmail(doctor.mail, 'Your Doctor Profile is Now Verified', emailContent)

  const response = new ApiResponse({
    msg: "Doctor verified successfully",
    statusCode: StatusCodes.OK,
  });
  res.status(response.statusCode).json(response);
};