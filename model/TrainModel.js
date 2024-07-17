const mongoose = require("mongoose");
require("dotenv").config();
const trainSchema = mongoose.Schema(
  {
    train_name: {
      type: String,
      trim: true,
    },
    train_number: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },
    destination: {
      type: String,
      trim: true,
    },
    seat_opacity: {
      type: Number,
      min: 1,
      default: 50,
    },
    seats_available: {
      type: Number,
      required: true,
      min: 0,
    },
    arrival_time_at_source: {
      type: String,
      required: true,
    },
    arrival_time_at_destination: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
  //   { bufferTimeoutMS: 30000 }
);
trainSchema.index({ train_name: 1 });
trainSchema.index({ source: 1 });
trainSchema.index({ destination: 1 });

const TrainModel = mongoose.model("tainData", trainSchema);

module.exports = TrainModel;
