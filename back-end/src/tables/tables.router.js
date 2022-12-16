
const router = require("express").Router()
const MethodNotAllowed = require("../errors/MethodNotAllowed")
const controller = require("./tables.controller")


router.route('/')
    .get(controller.list)
    .post(controller.create)
    .all(MethodNotAllowed)


module.exports = router