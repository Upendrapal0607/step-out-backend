const mongoose = require("mongoose");
require("dotenv").config();
const BookingSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      trim: true,
    },

    train_details: {},
  },
  {
    timestamps: true,
  }
  //   { bufferTimeoutMS: 30000 }
);
BookingSchema.index({ userId: 1 });
// trainSchema.index({source : 1});
// trainSchema.index({destination : 1});

const BookingModel = mongoose.model("BookedTicket", BookingSchema);

module.exports = BookingModel;
