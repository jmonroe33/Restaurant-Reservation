const router = require("express").Router({ mergeParams: true })
const methodNotAllowed = require("../errors/MethodNotAllowed")
const controller = require("./tables.controller")

router.route("/:table_id/seat")
    .put(controller.seatTable)
    .delete(controller.finishTable)
    .all(methodNotAllowed)
    
router.route("/")
    .get(controller.list)
    .post(controller.create)
    .delete(controller.destroy)
    .all(methodNotAllowed)

module.exports = router