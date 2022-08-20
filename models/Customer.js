const mongoose = require("mongoose");
const validator = require("validator");

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, "Please Input First Name!"],
  },
  laseName: {
    type: String,
    trim: true,
    required: [true, "Please Input Lase Name!"],
  },
  email: {
    type: String,
    required: [true, "Please Input Email!"],
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw Error("Please Privide a valid Email Address!");
      }
    },
  },
  phoneNumber: {
    type: Strng,
    required: [true, "Please Input Phone Number!"],
  },
});

module.exports = mongoose.model("Customer", customerSchema);
