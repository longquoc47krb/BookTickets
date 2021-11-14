const { Ticket, Station, Route, Seat } = require('../models');

const postRoute = async (req, res) => {
  const { fromStationId, toStationId, startTime, price } = req.body;
  const seats = codeArray.map((code) => {
    return new Seat({ code });
  });
  const newRoute = new Route({
    fromStationId,
    toStationId,
    startTime,
    price,
    seats,
  });

  newRoute
    .save()
    .then((route) => res.status(201).json(route))
    .catch((err) => res.json(err));
};

const patchRoute = async (req, res) => {
  try {
    const foundRoute = await Route.findById(routeID);
    if (!foundRoute) {
      return res.status(404).send({ message: 'Invalid Route !' });
    }
    // foundRoute.startedDate = startedDate + " 00:00:00";
    foundRoute.startedDate = startedDate;
    foundRoute.departureTime = departureTime;
    foundRoute.price = price;
    const result = await foundRoute.save();
    res.status(202).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Something went wrong !' });
  }
};

const deleteRoute = async (req, res) => {
  const { id: _id } = req.params;
  let _Route;
  Route.findById(_id)
    .then((Route) => {
      _Route = Route;
      if (!Route)
        return Promise.reject({
          message: 'Route not found',
          status: 404,
        });

      return Route.deleteOne({ _id });
    })
    .then(() => res.status(200).json(_Route))
    .catch((err) => res.json(err));
};

const getRoute = async (req, res) => {
  const { id } = req.params;
  Route.findById(id)
    .then((route) => {
      if (!route)
        return Promise.reject({
          message: 'Route not found',
          status: 404,
        });

      res.status(200).json(route);
    })
    .catch((err) => res.json(err));
};

const getAllRoute = async (req, res) => {
  try {
    const findRoute = await Route.find().populate('departurePlace arrivalPlace car', 'stationName');
    if (findRoute.length === 0) {
      return res.status(404).send({ message: 'Not Found Route' });
    }
    res.status(200).send(findRoute);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Something went wrong !' });
  }
};
const getRouteByProvice = async (req, res) => {
  try {
    const { departureProvice, arrivalProvice, startedDate } = req.query;
    const foundRoute = await Route.find({ departureProvice, arrivalProvice, startedDate }).populate(
      'departurePlace arrivalPlace car',
      'stationName licensePlate'
    );
    res.status(200).send(foundRoute);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Something went wrong!' });
  }
};

module.exports = {
  postRoute,
  patchRoute,
  getRouteByProvice,
  getAllRoute,
  getRoute,
  deleteRoute,
};
