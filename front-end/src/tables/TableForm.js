import React from "react";
import { useHistory } from "react-router-dom" 

function TableForm({ formData, changeHandler, submitHandler }){
    const history = useHistory()
    const goHome = () => {
        history.push("/")
    }

    return (
        <form onSubmit={submitHandler} className="form">
            <label htmlFor="table_name">
                Table Name:
                <input
                    id="table_name"
                    name="table_name" 
                    type="text"
                    onChange={changeHandler}
                    value={formData.table_name}
                    required  
                />
            </label>
            <label htmlFor="capacity">
                Capacity:
                <input
                    id="capacity" 
                    name="capacity"
                    type="number"
                    min="1"
                    max="100"
                    onChange={changeHandler}
                    value={formData.capacity}
                    required  
                />
            </label>
            <button type="submit">submit</button>
            <button onClick={goHome}>cancel</button>

        </form>
    )
}


export default TableForm