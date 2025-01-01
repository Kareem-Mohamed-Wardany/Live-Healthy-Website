const RadiologyCenter = require("../models/radiologyCenter");
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const ApiResponse = require('../custom-response/ApiResponse');

exports.getAllRadiologyCenters = async (req, res, next) => {

  const radiologyCenters = await RadiologyCenter.find().select("name");
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