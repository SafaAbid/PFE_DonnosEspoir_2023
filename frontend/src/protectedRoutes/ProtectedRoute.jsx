import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    let token = localStorage.getItem("CC_Token");
    return (
        token != null ?  <><Outlet /></>: <Navigate to="/login" />
    )
}
export default ProtectedRoute