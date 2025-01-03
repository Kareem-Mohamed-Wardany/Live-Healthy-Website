
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')
const ApiResponse = require('../custom-response/ApiResponse');
const sendEmail = require("../util/mailer")


const User = require("../models/user");
const RadioCenter = require("../models/radiologyCenter");
const generateCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  let length = 27;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
};

exports.register = async (req, res) => {
  const { accountType } = req.body
  let user
  if (accountType === "radiologist") {
    const centerId = req.body.id;
    const code = req.body.code;
    if (!centerName || !code)
      throw new BadRequestError("Provide Center Name or Code")
    const center = await RadioCenter.findById(centerId);
    if (code !== center.code)
      throw new BadRequestError("Invalid Center Code")
    user = await User.create({ ...req.body, centerID: center._id });
  }
  else if (accountType === 'specialist' || accountType === 'consultant') {
    const university = req.body.university
    const IDFront = req.files.IDFront[0].path;
    const IDBack = req.files.IDBack[0].path;
    const ProfFront = req.files.ProfessionLicenseFront[0].path;
    const ProfBack = req.files.ProfessionLicenseBack[0].path;
    req.body.docData = { university, IDFront, IDBack, ProfFront, ProfBack }
    user = await User.create({ ...req.body });
  }
  else
    user = await User.create({ ...req.body });
  const token = user.createJWT();
  const response = new ApiResponse({
    msg: 'User registered successfully',
    data: { user: { _id: user._id, accountType: user.accountType }, token },
    statusCode: StatusCodes.CREATED,
  });
  res.status(response.statusCode).json(response);
};

exports.login = async (req, res) => {
  const { mail, password } = req.body;

  if (!mail || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ mail });
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  if (user.accountType === 'specialist' || user.accountType === 'consultant') {
    if (!user.docData.verified) {
      throw new UnauthenticatedError("Please be patient We are checking your documents!");
    }
  }

  const token = user.createJWT();
  const response = new ApiResponse({
    msg: 'User logged in successfully',
    data: { user: { userId: user._id, accountType: user.accountType }, token },
    statusCode: StatusCodes.OK,
  });
  res.status(response.statusCode).json(response);
};


exports.forgetPassword = async (req, res, next) => {
  const mail = req.body.email;
  const user = await User.findOne({ mail });
  if (!user)
    throw new UnauthenticatedError("Email does not exists, Create a new User!");

  // Send email with reset link
  // Generate token and store it in the user's document
  const resetToken = generateCode();
  user.passwordToken = resetToken;
  // Set expire time for the token
  user.passwordTokenExpirationDate = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send email with reset link to the user's email address
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
        <div class="header">Password Reset Request</div>
        <div class="content">
          <p>Dear ${user.name},</p>
          <p>
            We received a request to reset your password associated with the email address ${user.mail}. If you made this request, please click the button below to reset your password.
          </p>
          <div class="button-container">
            <a href="${process.env.PLATFORM_URL}/reset-password?token=${user.passwordToken}&email=${user.mail}" class="button">Reset Password</a>
          </div>
          <p>
            If you did not request a password reset, please ignore this email. Your password will not be changed.
          </p>
          <p>
            If you need further assistance, feel free to contact our support team.
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
  await sendEmail(user.mail, "Password Reset Request", emailContent)

  // On clicking the reset link, the user should be redirected to a reset password page
  // On resetting password, update the user's password in the database and remove the token
  // Set a success message to the user that their password has been reset successfully
  // Redirect the user to the login page
  const response = new ApiResponse({
    msg: "Password Reset instructions sent successfully to your E-mail",
    data: null,
    statusCode: StatusCodes.OK,
  });
  res.status(response.statusCode).json(response);
}

exports.resetPassword = async (req, res, next) => {
  const { token, mail, newPassword } = req.body;
  if (!token || !mail || !newPassword) {
    throw new BadRequestError("Token, email, and new password are required")

  }
  const user = await User.findOne({ passwordToken: token, mail });
  if (!user || user.passwordTokenExpirationDate <= Date.now()) {
    throw new UnauthenticatedError("Invalid or expired password reset token");
  }
  user.password = newPassword;
  user.passwordToken = null;
  user.passwordTokenExpirationDate = null;
  await user.save();
  const response = new ApiResponse({
    msg: "Password reset successfully",
    data: null,
    statusCode: StatusCodes.OK,
  });
  res.status(response.statusCode).json(response);
}

