import { Col, Container, Row } from "react-bootstrap";
import Feed from "../../feed/Feed";
import NavBarA from "../../navbar/NavBarA";
import Rightbar from "../../rightbar/Rightbar";
import SideBar from "../../sideBar2/SideBar";
import Sidebar from "../../sidebar/Sidebar";
import Topbar from "../../topbar/Topbar";
import CardProfile from "./CardProfile";
import "./profile.css";
import { useParams } from "react-router-dom";
import { getObjetsByDonateur } from "../../../features/objetSlice";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { getActivitesByAssociation } from "../../../features/activiteSlice";
import { Typography } from "@mui/joy";
import { getBesoinsByAssociation } from "../../../features/besoinSlice";
import { getCategories } from "../../../features/categorieSlice";
import { findCompteById } from './../../../features/utilisateurSlice';
import DrawerExa from "../../exemple/DrawerExe";
export default function Profile() {
  const {id} = useParams()
  const {objets,isLoading,error} = useSelector((state)=>state.storeObjets);
  const {activites} = useSelector((state) =>state.storeActivites);
  const {utilisateur} = useSelector((state) =>state.storeUtilisateurs);
  const {user} = useSelector((state) =>state.auth);
  const [userData,setUserData]=useState()
//  const {user} = useSelector((state) =>state.auth);
  //const {utilisateur} = useSelector((state) =>state.storeUtilisateurs);
  const dispatch=useDispatch();
  const initFetch = useCallback(() => {
   dispatch(getActivitesByAssociation(Number(id))).then(res=>console.log(res))
   dispatch(getBesoinsByAssociation(Number(id))).then(res=>console.log(res))
   dispatch(getCategories()).then(res=>{console.log(res)})
   //dispatch(getSousCategories()).then(res=>{console.log(res)})
   dispatch(findCompteById(id)).then(res=>{localStorage.setItem('userData', JSON.stringify(res.payload));})

    }, [dispatch])
    useEffect(() => {
    initFetch()
  console.log("uuffgtghgfhg",utilisateur)
   const cachedUserData = localStorage.getItem('userData')
  setUserData(JSON.parse(cachedUserData))
    }, [initFetch])
   
  return (
    <>
    <div>
            <DrawerExa text='Nom prenom' img="https://res.cloudinary.com/dhh8gu8oi/image/upload/v1711056938/images/profile-circle.256x256_rdf7xl.png" />
            <div style={{ marginLeft: "270px", padding: 20, marginTop: "60px" }}>
            <div className="profileRight">
          <div className="profileRightTop">
          <div className="profileCover">
           { ((user && user.user && user.user.id== id) || (user && user.donateur && user.donateur.user.id==id) )&&
            <CardProfile />
             }
          </div></div>
          <div className="profileRightBottom">
            <Feed  /> 
          </div>
        </div>
            </div>
        </div>
    
    </>
  );
}