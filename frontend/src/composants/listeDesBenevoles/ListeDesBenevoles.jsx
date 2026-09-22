import React, { useCallback, useEffect } from 'react'
import NavBarA from '../navbar/NavBarA'
import { Col, Container, Row } from 'react-bootstrap'
import SideBar from '../sideBar2/SideBar'
import { Grid } from '@mui/material'
import Contenu from './Contenu'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getBenevolesByAssociation } from '../../features/benevoleSlice'
import DrawerExa from '../exemple/DrawerExe'

const ListeDesBenevoles = () => {
    const {id}=useParams()
    const {benevoles,isLoading,error} = useSelector((state)=>state.storeBenevoles);
  const dispatch=useDispatch();
  const initFetch = useCallback(() => {
    dispatch(getBenevolesByAssociation(id)).then(err=>console.log("erreuuur",err));
    console.log(" les bénévoles :",benevoles)
    }, [dispatch])
    useEffect(() => {
    }, [benevoles])
    useEffect(() => {
    initFetch()
    }, [initFetch])
   
  return (
 <>
    <div>
            <DrawerExa />
            <div style={{ marginLeft: "270px", padding: 20, marginTop: "60px" }}>
            <div className="profileRight">
        <div className="profileRightBottom" style={{marginTop:"30px"}}>
        <Grid container spacing={2} style={{ marginTop:'20px',marginRight:'15px'}}>
<Contenu/>
    </Grid>
    
        </div>
      </div>
            </div>
        </div>
    </>
  )
}

export default ListeDesBenevoles
