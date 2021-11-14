const auth = require('../../middlewares/auth');
const express = require('express');
const stationValidation = require('../../validations/station.validation');
const router = express.Router();
const validate = require('../../middlewares/validate');
const uploads = require('../../middlewares/upload');
const { upload } = require('cloudinary').v2;
const cloudinary = require('../../utils/cloudinary');
const Station = require('../../models/station.model');
const {
  postStation,
  patchStation,
  getStation,
  getAllStations,
  deleteStation,
} = require('../../controllers/station.controller');

router
  .route('/')
  .post(auth('manageStation'), uploads.single('station_image'), postStation)
  .get(validate(stationValidation.getStations), getAllStations);

router
  .route('/:stationId')
  .patch(auth('manageStation'), validate(stationValidation.updateStation), patchStation)
  .get(validate(stationValidation.getStation), getStation)
  .delete(auth('manageStation'), validate(stationValidation.deleteStation), deleteStation);

module.exports = router;
