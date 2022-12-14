
const router = require("express").Router()
const MethodNotAllowed = require("../errors/MethodNotAllowed")
const controller = require("./tables.controller")

router.route('/')
    .get(controller.list)




module.exports = router