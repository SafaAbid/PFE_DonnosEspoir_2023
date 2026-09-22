import React, { useState } from 'react'
import { Avatar, Button, Card, CardContent, DialogActions, DialogContent, DialogTitle, Divider, Grid, ModalDialog, Stack, Tab, TabList, TabPanel, Tabs, Typography } from '@mui/joy';
import { Alert, CardMedia, Modal, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { createDonation, updateArchive, updateRep } from '../../features/donationSlice';
import { Col, Form, Row } from 'react-bootstrap';
import { createDemandeReparation } from '../../features/demandeReparationSlice';
import { updateRealise } from '../../features/rendezVousSlice';
import { Warning, WarningAmber, WarningAmberRounded } from '@mui/icons-material';
import { Link } from 'react-router-dom';
//import { useNavigate } from 'react-router-dom';
//import moment from 'moment';
const Contenu = () => {
  const [open, setOpen] = React.useState(false);
  const [filtre, setFiltre] = useState(true); // pour le filtre sélectionné
  const [nomObjetFilter, setNomObjetFilter] = useState(""); // Pour le nom d'objet saisi
  const [idRendez, setIdRendez] = useState()
  const [openRealise, setOpenRealise] = useState(false)
  const [openAlert, setOpenAlert] = useState(false);
  const [benevoleRendez, setBenevoleRendez] = useState();
  const [openBenevole, setOpenBenevole] = useState(false);
  const [openDescription, setOpenDescription] = useState(false);
  const [donId, setDonId] = useState();
  const dispatch = useDispatch()
  const { donations, isLoading, error } = useSelector((state) => state.storeDonations);
  const { user } = useSelector((state) => state.auth);
  const [description, setDescription] = useState('');
  const [donateur, setDonateur] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const filtrerDonations = (donations) => {
    return donations.filter((don) => {
      if (filtre === true) {
        return (user?.user?.role=="association" ? (don.etatValidation == true && don.etatReparation == false) : (don.etatValidation == true));
      } else if (filtre == "falseValide") {
        return don.etatValidation == false
      } else if (filtre == "marque") {
        return (don.etatValidation == true && don.etatReparation == true)
      }
    }).filter((don) => {
      // Filtrer en fonction du nom d'objet saisi
      return don.demandeObjet.objet.nom.toLowerCase().includes(nomObjetFilter.toLowerCase());
    });
  };
  const handleNomObjetInputChange = (e) => {
    setNomObjetFilter(e.target.value);
  };
  const ajouterDemandeReparation = (idDonation, description) => {
    const demandeReparation = {
      idDonation: idDonation,
      description: description
    }
    dispatch(createDemandeReparation(demandeReparation)).then(err => {
      console.log(err);
      if (!err.error) {
        dispatch(updateRep(err.payload.donation.id)).then(res => console.log(res))
        setDescription("")
      }
    })
    setOpen(false)
  }
  //realiser un rendezVous
  const realiserRendez = (id) => {
    dispatch(updateRealise(id)).then(err => err.message)
    setOpenRealise(false)
    setOpen(true);
  }
  return (
    <>
      <Tabs
        variant="outlined"
        orientation="{direction.startsWith('row') ? 'vertical' : 'horizontal'}"
        aria-label="Basic tabs"
        value={filtre}
        onChange={(event, newValue) => setFiltre(newValue)}
        sx={{
          gridColumn: "1/-1",
          width: "80vw",
          marginLeft: "15px",
          flexDirection: "direction",
        }}
      >
        <TabList underlinePlacement="bottom">
          <Tab indicatorPlacement="bottom" value={true} variant='outlined'
            color='neutral'>
            Validées
          </Tab>
          {user && user.user?.role == "association" && <Tab indicatorPlacement="bottom" value="marque" variant='outlined'
            color='neutral'>
            Marquées réparation
          </Tab>}
          <Tab indicatorPlacement="bottom" value="falseValide" variant='outlined'
            color='neutral'>
            Non Effectuées
          </Tab>
        </TabList>
        {donations && <div style={{ marginTop: "20px", marginLeft: "300px" }}>
          <Form.Group as={Row} className="mb-1" controlId="formHorizontalEmail">
            <Form.Label column sm={2}>
              Chercher par
            </Form.Label>
            <Col sm={10}>
              <Form.Control type="text" placeholder="Nom Objet" onChange={handleNomObjetInputChange} style={{ width: '200px' }} />
            </Col>
          </Form.Group>
        </div>}

        {donations ? (
          <Stack spacing={2}>
            <TabPanel value={true}>
              {filtrerDonations(donations).length ? (filtrerDonations(donations).map((don, ind) => (
               user?.user?.role=="asoociation" ? (don.etatValidation == true && don.etatReparation == false) :(don.etatValidation == true) && (
                  <Grid item xs={12} key={don.id}>
                    <Card sx={{ display: 'flex', flexDirection: 'row' }} variant="outlined" >
                      <CardMedia
                        component="img"
                        sx={{ width: 200, objectFit: 'contain' }}
                        image={(don.demandeObjet.objet.image && don.demandeObjet.objet.image[0]) ? (don.demandeObjet.objet.image[0].url) : null}
                        alt=""
                        style={{ width: "200px", height: "150px" }}
                      />
                      <CardContent style={{ marginLeft: "100px" }}>

                        <Typography variant="body2" className="mb-3 mt-2">
                          <strong>Nom de l'Objet:</strong> {"   "}{don.demandeObjet?.objet.nom}
                        </Typography>
                        <Typography variant="body2" className="mb-3" >
                          {((user && user.user?.role !== "association") || (user && user.donateur)) ? <> <strong>Association :</strong>  {" "}
                            <Link to={`/associationProfil/${don.demandeObjet.association.userIdA}`} style={{ color: 'rgba(54, 79, 112, 0.8)' ,textDecoration: 'underline' }} title={`Profil de ${don.demandeObjet.association.user?.nom}`}>
                            {don.demandeObjet.association.user?.nom}
                            </Link>
                          </> : <> <strong>Donateur :</strong>
                          <Link onClick={() => { setOpenModal(true), setDonateur(don.demandeObjet.objet.donateur) }} style={{ color: 'rgba(54, 79, 112, 0.8)', textDecoration: 'underline' }}  >
                          {don.demandeObjet.objet.donateur?.user?.nom}
                            </Link>
                           </>}
                        </Typography>
                        <Typography variant="body2" className="mb-3">
                          <strong>Date du rendez vous:</strong>
                          {"  "}{format(new Date(don.rendezVous.date), 'dd/MM/yyyy  à HH:mm')}

                        </Typography>
                        {/* Ajoutez d'autres informations de la demande ici selon votre modèle de données */}

                      </CardContent>
                      {user && user.user && user?.user.role == "association" &&
                        <div style={{ marginTop: '50px' }}>
                          {/* <div  style={{  marginRight:'5px'}} ><Alert severity="success" >Validé</Alert> </div>*/}
                          <div style={{ marginTop: '15px' }}>
                            {<Button
                              style={{ marginRight: '20px', backgroundColor: "rgba(190, 55, 44, 0.8)" }}
                              //disabled={new Date(don.rendezVous.date).getTime() > new Date().getTime()}
                              onClick={() => {
                                if (new Date(don.rendezVous.date).getTime() < new Date().getTime()) {
                                  if (don.rendezVous.etatRealisation === "realise") {
                                    setOpen(true);
                                    setDonId(don.id);
                                  } else if (don.rendezVous.etatRealisation === "enCours") {
                                    setIdRendez(don.rendezVous.id);
                                    setDonId(don.id);
                                    setOpenRealise(true);
                                    console.log("ben", don.rendezVous.idBenevole)
                                    setBenevoleRendez(don.rendezVous.idBenevole);
                                  }
                                } else {
                                  setOpenAlert(true);
                                }
                              }}
                            >
                              Marquer pour réparation
                            </Button>}
                          </div>
                        </div>}
                    </Card>

                  </Grid>
                )
              ))) : <div style={{ padding: "100px", margin: "100px", marginLeft: "100px", textAlign: "center" }}><p style={{fontFamily:"serif", fontSize:"28px"}}> Aucune donation validée </p></div>
              }
            </TabPanel>
            <TabPanel value="marque">
              {filtrerDonations(donations).length ? (filtrerDonations(donations).map((don, ind) => (
                don.etatValidation == true && don.etatReparation == true && (
                  <Grid item xs={12} key={don.id} >
                    <Card sx={{ display: 'flex', flexDirection: 'row' }} variant="outlined">
                      <CardMedia
                        component="img"
                        sx={{ width: 200, objectFit: 'contain' }}
                        image={(don.demandeObjet.objet.image && don.demandeObjet.objet.image[0]) ? (don.demandeObjet.objet.image[0].url) : null}
                        alt=""
                        style={{ width: "200px", height: "150px" }}
                      />
                      <CardContent style={{ marginLeft: "100px" }}>

                        <Typography variant="body2" className="mb-3 mt-2">
                          <strong>Nom de l'Objet :</strong> {"   "}{don.demandeObjet.objet.nom}
                        </Typography>
                        <Typography variant="body2" className="mb-3" >
                          {((user && user.user?.role !== "association") || (user && user.donateur)) ? <> <strong>Association :</strong>
                            <Link to={`/associationProfil/${don.demandeObjet.association.userIdA}`} style={{ color: 'rgba(54, 79, 112, 0.8)' }} title={`Profil de ${don.demandeObjet.association.user?.nom}`}>
                              {don.demandeObjet.association.user?.nom}                                </Link>
                          </> : <> <strong>Donateur :</strong>
                          <Link onClick={() => { setOpenModal(true), setDonateur(don.demandeObjet.objet.donateur) }} style={{ color: 'rgba(54, 79, 112, 0.8)', textDecoration: 'underline' }}  >
                          {don.demandeObjet.objet.donateur?.user?.nom}
                            </Link>
                          </>}
                        </Typography>
                        <Typography variant="body2" className="mb-3">
                          <strong>Date du rendez vous :</strong>
                          {"  "}{format(new Date(don.rendezVous.date), 'dd/MM/yyyy  à HH:mm')}

                        </Typography>
                        {/* Ajoutez d'autres informations de la demande ici selon votre modèle de données */}

                      </CardContent>

                      <div style={{ marginTop: '50px' }}>
                        <div style={{ marginRight: '40px' }} ><Alert severity="success" >Validé</Alert> </div>
                      </div>
                    </Card>
                  </Grid>
                )
              ))) : <div style={{ padding: "100px", margin: "100px", marginLeft: "100px", textAlign: "center" }}><h3>Aucune donation marquées pour réparation </h3></div>
              }
            </TabPanel>
            <TabPanel value="falseValide">
              {filtrerDonations(donations).length ? (filtrerDonations(donations).map((don, ind) => (
                don.etatValidation === false && don.etatArchive === false && (
                  <Grid item xs={12} key={don.id}>
                    <Card sx={{ display: 'flex', flexDirection: 'row' }} variant="outlined">
                      <CardMedia
                        component="img"
                        sx={{ width: 200, objectFit: 'contain' }}
                        image={(don.demandeObjet.objet.image && don.demandeObjet.objet.image[0]) ? (don.demandeObjet.objet.image[0].url) : null}
                        alt=""
                        style={{ width: "200px", height: "150px" }}
                      />
                      <CardContent style={{ marginLeft: "100px" }}>

                        <Typography variant="body2" className="mb-3 mt-2">
                          <strong>Nom de l'Objet:</strong>{"   "}{don.demandeObjet.objet.nom}
                        </Typography>
                        <Typography variant="body2" className="mb-3" >
                          {((user && user.user?.role !== "association") || (user && user.donateur)) ? <> <strong>Association :</strong>  {" "}
                            <Link to={`/associationProfil/${don.demandeObjet.association.userIdA}`} style={{ color: 'rgba(54, 79, 112, 0.8)' ,textDecoration: 'underline' }} title={`Profil de ${don.demandeObjet.association.user?.nom}`}>
                              {don.demandeObjet.association.user?.nom}
                            </Link>
                          </> : <> <strong>Donateur :</strong>
                          <Link onClick={() => { setOpenModal(true), setDonateur(don.demandeObjet.objet.donateur) }} style={{ color: 'rgba(54, 79, 112, 0.8)', textDecoration: 'underline' }}  >
                          {don.demandeObjet.objet.donateur?.user?.nom}
                            </Link>
                           </>}
                        </Typography>
                        <Typography variant="body2" className="mb-3">
                          <strong>Date du rendez-vous:</strong>
                          {"  "}{format(new Date(don.rendezVous.date), 'dd/MM/yyyy  à HH:mm')}

                        </Typography>


                      </CardContent>
                      <div style={{ marginTop: '0px' }}>
                        <div style={{ marginRight: '5px' }} ><Alert severity="error" >Non Validé</Alert> </div>
                        {/*<div style={{ marginTop: '15px' }}>
        <Button  style={{ marginRight: '20px',  backgroundColor:"rgba(190, 55, 44, 0.8)"}} onClick={() => {setOpen(true),setDonId(don.id)}}>
        Archiver
        </Button>
         </div>*/}
                      </div>         </Card>
                  </Grid>
                )
              ))) : <div style={{ padding: "100px", margin: "100px", marginLeft: "100px", textAlign: "center" }}><h3>Aucune donation non effectuée</h3></div>
              }
            </TabPanel>
          </Stack>
        ) : null
        }

      </Tabs>
      {/* modal alerte pour la date */}
      <Modal open={openAlert} onClose={() => setOpenAlert(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            {<WarningAmber Color='danger'/>}
            Attention
          </DialogTitle>
          <Divider />
          <DialogContent style={{marginBottom:"-10px"}}>
          <p style={{color:"black"}}>  Il est impossible de marquer cette donation pour réparation car le rendez-vous n'a pas encore eu lieu.</p>
          </DialogContent>
<Divider></Divider>
          <DialogActions style={{margin:-13}} >
            <Button style={{ marginLeft: "550px", marginRight: "20px" }}   variant="outlined" color="success" onClick={() => { setOpenAlert(false) }}>
              d'accord
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
      {/* modal pour */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            {  <WarningAmber />}
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent style={{marginBottom:'-15px'}}>
          <p style={{color:"black"}}>  Êtes-vous sûr de vouloir marquer cet objet pour réparation ?</p>
          </DialogContent>
          <DialogActions>
            <Button size='sm' variant="solid" color="danger" onClick={() => setOpenDescription(true)}>
              Marquer
            </Button>
            <Button size='sm'variant="outlined" color="neutral" onClick={() => setOpen(false)}>
              Annuler
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
      <Modal open={openDescription} onClose={() => setOpenDescription(false)} >
        <ModalDialog variant="outlined" role="alertdialog" style={{ width: "500px", height: "310px" }}>
          <DialogTitle>
            { /* <WarningRoundedIcon />*/}
            Description :
          </DialogTitle>
          <Divider />
          <DialogContent>
            <TextField
              label="Description de la panne"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
            />          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={() => { setOpenDescription(false), dispatch(ajouterDemandeReparation(donId, description)) }}>
              Marquer
            </Button>
            <Button variant="plain" color="neutral" onClick={() => setOpenDescription(false)}>
              Annuler
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
      {/**modal pour realiser le rendezVous */}
      <Modal open={openRealise} onClose={() => setOpenRealise(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle color="danger">
            <WarningAmber />
            Attention
          </DialogTitle>
          <Divider />
          <DialogContent >
          <p style={{color:"black"}}> Voulez-vous d'abord réaliser le rendez-vous d'acquisition de l'objet avant de pouvoir marquer la donation pour réparation ?</p>
          </DialogContent>
          <Divider></Divider>
          <DialogActions style={{marginTop:'-15px' ,margin:-13}}>
            <Button variant="solid" color="danger" onClick={() => { (benevoleRendez && benevoleRendez > 0) ? realiserRendez(idRendez) : setOpenBenevole(true), setOpenRealise(false) }} >
              Oui
            </Button>
            <Button variant="outlined" color="neutral" onClick={() => setOpenRealise(false)}>
              Non
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
      {/**modal pour affecter bénévole */}
      <Modal open={openBenevole} onClose={() => { setOpenBenevole(false), setOpenRealise(false) }}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle color="danger">
            <Warning />
            Attention
          </DialogTitle>
          <Divider />
          <DialogContent style={{marginBottom:"-15px",marginTop:"9px"}} >
          <p style={{color:"black"}}> Veuillez affecter un bénévole à ce rendez-vous pour pouvoir le réaliser.</p>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" size='sm' color='success'>
              {user && user.donateur ? (
                <li className="sidebar-item">
                  <Link to={`/rendezVous/${user && user.donateur.user.id}`} className="text-dark">
                    <i className="fa-solid fa-envelope pe-2"></i>
                    Consulter vos rendez-vous
                  </Link>
                </li>
              ) : (
                <li className="sidebar-item">
                  <Link to={`/rendezVous/${user && user.user && user.user.id}`} className="text-dark">
                    <i className="fa-solid fa-calendar-alt pe-2"></i>
                    Consulter vos rendez-vous
                  </Link>
                </li>
              )}
            </Button>
            <Button variant="outlined" color='neutral' size='sm'  onClick={() => { setOpenBenevole(false), setOpenRealise(false) }}>
              Annuler
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
  {/* Informations du Donateur*/}
  <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <ModalDialog
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          sx={{
            width: 600,
            maxWidth: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: 3,
            borderRadius: 2,
            boxShadow: 'lg'
          }}
        >
          <Typography level="h4" mb={0}>
            Informations du Donateur
          </Typography>
          <Divider />
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
              <Avatar
                alt={donateur.user?.nom}
                src={donateur.user?.image}
                sx={{ width: 100, height: 100, mx: 'auto', mt: 4 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography level="body1" sx={{ mb: 1 }} ><strong>Nom:</strong> {donateur.user?.nom}</Typography>
              <Typography level="body1" sx={{ mb: 1 }}><strong>Email:</strong> {donateur.user?.email}</Typography>
              <Typography level="body1" sx={{ mb: 1 }}><strong>Numéro de Téléphone:</strong> {donateur?.numTelephone}</Typography>
              <Typography level="body1" sx={{ mb: 1 }}><strong>Adresse:</strong> {donateur?.adresse}</Typography>
              <Typography level="body1" sx={{ mb: 1 }}><strong>Nombre d'Objets Donnés:</strong> {donateur?.nbObjetsDonnes}</Typography>
            </Grid>
          </Grid>
          <Divider style={{ marginBottom: "-6px" }} />
          <DialogActions>
            <Button
              onClick={() => setOpenModal(false)}
              
              style={{ marginLeft: "400px",backgroundColor:"rgba(82, 131, 144, 1)",color:'white' }}
            >
              Fermer
            </Button>
          </DialogActions>

        </ModalDialog>
      </Modal>
    </>
  )
}

export default Contenu
