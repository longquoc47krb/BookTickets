const auth = require('../../middlewares/auth');
const express = require("express");
const stationValidation = require('../../validations/station.validation');
const router = express.Router();
const validate = require('../../middlewares/validate');
const {
  postStation,
  patchStation,
  getStation,
  getAllStations,
  deleteStation,
} = require("../../controllers/station.controller");

router
  .route('/')
  .post(auth('manageStation'), validate(stationValidation.createStation), postStation)
  .get(validate(stationValidation.getStations),getAllStations)


router
  .route('/:routeId')
  .patch(auth('manageStation'), validate(stationValidation.updateStation), patchStation)
  .get(validate(stationValidation.getStation), getStation)
  .delete(auth('manageStation'), validate(stationValidation.deleteStation), deleteStation)

module.exports = router;
