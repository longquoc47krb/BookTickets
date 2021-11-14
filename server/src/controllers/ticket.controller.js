const { Station, Route, Tickets } = require('../models');
const lodash = require('lodash');

// book ticket
const createTicket = (req, res, next) => {
  const { routeId, seatCodes } = req.body; // seatCodes = ["A01", "A02"]
  const { _id: userId } = req.user;
  // const _userId = req.user._id;
  Route.findById(routeId)
    .then((route) => {
      if (!route)
        return Promise.reject({
          status: 404,
          message: 'route not found',
        });

      const availableSeatCodes = route.seats.filter((seat) => !seat.isBooked).map((seat) => seat.code);

      const errSeatCodes = [];
      seatCodes.forEach((code) => {
        if (availableSeatCodes.indexOf(code) === -1) errSeatCodes.push(code);
      });

      if (!_.isEmpty(errSeatCodes))
        return Promise.reject({
          status: 400,
          message: `${errSeatCodes.join(', ')} is/are not available`,
        });

      const newTicket = new Ticket({
        userId,
        routeId,
        seats: seatCodes.map((code) => new Seat({ code })),
        totalPrice: seatCodes.length * route.price,
      });

      seatCodes.forEach((code) => {
        const seatIndex = route.seats.findIndex((seat) => seat.code === code);
        route.seats[seatIndex].isBooked = true;
      });

      return Promise.all([newTicket.save(), route.save()]);
    })
    .then(([ticket, route]) => {
      res.status(200).json(ticket);
    })
    .catch((err) => {
      if (err.status) return res.status(err.status).json({ message: err.message });
      return res.json(err);
    });
};
