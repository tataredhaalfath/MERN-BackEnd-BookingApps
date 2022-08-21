const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
  bankName: {
    type: String,
    trim: true,
    required: [true, "Please Input Bank Name!"],
  },
  accountNumber: {
    type: String,
    required: [true, "Please Input Account Number!"],
  },
  accountHolder: {
    type: String,
    required: [true, "Please Input Accouint Holder!"],
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Bank", bankSchema);
