import React, { useState } from "react";
import { createTable } from "../utils/api"
import { useHistory } from "react-router-dom"
import TableForm from "./TableForm";

function NewTables(){ 
    const history = useHistory()
    const initialState = {
        table_name: "",
        capacity: "",
    }   
    const [ formData , setFormData ] = useState({...initialState})
    
    const changeHandler = ({ target }) => {
        setFormData({
            ...formData,
            [ target.name ]:target.value
        })
    }

    const submitHandler = async (event) => {
        event.preventDefault()
        await createTable(formData)
        setFormData({...initialState})
        history.push("/")
    }
    return (
        <TableForm formData={formData} changeHandler={changeHandler} submitHandler ={submitHandler}/>
    )
}

export default NewTables