const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const radioCenter = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
  password: {
    type: String,
  },
});

module.exports = mongoose.model("RadiologyCenter", radioCenter);
