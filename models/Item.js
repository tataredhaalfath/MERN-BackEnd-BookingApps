const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const itemSchema = mongoose.Schema({
  itemName: {
    type: String,
    required: [true, "Please Input Item Name!"],
  },
  unit: {
    type: String,
    required: [true, "Please Input Unit!"],
  },
  itemPrice: {
    type: Number,
    required: [true, "Please Input Item Price!"],
  },
  sumBooked: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
    required: [true, "Please Input Location!"],
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: [true, "Please Input Description!"],
  },
  category: {
    type: ObjectId,
    ref: "Category",
  },
  image: [
    {
      type: ObjectId,
      ref: "Image",
    },
  ],
  feature: [
    {
      type: ObjectId,
      ref: "Feature",
    },
  ],
  info: [
    {
      type: ObjectId,
      ref: "Info",
    },
  ],
});

module.exports = mongoose.model("Item", itemSchema);
