import React, { useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import NavBarA from '../navbar/NavBarA';
import { Container, Row, Col } from 'react-bootstrap';
import SideBar from '../sideBar2/SideBar';
import { Grid } from '@mui/material';
import Contenu from './Contenu';
import {getDemandesReparations} from "../../features/demandeReparationSlice"
import DrawerExa from '../exemple/DrawerExe';
const ListeDemandesReparation = () => {
   // const {id} = useParams()
    const {demandesReparations,isLoading,error} = useSelector((state)=>state.storeDemandesReparations);
    const {user} = useSelector((state) =>state.auth);
    const {reparations} = useSelector((state)=>state.storeReparations);
    const dispatch=useDispatch();
    const initFetch = useCallback(() => {
    if(((user && user.donateur )||  (user && user.user?.role=="association") )  ) {
      dispatch(getDemandesReparations()).then(er=>console.log(er));
    }
    }, [dispatch]
      )
      useEffect(() => {
      initFetch()
      console.log("Demandes reparation",demandesReparations)
      }, [initFetch,reparations])
  return (
    <>
    <div>
            <DrawerExa text='Nom prenom' img="https://res.cloudinary.com/dhh8gu8oi/image/upload/v1711056938/images/profile-circle.256x256_rdf7xl.png" />
            <div style={{ marginLeft: "270px", padding: 20, marginTop: "60px" }}>
            <div className="profileRight">
        <div className="profileRightBottom" style={{marginTop:"30px"}}>
        <Grid container spacing={2} sx={{minHeight:'600px'}}>
<Contenu/>
    </Grid>
    
        </div>
      </div>
            </div>
        </div>
  </>
  )
}

export default ListeDemandesReparation
