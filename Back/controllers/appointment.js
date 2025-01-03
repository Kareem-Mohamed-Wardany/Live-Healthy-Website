const User = require("../models/user");
const Appointment = require("../models/appointment");
const sendEmail = require('../util/mailer')

const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const ApiResponse = require('../custom-response/ApiResponse');

function convertTo12HourFormat(time) {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 (midnight) and 13-23 to 1-11 PM
    return `${hours}:${minutes} ${period}`;
}




exports.createAppointment = async (req, res) => {
    const userId = req.user.userId
    req.body.patientId = userId
    const patient = await User.findById(userId)
    if (patient.balance < 250)
        throw new BadRequestError("Insufficient balance to create appointment")
    patient.balance -= 250
    await patient.save()

    const appointment = await Appointment.create({ ...req.body })
    if (!appointment) {
        throw new BadRequestError("Failed to create appointment")
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
          color: #28a745; /* Green color for created state */
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
        <div class="header">Appointment Created Successfully</div>
        <div class="content">
          <p>Dear ${patient.name},</p>
          <p>
            We are pleased to inform you that your appointment has been successfully created! Below are the details of your upcoming appointment:
          </p>
          <p><strong>Appointment Date:</strong> ${new Date(appointment.appointmentDate).toDateString()}</p>
          <p><strong>Appointment Time:</strong> ${convertTo12HourFormat(appointment.appointmentTime)}</p>
          <p>
            If you need to make any changes to your appointment, please feel free to contact our support team or visit your dashboard.
          </p>
          <div class="button-container">
            <a href="${process.env.PLATFORM_URL}/appointment" class="button">View Appointment Details</a>
          </div>
          <p>
            Thank you for choosing us for your healthcare needs. We look forward to seeing you at your appointment.
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

    await sendEmail(patient.mail, "Appointment Created", emailContent)

    const response = new ApiResponse({
        msg: "Appointment created successfully, 250 coins withdrawed",
        data: appointment,
        statusCode: StatusCodes.CREATED,
    });
    res.status(response.statusCode).json(response);
}

exports.getMyAppointment = async (req, res) => {
    const userId = req.user.userId
    const appointments = await Appointment.findOne({ patientId: userId, status: { $ne: 'finished' } }).populate("doctorId", "name mail phone address")
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

    const appointments = await Appointment.find({ status: 'pending' }).populate("patientId", "name gender dateOfBirth phone mail address healthStatus").skip(skip).limit(limitNumber);

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
          color: #28a745;
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
        <div class="header">Appointment Accepted</div>
        <div class="content">
          <p>Dear ${patient.name},</p>
          <p>
            We're excited to inform you that your appointment with Dr. ${doc.name} has been confirmed for <strong>${new Date(appointment.appointmentDate).toDateString()}</strong> at <strong>${convertTo12HourFormat(appointment.appointmentTime)}</strong>.
          </p>
          <p>
            You can find more details about the appointment and the doctor by clicking the button below:
          </p>
          <div class="button-container">
            <a href="${process.env.PLATFORM_URL}/appointment" class="button">View Appointment</a>
          </div>
          <p>
            If you need to reschedule or have any questions, please don't hesitate to contact our support team.
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

    await sendEmail(patient.mail, "Appointment Accepted", emailContent)
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
          color: #dc3545; /* Red color for cancellation */
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
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">Appointment Cancelled</div>
        <div class="content">
          <p>Dear ${patient.name},</p>
          <p>
            We regret to inform you that your appointment with Dr. ${doc.name} scheduled for <strong>${new Date(appointment.appointmentDate).toDateString()}</strong> at <strong>${convertTo12HourFormat(appointment.appointmentTime)}</strong> has been cancelled.
          </p>
          <p>
            You will be notified once a new doctor has been assigned to your appointment. In the meantime, you can always check the status of your appointment by visiting your dashboard.
          </p>
          <div class="button-container">
            <a href="${process.env.PLATFORM_URL}/appointment" class="button">View Appointments</a>
          </div>
          <p>
            We apologize for any inconvenience and appreciate your patience. If you have any questions, feel free to contact our support team.
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
    await sendEmail(patient.mail, "Appointment Cancelled", emailContent)
    const response = new ApiResponse({
        msg: "Appointment cancelled successfully",
        data: null,
        statusCode: StatusCodes.OK,
    });
    res.status(response.statusCode).json(response);
}

exports.appointmentFinish = async (req, res) => {
    const appointmentId = req.params.id
    const docId = req.user.userId
    const appointment = await Appointment.findById(appointmentId)
    if (!appointment) {
        throw new NotFoundError("Appointment not found")
    }
    const appDate = new Date(appointment.appointmentDate).toISOString()
    const appointmentTime = appointment.appointmentTime
    const appointmentDateTime = new Date(`${appDate.split('T')[0]}T${appointmentTime}:00`);
    const appDate2 = new Date(appointment.appointmentDate).toISOString().split('T')[0]

    // Get the current date and time
    const currentDateTime = new Date();

    // Check if the appointment date and time is in the future
    const isAppointmentInFuture = appointmentDateTime > currentDateTime;

    if (isAppointmentInFuture) {
        throw new BadRequestError("This appointment is in the future! can not be finished")
    }
    appointment.status = 'finished'
    await appointment.save()
    const patient = await User.findById(appointment.patientId)
    const doc = await User.findById(docId)
    doc.balance = doc.balance + 200
    await doc.save()

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
          color: #28a745; /* Green color for finished state */
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
        <div class="header">Appointment Finished</div>
        <div class="content">
          <p>Dear ${patient.name},</p>
          <p>
            We are pleased to inform you that your appointment with Dr. ${doc.name} scheduled for <strong>${new Date(appointment.appointmentDate).toDateString()}</strong> at <strong>${convertTo12HourFormat(appointment.appointmentTime)}</strong> has been successfully completed.
          </p>
          <p>
            We hope your visit was helpful. If you have any questions or need further assistance, feel free to reach out to our support team.
          </p>
          <p>
            Thank you for choosing us for your healthcare needs. We look forward to serving you again in the future.
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

    await sendEmail(patient.mail, "Appointment Finished", emailContent)
    const response = new ApiResponse({
        msg: "Appointment finished successfully, Coins added to your account",
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

    const appointments = await Appointment.find({ status: 'accepted', doctorId: docId }).populate("patientId", "name gender dateOfBirth phone mail address healthStatus").skip(skip).limit(limitNumber);

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