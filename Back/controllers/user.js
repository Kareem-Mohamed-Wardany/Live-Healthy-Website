const User = require("../models/user");
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError, UnauthenticatedError } = require('../errors');
const ApiResponse = require('../custom-response/ApiResponse');

exports.getUser = async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user)
        throw new UnauthenticatedError("Not Authorized")
    const response = new ApiResponse({
        msg: "user retrieved successfully",
        data: user,
        statusCode: StatusCodes.OK,
    });
    res.status(response.statusCode).json(response);
};

exports.updateUserBalance = async (req, res, next) => {
    const updatedBalance = req.body.balance;
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true });
    if (!user)
        throw new UnauthenticatedError("Not Authorized")
    const response = new ApiResponse({
        msg: "Balance updated successfully",
        data: null,
        statusCode: StatusCodes.OK,
    });
    res.status(response.statusCode).json(response);
}
exports.updateUserVip = async (req, res, next) => {
    const updatedBalance = req.body.balance;
    const { level, expireDate } = req.body.vip
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true });
    if (!user)
        throw new UnauthenticatedError("Not Authorized")
    const response = new ApiResponse({
        msg: "User VIP updated successfully",
        data: null,
        statusCode: StatusCodes.OK,
    });
    res.status(response.statusCode).json(response);
}