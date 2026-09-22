import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAssociations, getDonateurs, getEntreprises } from '../../../features/utilisateurSlice';
import { Grid, ListItem } from '@mui/joy';
import { Card, Col, Row } from 'react-bootstrap';
import Categorie from './Categorie';
import { Typography } from '@mui/material';
import { getObjets } from '../../../features/objetSlice';
import { getCategoriesAdmin } from '../../../features/categorieSlice';

const Dashboard = () => {
  const [associations, setAssociations] = useState(0)
  const [donateurs, setDonateurs] = useState(0)
  const [entreprises, setEntreprises] = useState(0)
  const { utilisateurs } = useSelector((state) => state.storeUtilisateurs);
  const [nbEncours,setNbEncours]=useState(0)
  const [nbPublie,setNbPublie]=useState(0)
  const [nbRefuse,setNbRefuse]=useState(0)
  const [nbActive,setNbActive]=useState(0)
  const [nbInactive,setNbInactive]=useState(0)

  const dispatch = useDispatch()
  const initFetch = useCallback(() => {
    dispatch(getAssociations()).then(er => setAssociations(er.payload.length));
    dispatch(getDonateurs()).then(er => setDonateurs(er.payload.length));
    dispatch(getEntreprises()).then(er => setEntreprises(er.payload.length));
    

  }, [dispatch])
  useEffect(() => {
    initFetch()
  }, [initFetch])
  useEffect(() => {
    dispatch(getObjets()).then(res=>{console.log(res);
      const objetsPublies = res.payload.filter(obj => obj.etatPublication === "publie");
    setNbPublie(objetsPublies.length);
      const objetsEnCours = res.payload.filter(obj => obj.etatPublication === "enCoursDeValidation");
      setNbEncours(objetsEnCours.length);
      const objetsRefuse = res.payload.filter(obj => obj.etatPublication === "refuse");
      setNbRefuse(objetsRefuse.length);
    })
    console.log(nbEncours)
    console.log(nbPublie)
    console.log(nbRefuse)
    dispatch(getCategoriesAdmin()).then(res=>{console.log(res);
      const catActive = res.payload.filter(obj => obj.etatArchive === false);
      setNbActive(catActive.length);
      const catInactive = res.payload.filter(obj => obj.etatArchive === true);
      setNbInactive(catInactive.length);
    })
    console.log(nbActive)
    console.log(nbInactive)
  }, [dispatch])
  useEffect(() => {
    
   
  }, [dispatch])
  return (
    <>
      <Typography component="h3" variant="h5" style={{marginTop:'10px'}}> <i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} className="fa-solid fa-chart-bar"></i> Statistiques des utilisateurs actifs et inactifs : </Typography>
      <Row style={{ marginTop: "20px",marginLeft:"20px" }}>
        <Col>
          <Card style={{width:"250px"}} >
            <Card.Body>

              <Card.Text>
                <h6> Nombre d'Associations: </h6>
                <h4 style={{ textAlign: "center", margin: "15px" }}>{associations}</h4>
              </Card.Text>

            </Card.Body>
          </Card>
        </Col>
        <Col >
          <Card style={{width:"250px" }}>
            <Card.Body>

              <Card.Text>
                <h6> Nombre des donateurs : </h6>
                <h4 style={{ textAlign: "center", margin: "15px" }}>{donateurs}</h4>
              </Card.Text>

            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{width:"250px"}} >
            <Card.Body>

              <Card.Text>
                <h6> Nombre des entreprises : </h6>
                <h4 style={{ textAlign: "center" , margin: "15px" }}>{entreprises}</h4>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Typography component="h3" variant="h5" style={{marginTop:'10px'}}> <i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} className="fas fa-chart-bar"></i> Statistiques des Objets : </Typography>
      <Row style={{ marginTop: "20px" ,marginLeft:"20px"  }}>
        <Col>
          <Card style={{width:"250px"}} >
            <Card.Body>
              <Card.Text>
                <h6> Nombre d'objets en cours : </h6>
                <h4 style={{ textAlign: "center", margin: "15px" }}>{nbEncours}</h4>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{width:"250px"}}>
            <Card.Body>

              <Card.Text>
                <h6> Nombre d'objets publiés : </h6>
                <h4 style={{ textAlign: "center", margin: "15px" }}>{nbPublie}</h4>
              </Card.Text>

            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{width:"250px"}}>
            <Card.Body>

              <Card.Text>
                <h6> Nombre d'objets refusés : </h6>
                <h4 style={{ textAlign: "center" , margin: "15px" }}>{nbRefuse}</h4>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Typography component="h3" variant="h5" style={{marginTop:'10px'}}> <i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} className="fas fa-chart-bar"></i> Statistiques des catégories : </Typography>
      <Row style={{ marginTop: "20px" ,marginLeft:"20px" }}>
        <Col>
          <Card style={{width:"350px"}}>
            <Card.Body>
              <Card.Text>
                <h6> Nombre des catégories actives : </h6>
                <h4 style={{ textAlign: "center", margin: "15px" }}>{nbActive}</h4>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{width:"350px"}}>
            <Card.Body>

              <Card.Text>
                <h6> Nombre des catégories inactives : </h6>
                <h4 style={{ textAlign: "center", margin: "15px" }}>{nbInactive}</h4>
              </Card.Text>

            </Card.Body>
          </Card>
        </Col>
      
      </Row>
      {/* <Categorie /> */}
    </>)
}
export default Dashboard
