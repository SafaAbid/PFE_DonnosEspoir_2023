import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRouteInscri = () => {
    let token = localStorage.getItem("CC_Token");
    return (
        token != null ? <Navigate to="/login" /> : <Outlet />
    )
}

export default ProtectedRouteInscri
