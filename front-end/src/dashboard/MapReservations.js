import React from "react";
import { useParams } from "react-router-dom";
function MapReservations({ reservation }) {
    const { reservation_id } = useParams()
    console.log(reservation_id)
    return (
        <tr>
            <td>{reservation.reservation_id}</td>
            <td>{reservation.last_name}, {reservation.first_name}</td>        
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <td><button className="btn btn-primary" href={`/reservations/seat`} >Seat</button></td>
        </tr>        
   
    

    )

}

export default MapReservations