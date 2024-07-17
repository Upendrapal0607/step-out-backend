const express = require("express");
const auth = require("../middleware/auth");
const TrainModel = require("../model/TrainModel");

const TrainRoute = express.Router();
TrainRoute.post("/train", auth, async (req, res) => {
  console.log(req.body);
  try {
    const trainData = new TrainModel(req.body);
    await trainData.save();

    return res.send({
      status: 1,
      message: "Train has been saved successfully",
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
TrainRoute.post("/gettrain", async (req, res) => {
  const { source, destination, train_number } = req.body;

  try {
    if (source && destination) {
      const trainData = await TrainModel.find({ source, destination });
      return res.send({
        status: 1,
        message: "Train Data fetched successfully.",
        data: trainData,
      });
    } else if (train_number) {
      console.log({ train_number });
      const trainData = await TrainModel.find({ train_number });
      console.log({ trainData });
      return res.send({
        status: 1,
        message: "Train Data fetched successfully.",
        data: trainData,
      });
    } else {
      const trainData = await TrainModel.find();
      return res.send({
        status: 1,
        message: "Train Data fetched successfully.",
        data: trainData,
      });
    }
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


module.exports = TrainRoute;
