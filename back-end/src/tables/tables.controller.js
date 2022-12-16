const service = require("./tables.service")
const hasProperties = require("../errors/hasProperties")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

////////////////////// Validation Middleware /////////////////////////

// checks to see if the properties exsist in the request
const VALID_PROPERTIES = [
    "table_name",
    "capacity",
  ]
const hasValidProperties = hasProperties(VALID_PROPERTIES)

function validateTableName(req, res, next){
    const tableName = req.body.data.table_name
    if(tableName <= 1){
        next({
            status:400,
            message: "table_name is too short"
        })
    }
    next()
}




/////////////////////////// Crudl Ops /////////////////////////////

// lists out all the tables currently 
async function list(req, res, next){
    res.json({
         data: await service.list()
    })
}



// creates a table and return a 201
async function create(req, res, next){
   const data = await service.create(req.body.data)
    res.status(201).json({ data })
}




module.exports = {
    list,
    create: [
        hasValidProperties,
        validateTableName,
        asyncErrorBoundary(create)
    ],
}