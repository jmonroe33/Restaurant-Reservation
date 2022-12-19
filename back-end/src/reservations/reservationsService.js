const knex = require("../db/connection");

function listAllReservations() {
    return knex("reservations").select("*")
}

function create(reservation) {
    return knex('reservations')
        .insert(reservation)
        .returning("*")
        .then(createdRecords => createdRecords[0])
}

function read(reservation_id){
    return knex('reservations')
    .select("*")
    .where({ reservation_id : reservation_id }).first()
}



module.exports = {
    list: listAllReservations,
    create,
    read,
}