const RadiologyCenter = require("../models/radiologyCenter");
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const ApiResponse = require('../custom-response/ApiResponse');

exports.getAllRadiologyCenters = async (req, res, next) => {

  const radiologyCenters = await RadiologyCenter.find();
  if (!radiologyCenters) {
    throw new NotFoundError("No radiology centers found");
  }
  const response = new ApiResponse({
    msg: "Radiology centers retrieved successfully",
    data: radiologyCenters,
    statusCode: StatusCodes.OK,
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
