const User = require("../models/user");
const Chat = require("../models/chat");

const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const ApiResponse = require('../custom-response/ApiResponse');


exports.createChatReq = async (req, res) => {
    const userId = req.user.userId
    req.body.patientId = userId
    const patient = await User.findById(userId)
    if (patient.balance < 150)
        throw new BadRequestError("Insufficient balance to create appointment")
    patient.balance -= 150
    await patient.save()

    const newchat = await Chat.create({ ...req.body })
    if (!newchat) {
        throw new BadRequestError("Failed to create appointment")
    }
    const response = new ApiResponse({
        msg: "Chat Request created successfully, 150 coins withdrawed",
        data: null,
        statusCode: StatusCodes.CREATED,
    });
    res.status(response.statusCode).json(response);
}

exports.getChatReq = async (req, res) => {
    const userId = req.user.userId
    const reqchat = await Chat.findOne({ patientId: userId, status: { $ne: 'finished' } }).populate("doctorId", "name")

    if (!reqchat) {
        throw new NotFoundError("No chats found for this user")
    }
    const response = new ApiResponse({
        msg: "Chat retrieved successfully",
        data: reqchat,
        statusCode: StatusCodes.OK,
    });
    res.status(response.statusCode).json(response);
}

exports.getPendingChats = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 items per page

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the skip value
    const skip = (pageNumber - 1) * limitNumber;

    const chats = await Chat.find({ status: 'pending' }).populate("patientId", "name gender dateOfBirth phone mail address healthStatus").skip(skip).limit(limitNumber);

    if (!chats) {
        throw new NotFoundError("No pending chats found")
    }

    const totalCount = await Chat.countDocuments({ status: 'pending' });

    const response = new ApiResponse({
        msg: "Pending appointments retrieved successfully",
        data: {
            chats: chats,
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


exports.chatAccept = async (req, res) => {
    const chatId = req.params.id
    const docId = req.user.userId
    const chat = await Chat.findByIdAndUpdate(chatId, { status: 'active', doctorId: docId }, { new: true })
    if (!chat) {
        throw new NotFoundError("chat not found")
    }
    const response = new ApiResponse({
        msg: "Chat accepted successfully",
        data: null,
        statusCode: StatusCodes.OK,
    });
    res.status(response.statusCode).json(response);
}


exports.getMyChats = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 items per page
    const docId = req.user.userId

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the skip value
    const skip = (pageNumber - 1) * limitNumber;

    const chats = await Chat.find({ status: 'active', doctorId: docId }).populate("patientId", "name gender dateOfBirth phone mail address healthStatus").skip(skip).limit(limitNumber);

    if (!chats) {
        throw new NotFoundError("No pending chats found")
    }

    const totalCount = await Chat.countDocuments({ status: 'pending' });

    const response = new ApiResponse({
        msg: "My chats retrieved successfully",
        data: {
            chats: chats,
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


exports.getChatData = async (req, res) => {
    const chatId = req.params.id
    console.log(chatId)
    const chat = await Chat.findById(chatId).populate("patientId", "name")
    if (!chat) {
        throw new NotFoundError("Chat not found")
    }
    const response = new ApiResponse({
        msg: "Chat data retrieved successfully",
        data: chat,
        statusCode: StatusCodes.OK,
    });
    res.status(response.statusCode).json(response);
}