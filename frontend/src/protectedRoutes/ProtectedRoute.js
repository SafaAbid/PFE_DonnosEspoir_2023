import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
let token=localStorage.getItem("CC_Token");
// console.log("token est " + token)
return(
token!=null ? <><Outlet/></>: <Navigate to="/login"/>
)
}
export default ProtectedRoute
