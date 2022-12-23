/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
const methodNotAllowed = require("../errors/MethodNotAllowed")
const router = require("express").Router();
const controller = require("./reservations.controller");

//edit
router
  .route("/:reservation_id/edit")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);

  //status
router
  .route("/:reservation_id/status")
  .get(controller.read)
  .put(controller.updateStatus)
  .all(methodNotAllowed);

  //reservation_id
router
  .route("/:reservation_id")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);
  
//home
  router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
