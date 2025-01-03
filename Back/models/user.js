const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    maxlength: 50,
    minlength: 3,
  },
  accountType: {
    type: String,
    required: true,
    enum: ['admin', 'patient', 'specialist', 'consultant', 'radiologist'],
  },
  address: {
    type: String,
    required: true,
    maxlength: [1000, 'Address must be at most 1000 characters long'],
    minlength: [10, 'Address must be at least 10 characters long'],
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
  dateOfBirth: {
    type: Date,
    required: [true, 'Please provide date of birth'],
    validate: {
      validator: function (v) {
        return !isNaN(Date.parse(v)) && v < new Date();
      },
      message: (props) => `${props.value} is not a valid date of birth!`,
    },
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: [true, 'Please provide gender'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters long'],
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/,
      'Password must contain at least one digit, one lowercase letter, and one uppercase letter.',
    ],
  },
  balance: {
    type: Number,
    default: 0,
  },
  vip: {
    level: {
      type: String,
      default: function () {
        if (this.accountType === 'patient') {
          return 'Basic'
        }
      },
    },
    expireDate: {
      type: Date,
      default: function () {
        if (this.accountType === 'patient') {
          return null
        }
      },

    },
  },
  centerID: {
    type: Schema.Types.ObjectId,
    ref: 'RadiologyCenter',
    required: function () {
      return this.accountType === 'radiologist';
    },
  },
  docData: {
    university: {
      type: String,
      required: function () {
        return ['specialist', 'consultant'].includes(this.accountType);
      },
      maxlength: [20, 'University must be at most 20 characters long'],
      minlength: [5, 'University must be at least 5 characters long'],
    },
    IDFront: {
      type: String,
      required: function () {
        return ['specialist', 'consultant'].includes(this.accountType);
      },
    },
    IDBack: {
      type: String,
      required: function () {
        return ['specialist', 'consultant'].includes(this.accountType);
      },
    },
    ProfFront: {
      type: String,
      required: function () {
        return ['specialist', 'consultant'].includes(this.accountType);
      },
    },
    ProfBack: {
      type: String,
      required: function () {
        return ['specialist', 'consultant'].includes(this.accountType);
      },
    },
    verified: {
      type: Boolean,
      default: function () {
        if (this.accountType === 'specialist' || this.accountType === 'consultant') {
          return false
        }
      }
    },
  },
  healthStatus: {
    bloodType: {
      type: String,
      required: function () {
        return this.accountType === 'patient';
      },
    },
    smoker: {
      type: Boolean,
      required: function () {
        return this.accountType === 'patient';
      },
    },
    HeartDiseases: {
      type: Boolean,
      required: function () {
        return this.accountType === 'patient';
      },
    },
    Diabetes: {
      type: Boolean,
      required: function () {
        return this.accountType === 'patient';
      },
    },
    Cancer: {
      type: Boolean,
      required: function () {
        return this.accountType === 'patient';
      },
    },
    Obesity: {
      type: Boolean,
      required: function () {
        return this.accountType === 'patient';
      },
    },
    Hypertension: {
      type: Boolean,
      required: function () {
        return this.accountType === 'patient';
      },
    },
    Allergies: {
      type: Boolean,
      required: function () {
        return this.accountType === 'patient';
      },
    },
  },
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, accountType: this.accountType },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}

userSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password)
  return isMatch
}


module.exports = mongoose.model('User', userSchema)
