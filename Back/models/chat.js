const mongoose = require("mongoose");

// Chat Schema
const chatSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    messages: [
        {
            sender: String,
            message: String,
            timestamp: { type: Date, default: Date.now },
        },
    ],
    lastUpdated: { type: Date, default: Date.now },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'active', 'finished']
    },
    reason: {
        type: String,
        required: true,
        minlength: [10, 'Reason must be at least 10 characters long'],
        maxlength: [1000, 'Reason must be at most 1000 characters long'],
    }
});
module.exports = mongoose.model("Chat", chatSchema);