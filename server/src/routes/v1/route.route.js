const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const {
  postRoute,
  patchRoute,
  deleteRoute,
  getRoute,
  getAllRoute,
  bookRoute,
} = require('../../controllers/route.controller');

router.route('/').post(auth('manageRoutes'), postRoute).get(auth('getRoutes'), getAllRoute);

router
  .route('/:routeId')
  .patch(auth('manageRoutes'), patchRoute)
  .get(auth('getRoutes'), getRoute)
  .delete(auth('manageRoutes'), deleteRoute);

module.exports = router;
