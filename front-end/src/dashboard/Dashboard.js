import React, { useEffect, useState } from "react";
import { listReservations, tablesList } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import MapReservations from "./MapReservations";
import { useHistory } from "react-router-dom";
import { next, previous, today }from "../utils/date-time"
import MapTables from "./MapTables"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory()
  const [tables, setTables] = useState([])
  const [tablesError, setTablesError] = useState(null)

  // const dateQuery = query.get("date")

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
      
    tablesList(abortController.signal)
      .then(setTables)
      .catch(setTablesError); 
    return () => abortController.abort();
  }
  const listAllReservations = reservations.map((reservation) => {
    return(
      <MapReservations reservation={reservation} key={ reservation.reservation_id}/>
    )
  })

  const listAllTables = tables.map((table) => {
    return (
      <MapTables table={table} key={table.table_id}/>
    )
  })

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for { date }</h4>
      </div>
      <div>
        <button className="btn btn-primary"  onClick={() => history.push(`?date=${previous(date)}`)}>Previous</button>
        <button className="btn btn-secondary" onClick={() => history.push(`?date=${today(date)}`)}>Today</button>
        <button className="btn btn-danger"  onClick={() => history.push(`?date=${next(date)}`)}>next</button>
      </div>
        
        <ErrorAlert error={reservationsError} />
        <table className="table">
          <thead>
            <th>Id</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Time</th>
            <th>Party Size</th>  
          </thead>
          <tbody>
            { listAllReservations }
          </tbody>
        </table>
        <br/>

        <table className="table">
          <thead>
            <th>Id</th>
            <th>Table Name</th>
            <th>Capacity</th>
            <th>Reservation Id</th>  
          </thead>  
          <tbody>
            { listAllTables }
          </tbody>
        </table>
    </main>
  );
}

export default Dashboard;
