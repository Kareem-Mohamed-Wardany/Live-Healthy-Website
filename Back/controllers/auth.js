
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const ApiResponse = require('../custom-response/ApiResponse');

const User = require("../models/user");
const RadioCenter = require("../models/radiologyCenter");

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

  const token = user.createJWT();
  const response = new ApiResponse({
    msg: 'User logged in successfully',
    data: { user: { userId: user._id, accountType: user.accountType }, token },
    statusCode: StatusCodes.OK,
  });
  res.status(response.statusCode).json(response);
};

// exports.signup = async function (req, res, next) {

//   const email = req.body.mail.lowercase();
//   const name = req.body.name;
//   const phone = req.body.phone;
//   const birth = req.body.birth;
//   const gender = req.body.gender;
//   const accountType = req.body.accountType;
//   const password = req.body.password;
//   const hashedPW = await bcrypt.hash(password, 12);

// untType === "specialist" || accountType === "consultant") {
//   const university = req.body.university;
//   const IDFront = req.files.IDFront[0].path;
//   const IDBack = req.files.IDBack[0].path;
//   const ProfFront = req.files.ProfessionLicenseFront[0].path;
//   const ProfBack = req.files.ProfessionLicenseBack[0].path;
//   console.log(IDFront)
//   user = new User({
//     mail: email,
//     password: hashedPW,
//     name: name,
//     accountType: accountType,
//     phone: phone,
//     dateOfBirth: birth,
//     gender: gender,
//     docData: {
//       university: university,
//       IDFront: IDFront,
//       IDBack: IDBack,
//       ProfFront: ProfFront,
//       ProfBack: ProfBack,
//     },
//   });
// }
// if (accountType === "radiologist") {
//   const centerName = req.body.centerName;
//   const code = req.body.code;
//   const center = await RadioCenter.findOne({ name: centerName });
//   if (code !== center.code)
//     res.status(404).json({ message: "Invalid Code" });
//   user = new User({
//     mail: email,
//     password: hashedPW,
//     name: name,
//     accountType: accountType,
//     phone: phone,
//     dateOfBirth: birth,
//     gender: gender,
//     centerID: center._id,
//   });
// }


// exports.login = async function (req, res, next) {
//   const { email, password } = req.body;

//   try {
//     const loadedUser = await User.findOne({ mail: email });
//     if (!loadedUser) {
//       const error = new Error("A user with this email could not be found.");
//       error.statusCode = 401;
//       throw error;
//     }

//     const isEqual = await bcrypt.compare(password, loadedUser.password);
//     if (!isEqual) {
//       const error = new Error("Wrong password!");
//       error.statusCode = 401;
//       throw error;
//     }

//     const token = jwt.sign(
//       {
//         mail: loadedUser.mail,
//         userId: loadedUser._id.toString(),
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({
//       token,
//       userId: loadedUser._id.toString(),
//       userType: loadedUser.accountType,
//     });
//   } catch (err) {
//     if (!err.statusCode) err.statusCode = 500;
//     next(err);
//   }
// };
