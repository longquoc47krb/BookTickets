const { Station, Route } = require("../models");
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const stationService = require('../services');
const postStation = async (req, res) => {
  try {
    const { stationCode, stationName, stationAddress, province } = req.body;
    const foundStation = await Station.findOne({ stationCode });
    if (foundStation) {
      return res.status(400).send({ message: "Bến đã tồn tại!" });
    }
    const newStation = new Station({
      stationCode,
      stationName,
      stationAddress,
      province,
      statusActive: "Active",
    });
    const result = await newStation.save();
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const patchStation = async (req, res) => {
  try {
    const { stationCode, stationName, stationAddress, province } = req.body;
    const foundStation = await Station.findOne({ stationCode });
    if (!foundStation) {
      return res.status(404).send({ message: "Bến không hợp lệ" });
    }
    foundStation.stationName = stationName;
    foundStation.stationAddress = stationAddress;
    foundStation.province = province;
    const result = await foundStation.save();
    res.status(202).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const deleteStation = async (req, res) => {
  try {
    const { stationCode } = req.query;
    const foundStation = await Station.findOne({ stationCode });
    if (!foundStation) {
      return res.status(404).send({ message: "Bến không hợp lệ" });
    }
    const findRoute = await Route.findOne().or([
      { departurePlace: foundStation._id },
      { arrivalPlace: foundStation._id },
    ]);
    if (findRoute) {
      return res.status(400).send({ message: "Bến đã tồn tại!" });
    }
    foundStation.statusActive = "Inactive";
    const result = await foundStation.save();
    res.status(202).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const getStation = async (req, res) => {
  try {
    const findStation = await Station.find({ statusActive: 'Active' });
    res.status(200).send(findStation);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};
const getAllStations = catchAsync ( async (req, res) => {
  const filter = pick(req.query, ['stationName','statusActive']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await stationService.queryStations(filter, options);
  res.send(result);
});


module.exports = { postStation, patchStation, deleteStation, getStation, getAllStations };
