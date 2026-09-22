import React, { useState } from 'react'
import { Button, Card, CardContent, DialogActions, DialogContent, DialogTitle, Divider, Grid, ModalDialog, Stack, Tab, TabList, TabPanel, Tabs, Typography, Textarea } from '@mui/joy';
import { Alert, CardMedia, Box, Avatar } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
//import { createobjation, updateArchive } from '../../features/objationSlice';
//import { useNavigate } from 'react-router-dom';
//import moment from 'moment';

import { Modal, Container, Row, Col, Carousel, Image, Form } from 'react-bootstrap';
import { updateRefus, updateValide } from '../../../../features/objetSlice';
import { Padding, WarningAmberOutlined } from '@mui/icons-material';
//import { Textarea } from '@mui/joy/Textarea';
const Contenu = () => {
  const [open, setOpen] = React.useState(false);
  const [openRefus, setOpenRefus] = React.useState(false);
  const [filtre, setFiltre] = useState("enCoursDeValidation"); // pour le filtre sélectionné
  const [objId,setobjId]=useState();
  const dispatch=useDispatch()
  const {objets,isLoading,error} = useSelector((state)=>state.storeObjets);
  const [selectedObject, setSelectedObject] = useState(null);
  const [openRaisonRefus, setOpenRaisonRefus] = useState(false);
const [refusRaison, setRefusRaison] = useState('');
const handleRaisonChange = (e) => {
  setRefusRaison(e.target.value);
};
  const filtrerObjets = (objets) => {
    return objets.filter((obj) => {
      if (filtre === "refuse") {
        return obj.etatPublication=== "refuse";
      } else if (filtre === "publie") {
        return obj.etatPublication === "publie";
      } else {
        return obj.etatPublication=="enCoursDeValidation"
      }
    });
  }; 
  const validerObjet=(id)=>{
    dispatch(updateValide(id)).then(res=>console.log(res))
  }  
  const refuserObjet=(id,refusRaison)=>{
    console.log("raison",refusRaison)
    const obj={
      id:id,raison:refusRaison
    }
    dispatch(updateRefus(obj)).then(res=>console.log(res,"raison"+refusRaison))

  }
  const handleSubmitRefus=(e)=>{
    e.preventDefault();
    refuserObjet(objId, refusRaison);
     setOpenRaisonRefus(false);
     setOpenRefus(false) 
  }
  return (
  
    <>
 
      <h3 component="h5" variant="h5"> Liste des objets :</h3>
   
     <Tabs
        variant="outlined"
        orientation="{direction.startsWith('row') ? 'vertical' : 'horizontal'}"
        aria-label="Basic tabs"
        value={filtre} 
        onChange={(event, newValue) => setFiltre(newValue)} 
        sx={{
          gridColumn: "1/-1",
          width:"75vw",
           marginLeft:"10px",
           marginRight:"80px",
          flexDirection: "direction",
        }}
      >
          <TabList underlinePlacement="bottom">
          <Tab indicatorPlacement="bottom" value={"enCoursDeValidation"}  variant='outlined'
            color= 'neutral'>
            En Cours
          </Tab>
          <Tab indicatorPlacement="bottom" value={"publie"} variant='outlined'
            color= 'neutral'>
          Publiés
          </Tab>
          <Tab indicatorPlacement="bottom" value="refuse" variant='outlined'
            color= 'neutral'>
           refusés
          </Tab>
        </TabList>
     
        
    {objets ? (
      <Stack spacing={3}>
      <TabPanel value={"enCoursDeValidation"}>
      <Grid container spacing={2} sx={{minHeight:"500px"}}>
        { filtrerObjets(objets).length>0 ? filtrerObjets(objets).map((obj, ind) => (
          obj.etatPublication=="enCoursDeValidation" && obj.etatArchive==false && (
            <Grid  item xs={12} key={obj.id}>
                  <Card sx={{ display: 'flex', flexDirection: 'row' }} variant="outlined">
          <CardMedia
            component="img"
            sx={{ width: 200, objectFit: 'contain' }}
            image={( obj.image && obj.image[0])?(obj.image[0].url):null}
            alt=""
            style={{width:"200px",height:"150px",marginTop:"20px"}}
          />
          <CardContent style={{marginLeft:"100px"}}>
            
            <Typography variant="body2" className="mb-3 mt-2">
              <strong>Nom de l'Objet:</strong> {"   "}{ obj.nom}
            </Typography>
            <Typography variant="body2" className="mb-3" >
              <strong>Catégorie:</strong> {"   "}{obj.sousCategorie?.nom}
            </Typography>
            <Typography variant="body2" className="mb-3">
              <strong>Date du demande:</strong> 
             {"  "}{format(new Date(obj.createdAt), 'dd/MM/yyyy à HH:mm')}
              
            </Typography>
            {/* Ajoutez d'autres informations de la demande ici selon votre modèle de objnées */}
            <Typography variant="body2" className="mb-3" >
             <Button onClick={()=>{setSelectedObject(obj)}}> Voir Plus de détails</Button>
            </Typography>
          </CardContent>
          
           <div style={{ marginTop: '0px' }}>
           <div style={{ marginTop: '80px' }}>
        <Button  style={{ marginRight: '20px',  backgroundColor:"rgba(134, 162, 114, 0.8)" }} onClick={() => {setOpen(true),setobjId(obj.id)}}>
        Accepter
        </Button>
        <Button  style={{ marginRight: '20px',backgroundColor:"rgba(190, 55, 44, 0.8)" }} onClick={() => {setOpenRefus(true),setobjId(obj.id)}}>
        Refuser
        </Button>
       </div>
        </div>  
        </Card>
            </Grid>
          )
        )):
        <Typography  style={{ fontSize:"25px",marginLeft: "20px", marginLeft:"350px" , marginTop:"250px"}}> Aucune demande en cours</Typography>
   
      }
        </Grid>
      </TabPanel>
      <TabPanel value={"publie"}>
      <Grid container spacing={2} sx={{minHeight:"500px"}} >
        {filtrerObjets(objets).length>0 ?filtrerObjets(objets).map((obj, ind) => (
        obj.etatPublication=="publie" && (
            <Grid item xs={12} key={obj.id}  >
                  <Card sx={{ display: 'flex', flexDirection: 'row' }} variant="outlined">
          <CardMedia
            component="img"
            sx={{ width: 200, objectFit: 'contain' }}
            image={( obj.image && obj.image[0])?(obj.image[0].url):null}
            alt=""
            style={{width:"200px",height:"150px"}}
          />
          <CardContent style={{marginLeft:"100px"}}>
           
            <Typography variant="body2" className="mb-3 mt-2">
              <strong>Nom de l'Objet:</strong>{"   "}{ obj.nom}
            </Typography>
            <Typography variant="body2" className="mb-3" >
              <strong>Catégorie:</strong> {"   "}{obj.sousCategorie.nom}
            </Typography>
            <Typography variant="body2" className="mb-3">
              <strong>Date du demande:</strong> 
             {"  "}{format(new Date(obj.createdAt), 'dd/MM/yyyy à HH:mm')}  
            </Typography>
          </CardContent>
          <div style={{ marginRight:"50px",marginTop:"45px"}}><Alert severity="success">Validé</Alert></div>
        </Card>
            </Grid>
       )
      )):
      <Typography style={{ fontSize:"25px",marginLeft: "20px", marginLeft:"350px" , marginTop:"250px"}}> Aucune demande publié</Typography>
 
      }
        </Grid>
      </TabPanel>
      <TabPanel value="refuse">
      <Grid container spacing={2} sx={{minHeight:"500px"}} >
        {filtrerObjets(objets).length>0 ? filtrerObjets(objets).map((obj, ind) => (
         obj.etatPublication=== "refuse" && (
            <Grid item xs={12} key={obj.id}>
                  <Card sx={{ display: 'flex', flexDirection: 'row' }} variant="outlined">
          <CardMedia
            component="img"
            sx={{ width: 200, objectFit: 'contain' }}
            image={( obj.image && obj.image[0])?(obj.image[0].url):null}
            alt=""
            style={{width:"200px",height:"150px"}}
          />
          <CardContent style={{marginLeft:"100px"}}>
           
            <Typography variant="body2" className="mb-3 mt-2">
              <strong>Nom de l'Objet:</strong>{"   "}{ obj.nom}
            </Typography>
            <Typography variant="body2" className="mb-3" >
              <strong>Catégorie:</strong> {"   "}{obj?.sousCategorie?.nom}
            </Typography>
            <Typography variant="body2" className="mb-3">
              <strong>Date du demande:</strong> 
             {"  "}{format(new Date(obj.createdAt), 'dd/MM/yyyy à HH:mm')}
              
            </Typography>
           
           
          </CardContent>
          
           <div  style={{  marginRight:'50px',marginTop:"45px"}} ><Alert severity="error" >Réfusé</Alert> </div>
           
                </Card>
            </Grid>
          )
        )):
        <Typography style={{ fontSize:"25px",marginLeft: "20px", marginLeft:"350px" , marginTop:"250px"}}> Aucune demande refusée</Typography>
   
      }  
        </Grid>
      </TabPanel>
    </Stack>
     ) : null
                  }
      
    </Tabs> 
      
                  {/* modal pour la validation */}
                  <Modal show={open} onHide={()=>setOpen(false)} centered >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '22px', fontStyle: 'italic' }}>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body  >
       <p  style={{ fontSize: '18px' }} >Êtes-vous sûr de vouloir accepter cette demande de publication?</p> 
        </Modal.Body>
        <Modal.Footer>  
          <Button variant='outlined' color='danger' style={{ marginRight:"20px"}} onClick={()=>setOpen(false)}>
            Annuler
          </Button>
          <Button variant='outlined' color='success' onClick={() => {validerObjet(objId),setOpen(false)}}>
            Accepter
          </Button>
        </Modal.Footer>
      </Modal>
      {/* modal pour le refus */}
      <Modal show={openRefus} onHide={()=>setOpenRefus(false)}  centered>
        <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: '20px' }}> <div><WarningAmberOutlined style={{marginRight:'8px'}}></WarningAmberOutlined>Attention</div></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{marginBottom:'-20px'}}>
        <p  style={{ fontSize: '16px',color:'black' }} >Êtes-vous sûr de vouloir refuser cette demande de publication ?</p> 
      
        </Modal.Body>
        <Modal.Footer>
          <Button variant='outlined' color='success' style={{ marginRight: "20px"}} size='sm' onClick={()=>setOpenRefus(false)}>
            Annuler
          </Button>
          <Button variant='outlined' color='danger' style={{ paddingLeft:"15px", paddingRight: "20px" }} size='sm' onClick={()=>{setOpenRefus(false),setOpenRaisonRefus(true)}}>
            Oui
        </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={openRaisonRefus} onHide={() => setOpenRaisonRefus(false)} centered>
    <Form onSubmit={handleSubmitRefus}> 
    <Modal.Header closeButton>
        <Modal.Title style={{ color: "rgba(200, 16, 6, 0.84)" }}>Raison du refus</Modal.Title>
    </Modal.Header>
    <Modal.Body>
   
            <Form.Group controlId="formRaisonRefus">
                <Form.Label>Raison du refus :</Form.Label>
                <Form.Control 
                    as="textarea"
                    required
                    style={{ width: '100%', minHeight: '100px', padding: '10px' }}
                    name="raison"
                    placeholder="Saisissez la raison du refus"
                    value={refusRaison}
                    onChange={(e) => handleRaisonChange(e)}
                />
            </Form.Group>
        
    </Modal.Body>
    <Modal.Footer>
        <Button style={{ backgroundColor: "rgba(22, 35, 39, 0.71)",borderColor:"rgba(22, 35, 39, 0.71)", marginRight: "20px" }} size='sm' onClick={() => setOpenRaisonRefus(false)}>
            Annuler
        </Button>
        <Button style={{ backgroundColor: "rgba(200, 16, 6, 0.84)",borderColor:"rgba(200, 16, 6, 0.84)" }} size='sm' type='submit'>
            Confirmer le refus
        </Button>
    </Modal.Footer>
    </Form>
</Modal>
 <Modal show={selectedObject !== null} onHide={()=>{setSelectedObject(null)}} size="xl" centered>
                <Modal.Body className="d-flex " style={{ maxHeight: "880vh", overflowY: "auto" }}>
                    {selectedObject && <Container>
                        <Row className="justify-content-md-center">
                            <Col >
                                <div >
                                    <Carousel className="rounded">
                                        {selectedObject.image.map((image, index) => (
                                            <Carousel.Item key={index}>
                                                <Image src={image.url} alt={`Image ${index + 1}`} thumbnail className='d-block  mx-auto' style={{ maxWidth: "800px", maxHeight: "600px", width: "500px", height: "500px", }} />
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                </div>
                            </Col>
                            <Col className='mt-3'>
                                <Box
                                    component="section"
                                    sx={{ mb: 2, mr: 3, ml: 0, p: 2, border: '1px solid grey', backgroundColor: "rgba(182, 182, 182, 0.18)" }}
                                >
                                    <Grid container spacing={2}>
                                        <Row>
                                            <Col>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item xs={12} sm={5}>
                                                        <Avatar
                                                            src={selectedObject.donateur.user.image}
                                                            alt="Image du donateur"
                                                            sx={{ width: 76, height: 76, marginTop: 2, marginLeft: 7 }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={7}>
                                                        <Grid container spacing={0}>
                                                            <Grid item xs={12}>
                                                                <Typography variant="h6" sx={{ fontFamily: 'serif', fontSize: 18 }}>
                                                                    <strong>Nom :</strong> {selectedObject.donateur.user.nom}
                                                                </Typography>
                                                            </Grid>
                                                            
                                                            <Grid item xs={12}>
                                                                <Typography variant="h6" sx={{ fontFamily: 'serif', fontSize: 18 }}>
                                                                    <strong>Téléphone :</strong> {selectedObject.donateur.numTelephone}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography variant="h6" sx={{ fontFamily: 'serif', fontSize: 18,marginRight:2 }}>
                                                                    <strong>Adresse :</strong> {selectedObject.donateur.adresse}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography variant="h6" sx={{ fontFamily: 'serif', fontSize: 18 }}>
                                                                    <strong>Ville :</strong> {selectedObject.donateur.ville}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography variant="h6" sx={{ fontFamily: 'serif', fontSize: 18 }}>
                                                                    <strong>Email :</strong> {selectedObject.donateur.user.email}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography variant="h6" sx={{ fontFamily: 'serif', fontSize: 18 }}>
                                                                    <strong>Objets donnés :</strong> {selectedObject.donateur.nbObjetsDonnes}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </Box>
                                <div style={{ marginTop: "30px" }}>
                                    <Row>
                                        <Col >
                                            <h5 style={{ fontFamily: 'serif', fontSize: "18px" }}>Nom :</h5>
                                            <p className="mt-1 center ">{selectedObject.nom}</p>
                                        </Col>
                                        <Col>
                                            <h5 style={{ fontFamily: 'serif', fontSize: "18px" }}>Catégorie :</h5>
                                            <p className="mt-1 center ">{selectedObject.sousCategorie.nom}</p>
                                        </Col>
                                        <Col>

                                            <h5 style={{ fontFamily: 'serif', fontSize: "18px" }}> État de l'objet :</h5>
                                            {(selectedObject.etatObjet == "tresBonEtat") ? <p>Très bon état</p> : (selectedObject.etatObjet == "moyenEtat") ? <p>Moyen état</p> : <p> Bon état</p>}
                                        </Col>
                                    </Row></div>
                                <div style={{ marginTop: "10px" }}>
                                    <h5 style={{ fontFamily: 'serif', fontSize: "18px" }}>Description :</h5>
                                    <Textarea
                                        minRows={2}
                                        size="md"
                                        required
                                        value={selectedObject.description}
                                        name="description"
                                        readOnly
                                    />
                                </div>
                                {               /* <textarea value={selectedObject.description} style={{ width: "100%", height: "90px", resize: "vertical" }} readOnly />
*/}    </Col>
                        </Row>
                    </Container>}
                </Modal.Body>
                <Modal.Footer>
                    <Button color='neutral' onClick={(e)=>setSelectedObject(null)}>Fermer</Button>
                </Modal.Footer>
            </Modal>
                  </>
                   )
}

export default Contenu
