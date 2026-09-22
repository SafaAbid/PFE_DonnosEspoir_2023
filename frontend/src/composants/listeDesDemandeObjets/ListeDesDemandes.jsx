import React, { useCallback, useEffect, useState } from 'react'
import NavBarA from '../navbar/NavBarA';
import { Col, Container, Row } from 'react-bootstrap';
import SideBar from '../sideBar2/SideBar';
import Feed from '../feed/Feed';
import { Card, CardContent, Grid, Typography } from '@mui/joy';
import { CardMedia, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getDemandeObjetsByAssociation, getDemandeObjetsByDonateur } from '../../features/demandeObjetSlice';
import { useParams } from 'react-router-dom';
import Contenu from './Contenu';
import DrawerExa from '../exemple/DrawerExe';


const ListeDesDemandes = () => {
  const {id} = useParams();
  const params = new URLSearchParams(window.location.search);
  const nomObjet = params.get('nom');
  const {demandesObjets,isLoading,error} = useSelector((state)=>state.storeDemandesObjets);
  const {user} = useSelector((state) =>state.auth);
  const [role,useRole]=useState(user && user.role)
    const [actualiser,setActualiser]=useState(false)
    const {donations} = useSelector((state)=>state.storeDonations);
  const dispatch=useDispatch();
  const initFetch = useCallback(() => {
  if(user && !user.donateur &&  (user.user.role==="donateur")  || user.donateur && user.donateur.user.role==="entreprise" ) {
    dispatch(getDemandeObjetsByDonateur(Number(id))).then(er=>console.log(er));
    console.log("demandes",demandesObjets)
  }
  if(user && !user.donateur && user.user.role==="association") {
    dispatch(getDemandeObjetsByAssociation(Number(id))).then(er=>console.log(er));
    console.log("demandesAsd",demandesObjets)
  } 
  }, [dispatch,donations]
    
    )

    useEffect(() => {
    initFetch();
   console.log("nommm",nomObjet)
    }, [initFetch]);

   
     return (
    <>
   
    <div>
            <DrawerExa text='Nom prenom' img="https://res.cloudinary.com/dhh8gu8oi/image/upload/v1711056938/images/profile-circle.256x256_rdf7xl.png" />
            <div style={{ marginLeft: "270px", padding: 20, marginTop: "60px" }}>
            <div className="profileRight">
        <div className="profileRightBottom" style={{marginTop:"30px"}}>
        <Grid container spacing={2} sx={{minHeight:'600px'}}>
<Contenu nom={nomObjet} />
    </Grid>
    
        </div>
      </div>
            </div>
        </div>
  </>

);
}

export default ListeDesDemandes
