import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRouteEntreprise = () => {
    let token = localStorage.getItem("CC_Token");
    const { user } = useSelector((state) => state.auth);
    // console.log("token est " + token)
    return (
        token != null ? (user.user?.role !== "donateur" ? <><Outlet /></> : <Navigate to="/accueil" />) : (<Navigate to="/login" />)
    )
}

export default ProtectedRouteEntreprise
