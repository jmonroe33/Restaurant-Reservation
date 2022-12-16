import React from "react";

function MapTables({ table }){
    const {
        table_id,
        table_name,
        capacity,
        reservation_id,
    } = table
    return (
        <tr>
            <td>{ table_id }</td>
            <td>{ table_name }</td>
            <td>{ capacity }</td>
            <td>{ reservation_id }</td>
        </tr>
    )
}

export default MapTables