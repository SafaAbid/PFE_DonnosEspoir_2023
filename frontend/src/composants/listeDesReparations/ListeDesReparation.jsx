import React, { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getReparationByAssociation, getReparationsByEntreprise } from '../../features/reparationSlice';
import NavBarA from '../navbar/NavBarA';
import { Container, Row, Col } from 'react-bootstrap';
import SideBar from '../sideBar2/SideBar';
import { Grid } from '@mui/material';
import Contenu from './Contenu';
import DrawerExa from '../exemple/DrawerExe';

const ListeDesObjets = () => {
  const {id} = useParams()
  const {reparations,isLoading,error} = useSelector((state)=>state.storeReparations);
  const {desRendezVous} = useSelector((state)=>state.storeRendezVous);
  const dispatch=useDispatch();
  const {user} = useSelector((state) =>state.auth);
  const initFetch = useCallback(() => {
    if(user && user.donateur) {
        dispatch(getReparationsByEntreprise(Number(id))).then(er=>console.log(er));
   console.log("les reparations de cette entreprise :",reparations)
  }else if(user && user.user?.role=="association"){
    dispatch(getReparationByAssociation(Number(id))).then(er=>console.log(er));
   }
    }, [dispatch])

    useEffect(() => {
    initFetch()
    }, [initFetch])
    useEffect(() => {
    }, [desRendezVous])
  return (
    <>
    <div>
            <DrawerExa />
            <div style={{ marginLeft: "270px", padding: 20, marginTop: "60px" }}>
            <div className="profileRight">
        <div className="profileRightBottom" style={{marginTop:"30px"}}>
        <Grid container spacing={2} >
<Contenu/>
    </Grid>
    
        </div>
      </div>
            </div>
        </div>
  </>
  )
}

export default ListeDesObjets
