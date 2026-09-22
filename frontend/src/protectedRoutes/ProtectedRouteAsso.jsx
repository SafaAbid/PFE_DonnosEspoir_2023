import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRouteAsso = () => {
    let token = localStorage.getItem("CC_Token");
    const { user } = useSelector((state) => state.auth);
    return (
        token != null ? (user.user?.role == "association" ? <><Outlet /></> : <Navigate to="/accueil" />) : (<Navigate to="/login" />)
    )
}
export default ProtectedRouteAsso
