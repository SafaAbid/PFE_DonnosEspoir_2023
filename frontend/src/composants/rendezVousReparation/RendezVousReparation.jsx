import React, { useCallback, useEffect } from 'react';
import { Typography, Container, Grid, Card, CardContent, Button, Pagination } from '@mui/material';
import NavBarA from '../navbar/NavBarA';
import { Col, Row } from 'react-bootstrap';
import SideBar from '../sideBar2/SideBar';
import Contenu from './Contenu';
import { useDispatch, useSelector } from 'react-redux';
import {  getRendezVousReparationsByAssociation, getRendezVousReparationsByEntreprise } from '../../features/rendezVousSlice';
import { useParams } from 'react-router-dom';
import DrawerExa from '../exemple/DrawerExe';

const RendezVousReparation = () => {
    const {id} = useParams()
    const {desRendezVous,isLoading,error} = useSelector((state)=>state.storeRendezVous);
    const {reparations} = useSelector((state)=>state.storeReparations);
    const dispatch=useDispatch();
    const {user} = useSelector((state) =>state.auth);
    const initFetch = useCallback(() => {
   if(user &&  user.donateur && user.donateur.user.role==="entreprise"){
     dispatch(getRendezVousReparationsByEntreprise(Number(id))).then(er=>console.log(er));}
     else if(user && !user.donateur && user.user.role==="association"){
      dispatch(getRendezVousReparationsByAssociation(Number(id))).then(er=>console.log(er));
 console.log("les rendezVous de  :",desRendezVous)}{
     }
      }, [dispatch]) 
  
      useEffect(() => {
      initFetch()
      
      }, [initFetch,reparations])

  return (
  <>
    <div>
            <DrawerExa />
            <div style={{ marginLeft: "270px", padding: 20, marginTop: "60px" }}>
            <div className="profileRight">
        <div className="profileRightBottom " style={{marginTop:"30px"}}>
        <Grid container spacing={2} >
  <Contenu/>
    </Grid>
    
        </div>
      </div>
            </div>
        </div>
    </>
  );
}

export default RendezVousReparation;
