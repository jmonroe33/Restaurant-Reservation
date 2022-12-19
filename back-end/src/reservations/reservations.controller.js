const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const service = require("./reservationsService")
const hasProperties = require("../errors/hasProperties");
const P = require("pino");
/**
 * List handler for reservation resources
 */
/// validation middleware
const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]

const hasRequiredProperties = hasProperties(...VALID_PROPERTIES)
// check if in the future, make sure restaurant is open, during operation hours
function validateDate(req, res, next) {
  const { data = {} } = req.body;
  if (!Date.parse(data.reservation_date)) {
    next({
      status: 400,
      message: `reservation_date is invalid`
    });
  };
  next();
}

function validateTime(req, res, next) {
  const time = req.body.data.reservation_time;
  res.locals.time = time
  if (!time.match(/^(\d{1,2}):(\d{2})([ap]m)?$/)) {
    return next({
      status: 400,
      message: "reservation_time must be in hh,mm,ss"
    });
  }
  next();
};

function timeIsValid(req, res, next) {
  const time = res.locals.time
  if (time < "10:30" || time > "21:30") {
    next({
      status: 400,
      message: "Invalid time entry"
    })
  }
  next()
}

function validatePeople(req, res, next) {
  const people = req.body.data.people;
  if (Number.isNaN(people)) {
    next({
      status: 400,
      message: `people is invalid`
    });
  }
  next()
};

function isNotTuesday(req, res, next) {
  const date = new Date(req.body.data.reservation_date)
  const day = date.getUTCDay();
  res.locals.day = day;
  res.locals.date = date;
  if (day === 2) {
    next({
      status: 400,
      message: "closed on tuesedays "
    });
  };
  next();
};
// checks to see if the date is in the past 
// COME BACK LATER
function isNotPast(req, res, next) {
  const now = new Date()
  const date = res.locals.date;
  // store the actuall reservation time in a variable 
  const rDate = req.body.data.reservation_time
  // compare the two strings 
  // make sure the current time is < reservation time 
  if (date.toDateString() === now.toDateString() && rDate < `${now.getHours()}:${now.getMinutes()}`)
  if (date < now) {
    next({
      status: 400,
      message: "must be scheduled for a future date"
    });
  };
  next();
};


///////////////////////////////// crudl operations /////////////////////////////
async function list(req, res) {
  const queryDate = req.query.date
  const data = await service.list()
  const newData = data.filter(
    ({ reservation_date: date }) => JSON.stringify(date).slice(1, 11) == queryDate
  )
  newData.sort((a, b) => {
    let c = a.reservation_time
    let d = b.reservation_time
    if (c > d) {
      return 1
    } else if (c === d) {
      return 0
    } else {
      return -1
    }

  })

  res.json({ data: newData });
};

async function create(req, res,) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function read(req, res, next) {
  const reservationId = req.params.reservation_id
  const reservation = await service.read(reservationId)
  res.locals.reservation = reservation
  res.json({ data: reservation })
}

// async function read(request, response) {
//   response.status(200).json({ data: response.locals.reservation });
// }


module.exports = {
  list,
  create: [
    hasRequiredProperties,
    validateDate,
    validateTime,
    validatePeople,
    isNotTuesday,
    isNotPast,
    timeIsValid,
    asyncErrorBoundary(create),
  ],
  read:asyncErrorBoundary(read),
};
