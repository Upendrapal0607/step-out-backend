const express = require("express");
const auth = require("../middleware/auth");
const BookingModel = require("../model/booking");


const BookingRoute = express.Router();
BookingRoute.post("/booking", async (req, res) => {
  const { userId, train_details } = req.body;

  try {
    const trainData = new BookingModel({ userId, train_details });
    await trainData.save();
    return res.send({
      status: 1,
      message: "Your Booking successful",
      data: trainData,
    });
  } catch (error) {
    console.error("Error", error);
    return res
      .status(400)
      .send({
        status: 0,
        message: error.message,
        message: "somthing went wrong",
      });
  }
});
BookingRoute.delete("/cancel/:id", async (req, res) => {
  try {
    const trainData = await BookingModel.findByIdAndDelete(req.params.id);
    console.log({ trainData });
    if (!trainData) {
      return res.status(404).send({
        status: 0,
        message: "Train not found",
      });
    }
    return res.send({
      status: 1,
      message: "Train has been canceled",
      data: trainData,
    });
  } catch (error) {
    console.error("Error", error);
    return res.status(400).send({
      status: 0,
      message: "Something went wrong",
    });
  }
});

BookingRoute.post("/getbooking", async (req, res) => {
  const { userId } = req.body;
  try {
    const trainData = await BookingModel.find({ userId });
    return res.send({
      status: 1,
      message: "Train Data fetched successfully.",
      data: trainData,
    });
  } catch (error) {
    console.error("Error", error);
    return res
      .status(400)
      .send({
        status: 0,
        message: error.message,
        message: "somthing went wrong",
      });
  }
});


module.exports = BookingRoute;
