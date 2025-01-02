const User = require("../models/user");
const Appointment = require("../models/appointment");
const sendEmail = require('../util/mailer')

const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const ApiResponse = require('../custom-response/ApiResponse');



exports.createAppointment = async (req, res) => {
    const userId = req.user.userId
    req.body.patientId = userId

    const appointment = await Appointment.create({ ...req.body })
    if (!appointment) {
        throw new BadRequestError("Failed to create appointment")
    }
    const response = new ApiResponse({
        msg: "Appointment created successfully",
        data: appointment,
        statusCode: StatusCodes.CREATED,
    });
    res.status(response.statusCode).json(response);
}

exports.getMyAppointment = async (req, res) => {
    const userId = req.user.userId
    const appointments = await Appointment.findOne({ patientId: userId })
    if (!appointments) {
        throw new NotFoundError("No appointments found for this user")
    }
    const response = new ApiResponse({
        msg: "Appointments retrieved successfully",
        data: appointments,
        statusCode: StatusCodes.OK,
    });
    res.status(response.statusCode).json(response);
}

exports.getPendingAppointments = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 items per page

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the skip value
    const skip = (pageNumber - 1) * limitNumber;

    const appointments = await Appointment.find({ status: 'pending' }).populate("patientId").skip(skip).limit(limitNumber);

    if (!appointments) {
        throw new NotFoundError("No pending appointments found for this doctor")
    }

    const totalCount = await Appointment.countDocuments({ status: 'pending' });

    const response = new ApiResponse({
        msg: "Pending appointments retrieved successfully",
        data: {
            appointments: appointments,
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

exports.appointmentAccept = async (req, res) => {
    const appointmentId = req.params.id
    const docId = req.user.userId
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status: 'accepted', doctorId: docId }, { new: true })
    if (!appointment) {
        throw new NotFoundError("Appointment not found")
    }
    const patient = await User.findById(appointment.patientId)
    const doc = await User.findById(docId)

    // await sendEmail({
    //     patient.mail,
    //     "Appointment Accepted",
    //     text: `Your appointment with Dr. ${appointment.doctor.name} has been accepted. Please arrive at ${appointment.date} at ${appointment.time}.`,
    // })
    const response = new ApiResponse({
        msg: "Appointment accepted successfully",
        data: null,
        statusCode: StatusCodes.OK,
    });
    res.status(response.statusCode).json(response);
}

exports.appointmentCancel = async (req, res) => {
    const appointmentId = req.params.id
    const docId = req.user.userId
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status: 'pending', doctorId: null }, { new: true })
    if (!appointment) {
        throw new NotFoundError("Appointment not found")
    }
    const patient = await User.findById(appointment.patientId)
    const doc = await User.findById(docId)

    // await sendEmail({
    //     patient.mail,
    //     "Appointment Accepted",
    //     text: `Your appointment with Dr. ${appointment.doctor.name} has been accepted. Please arrive at ${appointment.date} at ${appointment.time}.`,
    // })
    const response = new ApiResponse({
        msg: "Appointment cancelled successfully",
        data: null,
        statusCode: StatusCodes.OK,
    });
    res.status(response.statusCode).json(response);
}

exports.getMyAppointments = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 items per page
    const docId = req.user.userId

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the skip value
    const skip = (pageNumber - 1) * limitNumber;

    const appointments = await Appointment.find({ status: 'accepted', doctorId: docId }).populate("patientId").skip(skip).limit(limitNumber);

    if (!appointments) {
        throw new NotFoundError("No pending appointments found for this doctor")
    }

    const totalCount = await Appointment.countDocuments({ status: 'pending' });

    const response = new ApiResponse({
        msg: "My appointments retrieved successfully",
        data: {
            appointments: appointments,
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