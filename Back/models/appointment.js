const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const appointmentSchema = new Schema({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    appointmentDate: {
        type: Date,
        required: [true, 'Please provide Appointment Date'],
        validate: {
            validator: function (v) {
                return !isNaN(Date.parse(v)) && v > new Date();
            },
            message: (props) => `${props.value} is not a valid Date!`,
        },
    },
    appointmentTime: {
        type: String,
        required: [true, "Provide Appointment Time"]
    },
    reason: {
        type: String,
        required: true,
        minlength: [10, 'Reason must be at least 10 characters long'],
        maxlength: [1000, 'Reason must be at most 1000 characters long'],
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'accepted', 'cancelled']
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema)
