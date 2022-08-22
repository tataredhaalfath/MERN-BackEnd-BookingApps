const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const infoSchema = mongoose.Schema({
  infoName: {
    type: String,
    required: [true, "Please Input Info Name!"],
  },
  type: {
    type: String,
    required: [true, "Please Input Info Type!"],
  },
  imageUrl: {
    type: String,
    required: true,
  },
  isHightLight: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: [true, "Please Input Description!"],
  },
  item: [
    {
      type: ObjectId,
      ref: "Item",
    },
  ],
});

module.exports = mongoose.model("Info", infoSchema);
