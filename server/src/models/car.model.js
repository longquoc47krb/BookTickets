const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    numberOfSeat: {
      type: Number,
      required: true,
    },
    statusActive: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model("Car", carSchema, "Car");

module.exports = Car;
