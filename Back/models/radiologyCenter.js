const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const radioCenter = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide center name'],
    maxlength: 50,
    minlength: 3,
  },
  address: {
    type: String,
    required: [true, 'Please provide center address'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    match: [
      /^(\+20|0)?1[0125][0-9]{8}$/,
      'Please provide a valid phone number!',
    ],
    unique: true,
  },
  mail: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
});

module.exports = mongoose.model("RadiologyCenter", radioCenter);
