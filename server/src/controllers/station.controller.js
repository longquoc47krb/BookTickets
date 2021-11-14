const { Station, Route } = require('../models');
const cloudinary = require('../utils/cloudinary');
const postStation = async (req, res, next) => {
  const { stationName, stationAddress, statusActive, province, thumbnail } = req.body;
  // Upload image to cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, { folder: 'images/stations' });
  const newStation = new Station({
    stationName,
    stationAddress,
    province,
    statusActive: 'Active',
    thumbnail: result.secure_url,
    thumbnail_id: result.public_id,
  });

  newStation
    .save()
    .then((station) => {
      res.status(201).json(station);
      console.log(req.file);
    })
    .catch((err) => res.json(err));
};
// replace
const putStation = (req, res, next) => {
  const { id } = req.params;
  Station.findById(id)
    .then((station) => {
      if (!station)
        return Promise.reject({
          status: 404,
          message: 'Station not found',
        });

      const keys = ['stationName', 'stationAddress', 'province'];
      keys.forEach((key) => {
        station[key] = req.body[key];
      });
      return station.save();
    })
    .then((station) => res.status(200).json(station))
    .catch((err) => res.json(err));
};
// update
const patchStation = (req, res, next) => {
  const { id } = req.params;
  Station.findById(id)
    .then((station) => {
      if (!station)
        return Promise.reject({
          status: 404,
          message: 'Station not found',
        });
      Object.keys(req.body).forEach((key) => {
        station[key] = req.body[key];
      });

      return station.save();
    })
    .then((station) => res.status(200).json(station))
    .catch((err) => res.json(err));
};
const deleteStation = async (req, res) => {
  const { id } = req.params;
  Station.findById(id)
    .then((station) => {
      if (!station)
        return Promise.reject({
          status: 404,
          message: 'Station not found',
        });
      return Promise.all([Station.deleteOne({ _id: id }), station]);
    })
    .then((result) => res.status(200).json(result[1]))
    .catch((err) => res.json(err));
};

const getStation = (req, res, next) => {
  const { id } = req.params;
  Station.findById(id)
    .then((station) => res.status(200).json(station))
    .catch((err) => res.json(err));
};
const getAllStations = (req, res, next) => {
  Station.find()
    .then((stations) => {
      res.status(200).json(stations);
    })
    .catch((err) => res.status(500).send({ message: 'Something went wrong !' }));
};

module.exports = { postStation, putStation, patchStation, deleteStation, getStation, getAllStations };
