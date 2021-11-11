const auth = require('../../middlewares/auth');
const express = require('express');
const stationValidation = require('../../validations/station.validation');
const router = express.Router();
const validate = require('../../middlewares/validate');
const multer = require('multer');
const upload = multer({ dest: '/uploads/stations' });
const {
  postStation,
  patchStation,
  getStation,
  getAllStations,
  deleteStation,
} = require('../../controllers/station.controller');

router
  .route('/')
  .post(auth('manageStation'), upload.single('stationImage'), postStation)
  .get(validate(stationValidation.getStations), getAllStations);

router
  .route('/:stationId')
  .patch(auth('manageStation'), validate(stationValidation.updateStation), upload.single('stationImage'), patchStation)
  .get(validate(stationValidation.getStation), getStation)
  .delete(auth('manageStation'), validate(stationValidation.deleteStation), deleteStation);

module.exports = router;
