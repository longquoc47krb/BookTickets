const { Ticket, Station, Route } = require("../models");




const postRoute = async (req, res) => {
  try {
    const {
      departurePlace,
      arrivalPlace,
      startedDate,
      departureTime,
      car,
      price,
    } = req.body;
    const foundStationDepart = await Station.findOne({ _id: departurePlace })
    const foundStationArri = await Station.findOne({ _id: arrivalPlace })
    if (!foundStationDepart || !foundStationArri) {
      return res.status(404).send({ message: "Invalid Station !" });
    }
    const foundCar = await Car.findById(car);
    if (!foundCar) {
      return res.status(404).send({ message: "Invalid Car" });
    }
    const foundBrand = await Brand.findById(foundCar.brandID)
    let brandName = ""
    if (!foundBrand) {
      brandName = "HDBus"
    } else {
      brandName = foundBrand.brandName
    }
    const arrayOfSeat = [...new Array(foundCar.numberOfSeat)].map(
      (item, index) => {
        return new Seat({
          seatName: "A" + (index + 1),
          status: "available",
        });
      }
    );

    const newRoute = new Route({
      departurePlace,
      arrivalPlace,
      // startedDate: startedDate + " 00:00:00",
      startedDate,
      departureTime,
      arrayOfSeat,
      car,
      price,
      departureProvice: foundStationDepart.provice,
      arrivalProvice: foundStationArri.provice,
      // statusActive: "Active",

      //Ramdom
      hhTo,
      mmTo,
      star,
      countRoute,
      countHH,
      countMM,
      brandName
      //-----------------------
    });

    const result = await newRoute.save();
    const newResult = {
      departurePlace: {
        _id: foundStationDepart._id,
        stationName: foundStationDepart.stationName,
      },
      arrivalPlace: {
        _id: foundStationArri._id,
        stationName: foundStationArri.stationName,
      },
      // startedDate: startedDate + " 00:00:00",
      startedDate,
      departureTime,
      arrayOfSeat,
      car: {
        _id: foundCar._id,
      },
      price,
      _id: result._id
      // statusActive: "Active",
    }
    res.status(201).send(newResult);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const patchRoute = async (req, res) => {
  try {
    const { routeID, startedDate, departureTime, price } = req.body;
    const foundRoute = await Route.findById(routeID);
    if (!foundRoute) {
      return res.status(404).send({ message: "Invalid Route !" });
    }
    // foundRoute.startedDate = startedDate + " 00:00:00";
    foundRoute.startedDate = startedDate;
    foundRoute.departureTime = departureTime;
    foundRoute.price = price;
    const result = await foundRoute.save();
    res.status(202).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const deleteRoute = async (req, res) => {
  try {
    const { routeID } = req.query;
    const findTicket = await Ticket.findOne({ routeID });
    if (findTicket) {
      return res.status(400).send({ message: "Route was booked" });
    }
    const foundRoute = await Route.findByIdAndDelete(routeID);
    if (!foundRoute) {
      return res.status(404).send({ message: "Invalid Route !" });
    }
    // foundRoute.statusActive = "Inactive";
    // const result = await foundRoute.save();
    res.status(203).send(foundRoute);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const getRoute = async (req, res) => {
  try {
    const { departurePlace, arrivalPlace, startedDate } = req.query;
    const findRoute = await Route.find().and([
      { departurePlace },
      { arrivalPlace },
      { startedDate: startedDate + " 00:00:00" },
    ]);
    if (findRoute.length === 0) {
      return res.status(404).send({ message: "Not Found Route" });
    }
    res.status(200).send(findRoute);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const getAllRoute = async (req, res) => {
  try {
    const findRoute = await Route.find().populate("departurePlace arrivalPlace car", "stationName")
    if (findRoute.length === 0) {
      return res.status(404).send({ message: "Not Found Route" });
    }
    res.status(200).send(findRoute);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const bookRoute = async (req, res) => {
  const { routeID, arrayOfSeat, totalPrice } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundRoute = await Route.findById(routeID).session(session);
    if (!foundRoute) {
      return res.status(400).send({ message: 'Invalid Route, ID not exist!' })
    }
    let arrayOfSeatName = []
    for (let index = 0; index < arrayOfSeat.length; index++) {
      const seat = arrayOfSeat[index];
      const foundSeat = foundRoute.arrayOfSeat.findIndex(
        (item) => item._id.toString() === seat._id && item.status === 'available'
      )
      if (foundSeat === -1) {
        return res.status(400).send({ message: `Seat ${arrayOfSeat[index].seatName}: Invalid or Booked!` })
      }
      foundRoute.arrayOfSeat[foundSeat].userID = req.user._id
      foundRoute.arrayOfSeat[foundSeat].status = 'booked'
      arrayOfSeatName.push(seat.seatName)
    }
    await foundRoute.save()

    const departurePlace = await Station.findById(foundRoute.departurePlace);
    const arrivalPlace = await Station.findById(foundRoute.arrivalPlace);
    const car = await Car.findById(foundRoute.car)
    const newTicket = await Ticket.create(
      [
        {
          userID: req.user._id,
          routeID: foundRoute._id,
          arrayOfSeat: arrayOfSeatName,
          departurePlace: departurePlace.stationName,
          arrivalPlace: arrivalPlace.stationName,
          car: foundRoute.car,
          totalPrice,
          departureTime: foundRoute.departureTime,
          brandName: foundRoute.brandName,
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    res.status(200).send(newTicket)
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error)
    res.status(500).send({ message: 'Something went wrong!' })
  }
};
const getRouteByProvice = async (req, res) => {
  try {
    const { departureProvice, arrivalProvice, startedDate } = req.query
    const foundRoute = await Route.find({ departureProvice, arrivalProvice, startedDate })
      .populate("departurePlace arrivalPlace car", "stationName licensePlate")
    res.status(200).send(foundRoute)
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Something went wrong!' })
  }
}

module.exports = {
  postRoute,
  patchRoute,
  getRouteByProvice,
  getAllRoute,
  getRoute,
  bookRoute,
  deleteRoute
}
