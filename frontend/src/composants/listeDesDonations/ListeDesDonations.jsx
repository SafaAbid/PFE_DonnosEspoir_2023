import React, { useCallback, useEffect } from 'react'
import NavBarA from '../navbar/NavBarA';
import { Col, Container, Row } from 'react-bootstrap';
import SideBar from '../sideBar2/SideBar';
import Feed from '../feed/Feed';
import { Card, CardContent, Grid, Typography } from '@mui/joy';
import { CardMedia } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getDonationByAssociation, getDonationByDonateur } from '../../features/donationSlice';
import Contenu from './Contenu';
import DrawerExa from '../exemple/DrawerExe';


const ListeDesDonations = () => {
  const {id} = useParams()
  const {donations,isLoading,error} = useSelector((state)=>state.storeDonations);
  const {desRendezVous} = useSelector((state)=>state.storeRendezVous);
  const dispatch=useDispatch();
  const {user} = useSelector((state) =>state.auth);
  const initFetch = useCallback(() => {
    if((user && !user.donateur &&  (user.user.role==="donateur") ) ||( user.donateur && user.donateur.user.role==="entreprise") ) {   
         dispatch(getDonationByDonateur(Number(id))).then(er=>console.log(er));
    console.log("les demandes de cet donateur :",donations)
}
    else
     if(user && user.user.role=="association"){
        dispatch(getDonationByAssociation(Number(id))).then(er=>console.log(er));
   console.log("les demandes de cette associatuion :",donations)}
    }, [dispatch])

    useEffect(() => {
    initFetch()
    
    }, [initFetch])
    useEffect(() => {
      
      
      }, [donations])

    useEffect(() => {
      }, [desRendezVous])
      
  return (
    <>
    <div>
            <DrawerExa />
            <div style={{ marginLeft: "270px", padding: 20, marginTop: "60px" }}>
            <div className="profileRight" >
        <div className="profileRightBottom" style={{marginTop:"30px"}}>
        <Grid container spacing={2} sx={{minHeight:'600px'}}>
<Contenu/>
    </Grid>
    
        </div>
      </div>
            </div>
        </div>
  </>
);
}

export default ListeDesDonations
