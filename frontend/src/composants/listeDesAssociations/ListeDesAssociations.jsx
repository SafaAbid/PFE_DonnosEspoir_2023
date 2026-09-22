import React, { useCallback, useEffect } from 'react'
import NavBarA from '../navbar/NavBarA';
import { Col, Container, Row } from 'react-bootstrap';
import SideBar from '../sideBar2/SideBar';
import Feed from '../feed/Feed';
import { Card, CardContent, Grid, Typography } from '@mui/joy';
import { CardMedia } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getDemandeObjetsByDonateur } from '../../features/demandeObjetSlice';
import { useParams } from 'react-router-dom';
import Contenu from './Contenu';
import { getAssociations } from '../../features/utilisateurSlice';
import DrawerExa from '../exemple/DrawerExe';
const ListeDesAssociations = () => {
  const {user} = useSelector((state) =>state.auth);
  const {utilisateurs,isLoading,error} = useSelector((state)=>state.storeUtilisateurs);
  const dispatch=useDispatch();
  const initFetch = useCallback(() => {
    dispatch(getAssociations()).then(err=>console.log("erreuuur",err));
  
    }, [dispatch])

    useEffect(() => {
    initFetch()
    //console.log(" les associations :", utilisateurs.map((u,index)=>{"u"+u.user}))
    }, [initFetch])
  return (
    <>
    <div>
            <DrawerExa />
            <div style={{ marginLeft: "270px", padding: 20, marginTop: "60px" }}>
            <div className="profileRight">
        <div className="profileRightBottom" style={{marginTop:"30px"}}>
        <Grid container spacing={2}>
<Contenu/>
    </Grid>
    
        </div>
      </div>
            </div>
        </div>
  </>
);
}

export default ListeDesAssociations
