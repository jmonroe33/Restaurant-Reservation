const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

//middleware/helper functions

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params || req.body.data;
  const reservation = await reservationsService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    next();
  } else {
    next({
      status: 404,
      message: `Reservation not found. ${reservation_id}`,
    });
  }
}

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

const validFields = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

function hasValidFields(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !validFields.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }

  next();
}

/**
 * Check "isValidNumber" handler for reservation resources
 */

function isValidNumber(req, res, next) {
  const { data = {} } = req.body;

  if (data["people"] === 0 || !Number.isInteger(data["people"]))
    return next({ status: 400, message: `Invalid number of people` });
  next();
}

/**
 * Check "isValidDate" handler for reservation resources
 */
function isValidDate(req, res, next) {
  const { data = {} } = req.body;
  const reservation_date = new Date(data["reservation_date"]);
  const date = data.reservation_date
  const day = reservation_date.getUTCDay();
  const newDate = new Date()

  if (isNaN(Date.parse(data["reservation_date"]))) {
     next({ status: 400, message: `Invalid reservation_date` });
  }
  if (day === 2) {
    next({ status: 400, message: `Restaurant is closed on Tuesdays` });
  }
  if (
    JSON.stringify(date).slice(1, 11) < JSON.stringify(newDate).slice(1, 11) &&
    JSON.stringify(date).slice(12, 24) < JSON.stringify(newDate).slice(12, 24)
  ) {
    return next({
      status: 400,
      message: `Reservation must be a future date.`
    })
  }
  next();
}

function isNotPast(req, res, next){
  const now = new Date()
  const resTime = req.body.data.reservation_time;
  const resDate = new Date(req.body.data.reservation_date)

 
    // store the actuall reservation time in a variable 
    // compare the two strings 
    // make sure the current time is < reservation time 
    if (resDate.toDateString() === now.toDateString() && resTime < `${now.getHours()}:${now.getMinutes()}`){
       
      return next()
    }
    if (resDate < now) {
      next({
        status: 400,
        message: "must be scheduled for a future date"
      });
    };
    next(); 
}


/**
 * Check "isTime" handler for reservation resources
 */

function isTime(req, res, next) {
  const { data = {} } = req.body;
  //HH:MM 24-hour with leading 0 || don't know what this one is yet***
  if (
    /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(data["reservation_time"]) ||
    /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(
      data["reservation_time"]
    )
  ) {
    if (data["reservation_time"] < "10:30") {
      return next({
        status: 400,
        message: "restaurant is not open until 10:30AM",
      });
    }
    if (data["reservation_time"] > "21:30") {
      return next({
        status: 400,
        message: "cannot schedule a reservation after 9:30pm",
      });
    }
    return next();
  }
  next({ status: 400, message: `Invalid reservation_time` });
}

function timeIsValid(req, res, next) {
  const time = req.body.data.reservation_time;
  const isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(
    time
  );
  if (!isValid) {
    return next({
      status: 400,
      message: `The time you entered is not valid. Please enter a valid reservation_time`,
    });
  }
  next();
}

/**
 * Create handler for reservation resources
 */
async function create(req, res) {
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}

/**
 * Read handler for reservation resources
 */
//**change made here */
function read(req, res) {
  res.status(200).json({ data: res.locals.reservation });
}

/**
 * Update handler for reservation resources
 */
async function update(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: req.params.reservation_id,
    status: req.body.data.status,
  };

  if (res.locals.reservation.status === "finished") {
    return next({
      status: 400,
      message: "a finished reservation cannot be updated",
    });
  }

  const data = await reservationsService.update(updatedReservation);
  res.status(200).json({ data });
}

async function updateStatus(req, res, next) {
  const updatedStatus = {
    ...req.body.data,
    reservation_id: req.params.reservation_id,
    status: req.body.data.status,
  };

  if (res.locals.reservation.status === "finished") {
    return next({
      status: 400,
      message: "a finished reservation cannot be updated",
    });
  }

  const data = await reservationsService.update(updatedStatus);
  res.status(200).json({ data });
}

/**
 * Delete handler for reservation resources
 */

async function destroy(req, res) {
  const { reservation } = res.locals;
  await reservationsService.delete(reservation.reservation_id);
  res.sendStatus(204);
}

/**
 * List handler (basic) for reservation resources
 */
async function list(req, res) {
  const { date, mobile_number } = req.query;
  const reservation = await (mobile_number
    ? reservationsService.search(mobile_number)
    : reservationsService.list(date));
  res.json({
    data: reservation,
  });
}

const validStatus = ["booked", "finished", "seated", "cancelled"];

function hasValidStatus(req, res, next) {
  const { status } = req.body.data;

  if (!validStatus.includes(status)) {
    return next({ status: 400, message: "unknown" });
  }
  next();
}

function checkStatus(req, res, next) {
  const { status } = req.body.data;

  if (status === "seated") {
    return next({ status: 400, message: `reservation is seated` });
  }

  if (status === "finished") {
    return next({ status: 400, message: `reservation is finished` });
  }

  next();
}

module.exports = {
  create: [
    hasRequiredProperties,
    timeIsValid,
    isValidDate,
    // isNotPast,
    isValidNumber,
    isTime,
    checkStatus,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    reservationExists,
    hasValidFields,
    hasRequiredProperties,
    isValidNumber,
    isValidDate,
    isTime,
    hasValidStatus,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    reservationExists,
    hasValidFields,
    hasValidStatus,
    asyncErrorBoundary(updateStatus),
  ],
  list: asyncErrorBoundary(list),
};