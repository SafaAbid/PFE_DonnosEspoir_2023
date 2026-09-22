import React, { useState } from 'react'
import { Button, Card, CardContent, Divider, Grid, Stack, Tab, TabList, TabPanel, Tabs, Textarea, Typography } from '@mui/joy';
import { Alert, Avatar, Box, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { delDemandeReparation, getDemandeReparationAccepteesByEntreprise, getDemandesReparations, updateDescReparation } from '../../features/demandeReparationSlice';
import { createReparation } from '../../features/reparationSlice';
import { Edit, WarningAmberOutlined, WarningRounded } from '@mui/icons-material';
import { Col, Form, ModalDialog, Row } from 'react-bootstrap';

const Contenu = () => {
  const { id } = useParams()
  const [open, setOpen] = React.useState(false);
  const [openModalAcceptation, setOpenModalAcceptation] = useState(false);
  const [openModalAnnuler, setOpenModalAnnuler] = useState(false);
  const [dateRendez, setDateRendez] = useState("")
  const [heureRendez, setHeureRendez] = useState("")
  const [idDmd, setidDmd] = useState()
  const [filtre, setFiltre] = useState("enCours"); // pour le filtre sélectionné
  const [nomObjetFilter, setNomObjetFilter] = useState(""); // Pour le nom d'objet saisi
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [description, setDescription] = useState('');
  const [openDescription, setOpenDescription] = useState(false);
  const [dmdId, setDmdId] = useState();
  const [donateur, setDonateur] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const handleCloseModal = () => {
    setOpenModalAcceptation(false);
    setDateRendez("")
    setHeureRendez("")
    setidDmd()
  };
  const filtrerDemandes = (demandes) => {
    return demandes.filter((dmdRep) => {
      if (filtre === "acceptees") {
        // dispatch(getDemandeReparationAccepteesByEntreprise(id)).then(err=>console.log(err))
        return dmdRep.etatAcceptation === true;
      } else {
        //enCours
        // dispatch(getDemandesReparations()).then(er=>console.log(er));
        return dmdRep.etatAcceptation === false;
      }
    }).filter((dmd) => {
      // Filtrer en fonction du nom d'objet saisi
      return dmd.donation.demandeObjet.objet.nom.toLowerCase().includes(nomObjetFilter.toLowerCase());
    });

  };
  const handleNomObjetInputChange = (e) => {
    setNomObjetFilter(e.target.value);
  };
  //format(new Date(dateTime), 'yyyy-MM-ddTHH:mm:ss')
  const ajouterReparation = (idDemande) => {
    const heureParts = heureRendez.split(':');
    const heure = parseInt(heureParts[0], 10);
    const minute = parseInt(heureParts[1], 10);
    // Crée une nouvelle date avec la date actuelle et l'heure spécifiée
    const dateTime = new Date(dateRendez);
    dateTime.setHours(heure);
    dateTime.setMinutes(minute);
    console.log("id", id, "date", dateTime)
    console.log(dateTime.toISOString())
    const reparation = {
      dateDebut: dateTime.toISOString(),
      //dateFin:dateTime.toISOString(),
      idEntreprise: id,
      idDemandeReparation: idDemande,
    }
    // Vérification de la date
    const dateSysteme = new Date();

    if (dateTime < dateSysteme) {
      Swal.fire({
        icon: 'error',
        text: 'La date du rendez-vous ne peut pas être antérieure à la date actuelle',
        // allowOutsideClick: false, // Empêcher la fermeture en cliquant en dehors du message
        confirmButtonText: 'OK',
        toast: true,
        customClass: {
          popup: 'z-index: 100000;', // Classe CSS pour personnaliser le style du popup
        },
        backdrop: true,
        keydownListenerCapture: true,
        position: 'top',
      });
      return;
    }

    // Vérification de l'heure
    //const selectedHour = parseInt(heureRendez.split(':')[0]);
    if (heure < 9 || heure >= 18) {
      Swal.fire({
        icon: 'error',
        text: "L'heure du rendez-vous doit être comprise entre 9h et 18h",
        confirmButtonText: 'OK',
        allowOutsideClick: true,
        position: 'top',
        toast: true,
        customClass: {
          popup: 'z-index: 100000;', // Classe CSS pour personnaliser le style du popup
        },
        backdrop: true,
      });
      return;
    }
    dispatch(createReparation(reparation)).then(err => console.log(err))
    handleCloseModal()
    //navigate(`/listeDesDemandes/${user.user.id}`)
    /*const dateTime = moment(`${dateRendez}T${heureRendez}`);
        console.log("id", id, "date", dateTime);*/
  }
  const { user } = useSelector((state) => state.auth);
  const { demandesReparations, isLoading, error } = useSelector((state) => state.storeDemandesReparations);
  return (
    <>
      <Tabs
        variant="outlined"
        orientation="{direction.startsWith('row') ? 'vertical' : 'horizontal'}"
        aria-label="Basic tabs"
        value={filtre}
        onChange={(event, newValue) => setFiltre(newValue)} // Met à jour l'état de filtre lorsqu'un onglet est sélectionné
        sx={{
          gridColumn: "1/-1",
          width: "80vw",
          marginLeft: "15px",
          flexDirection: "direction",
        }}
      >
        <TabList underlinePlacement="bottom">
          <Tab indicatorPlacement="bottom" value="enCours" variant='outlined'
            color='neutral'>
            En Cours
          </Tab>
          <Tab indicatorPlacement="bottom" value="acceptees" variant='outlined'
            color='neutral'>
            Acceptées
          </Tab>

        </TabList>

        {demandesReparations &&
          <div style={{ marginTop: "20px", marginLeft: "300px" }}>

            <Form.Group as={Row} className="mb-1" controlId="formHorizontalEmail">
              <Form.Label column sm={2}>
                Chercher par
              </Form.Label>
              <Col sm={10}>
                <Form.Control type="text" placeholder="Nom Objet" onChange={handleNomObjetInputChange} style={{ width: '200px' }} />
              </Col>
            </Form.Group>
          </div>}

        {demandesReparations ? (
          <Stack spacing={2}>
            <TabPanel value="enCours">
              {filtrerDemandes(demandesReparations).length ? filtrerDemandes(demandesReparations).map((dmdRep, ind) => (
                (user?.donateur?.user.role=="entreprise" ? (dmdRep.etatAcceptation === false) :(dmdRep.etatAcceptation === false && dmdRep.donation.demandeObjet.association.userIdA==id)) && (
                  <Grid item xs={12} key={dmdRep.id}>
                    <Card sx={{ display: 'flex', flexDirection: 'row' }} variant="outlined">
                      <CardMedia
                        component="img"
                        sx={{ width: 200, objectFit: 'contain' }}
                        image={(dmdRep.donation.demandeObjet.objet.image && dmdRep.donation.demandeObjet.objet.image[0]) ? (dmdRep.donation.demandeObjet.objet.image[0].url) : null}
                        alt=""
                        style={{ width: "230px", height: "200px" }}
                      />
                      <CardContent style={{ marginLeft: "10px" }}>
                        <Row>
                          <Col>
                            <Box>
                              <Typography variant="body1" className="mb-0 mt-2">
                                <strong>Nom de l'Objet:</strong>
                                <p className="mb-0"> {" " + dmdRep.donation.demandeObjet.objet.nom}</p>
                              </Typography>
                              <Typography variant="body2" className="" >
                                {user.user?.role != "association" ? <><strong>Association:</strong>
                            <Link to={`/associationProfil/${dmdRep.donation.demandeObjet.association.userIdA}`} style={{ color: 'rgba(54, 79, 112, 0.8)' }} title={`Profil de ${dmdRep.donation.demandeObjet.association.user.nom}`}>
                              {"   "} <p className="mb-0"><strong style={{ textDecoration: 'underline' }}>{dmdRep.donation.demandeObjet.association.user?.nom} </strong></p>
                            </Link></> : <><strong>donateur :</strong>
                            <Link onClick={() => { setOpenModal(true), setDonateur(dmdRep.donation.demandeObjet.objet.donateur) }} style={{ color: 'rgba(54, 79, 112, 0.8)' ,marginLeft:"20px" }}  >
                   <p className="mb-0" style={{textDecoration: 'underline'}} >  {dmdRep.donation?.demandeObjet?.objet?.donateur?.user?.nom}
                       </p>
                            </Link></>}
                              </Typography>
                              <Typography variant="body2" className="mb-3">
                                <strong>Date de la demande:</strong>
                                <p className="mb-0"> {format(new Date(dmdRep.createdAt), 'dd/MM/yyyy  à HH:mm')} </p>

                              </Typography>
                            </Box>
                          </Col>
                          <Col style={{ marginRight: "90px" }}>

                            <Typography variant="body2" className="mb-3">
                              <strong>Description de la panne:</strong> {user?.user?.role == "association" && <Edit onClick={() => { setDmdId(dmdRep.id), setOpenDescription(true), setDescription(dmdRep.description) }} style={{ width: '20px', marginLeft: "6px" }}></Edit>}
                              <Textarea style={{ width: '220px', height: '160px', backgroundColor: "", marginTop: "5px" }} value={dmdRep.description} readOnly />
                            </Typography>
                          </Col>
                        </Row>
                      </CardContent>
                      <div style={{ marginTop: '80px' }}>
                        {user && user.donateur ? (<>
                          <Button variant="contained" color="secondary" style={{ marginRight: '40px', backgroundColor: "rgba(134, 162, 114, 0.8)" }} onClick={() => { setOpenModalAcceptation(true), setidDmd(dmdRep.id) }}>
                            Accepter
                          </Button></>) : (user && !user.donateur && user.user.role === "association") ? <Button variant="contained" color="secondary" style={{ marginRight: '40px', backgroundColor: "rgba(134, 162, 114, 0.8)" }} onClick={() => { setOpenModalAnnuler(true), setidDmd(dmdRep.id) }}>
                            Annuler
                          </Button> : <></>}
                      </div>
                    </Card>
                  </Grid>
                )
              )) : <div style={{ padding: "100px", margin: "100px", marginLeft: "100px", textAlign: "center" }}><h4> Aucune demande de réparation en cours n'a été trouvée </h4></div>
              }
            </TabPanel>
            <TabPanel value="acceptees">
              {filtrerDemandes(demandesReparations).length ? filtrerDemandes(demandesReparations).map((dmdRep, ind) => (
             ( user?.donateur?.user.role=="entreprise" ? (dmdRep.etatAcceptation === true && dmdRep.reparation[0].idEntreprise == id) :(dmdRep.etatAcceptation === true && dmdRep.donation.demandeObjet.association.userIdA==id)) && (
                  <Grid item xs={12} key={dmdRep.id} >
                    <Card sx={{ display: 'flex', flexDirection: 'row' }} variant="outlined">
                      <CardMedia
                        component="img"
                        sx={{ width: 200, objectFit: 'contain' }}
                        image={(dmdRep.donation.demandeObjet.objet.image && dmdRep.donation.demandeObjet.objet.image[0]) ? (dmdRep.donation.demandeObjet.objet.image[0].url) : null}
                        alt=""
                        style={{ width: "230px", height: "200px" }}
                      />
                      <CardContent style={{ marginLeft: "50px" }}>
                        <Row>
                          <Col>
                            <Box>
                              <Typography variant="body1" className="mb-3 mt-3">
                                <strong>Nom de l'Objet:</strong>
                                {"   " + dmdRep.donation.demandeObjet.objet.nom}
                              </Typography>
                              <Typography variant="body2" className="mb-3" >
                                {/* <strong>Association:</strong>
                                <Link to={`/associationProfil/${dmdRep.donation.demandeObjet.association.userIdA}`} style={{ color: 'rgba(54, 79, 112, 0.8)' }} title={`Profil de ${dmdRep.donation.demandeObjet.association.user.nom}`}>
                                  {"   "}  <strong style={{ textDecoration: 'underline' }}> {dmdRep.donation.demandeObjet.association.user.nom}</strong>
                                </Link> */}
                                 {user.user?.role != "association" ? <><strong>Association:</strong>
                            <Link to={`/associationProfil/${dmdRep.donation.demandeObjet.association.userIdA}`} style={{ color: 'rgba(54, 79, 112, 0.8)' }} title={`Profil de ${dmdRep.donation.demandeObjet.association.user.nom}`}>
                              {"   "} <p className="mb-0"><strong style={{ textDecoration: 'underline' }}>{dmdRep.donation.demandeObjet.association.user?.nom} </strong></p>
                            </Link></> : <><strong>donateur :</strong>
                            <Link onClick={() => { setOpenModal(true), setDonateur(dmdRep.donation.demandeObjet.objet.donateur) }} style={{ color: 'rgba(54, 79, 112, 0.8)' ,marginLeft:"20px" }}  >
                   <p className="mb-0" style={{textDecoration: 'underline'}}>  {dmdRep.donation.demandeObjet?.objet?.donateur?.user?.nom}
                       </p>
                            </Link></>}
                              </Typography>
                              <Typography variant="body2" className="mb-3">
                                <strong>Date de la demande:</strong>
                                {format(new Date(dmdRep.createdAt), 'dd/MM/yyyy  à HH:mm')}
                              </Typography>
                            </Box>
                          </Col>
                          <Col style={{ marginRight: "2px" }}>

                            <Typography variant="body2" className="mb-3">
                              <strong>Description de la panne:</strong>
                              <Textarea style={{ width: '220px', height: '160px', backgroundColor: "", marginTop: "5px" }} value={dmdRep.description} readOnly />
                            </Typography>
                          </Col>
                        </Row>
                      </CardContent>
                    </Card>
                  </Grid>
                ))

              ) : <div style={{ padding: "100px", margin: "100px", marginLeft: "100px", textAlign: "center" }}><h3>  Aucune demande de réparation acceptée n'a été trouvée </h3></div>

              }

            </TabPanel>
          </Stack>
        ) : null
        }

      </Tabs>
      <Dialog
        open={openDescription}
        onClose={() => setOpenDescription(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            Description
          </Box>
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
            variant="outlined"
            name='description'
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="danger"
            onClick={() => setOpenDescription(false)}
          >
            Annuler
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={() => { setOpenDescription(false), dispatch(updateDescReparation({ id: dmdId, description })).then(res => console.log(res)) }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>



      {/* modal pour l'acceptation et la planification du rendez-vous */}
      {/* {  <Modal
        open={openModalAcceptation}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        size="md"
        style={{zIndex: '1050'}}
      >
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '40px' }}    id="modal-container">
       <div className='mb-3'>
        <DialogTitle >
          <span style={{marginLeft:"60px"}} >Planifier un rendez-vous pour l'acquisition d'objet</span> 
            </DialogTitle>     
            </div>
            <Divider/>
           <div className='p-1 mt-1'>
           <label style={{marginBottom:"10px"}}><strong>Date du rendez-vous :</strong></label>
          <TextField
          required
            label=""
            type="date"
            value={dateRendez}
            onChange={(e) => {setDateRendez(e.target.value)}}
            fullWidth
            sx={{ marginBottom: '30px' }}
            name='date'
          />
            <label style={{marginBottom:"10px"}}><strong>Heure du rendez-vous :</strong></label>
          <TextField
            required
            label=""
            type="time"
            value={heureRendez}
            onChange={(e) => setHeureRendez(e.target.value)}
            fullWidth
            sx={{ marginBottom: '20px' }}
            name='heureRendezVous'
          />  
          </div>
          <Button onClick={handleCloseModal} sx={{ marginLeft: '200px',backgroundColor:"rgba(190, 55, 44, 0.8)" }}>Annuler</Button>
          <Button onClick={()=>ajouterReparation(idDmd)} sx={{ marginLeft: '30px' , backgroundColor:"rgba(134, 162, 114, 0.8)"}}>Envoyer</Button>
        </div>
      </Modal>} */}
      <Modal
        open={openModalAcceptation}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        size="md"
        style={{ zIndex: '1050' }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Empêche la soumission par défaut du formulaire
            ajouterReparation(idDmd);
          }}
        >
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '40px' }} id="modal-container">
            <div className='mb-3'>
              <DialogTitle>
                <span style={{ marginLeft: "60px" }}>Planifier un rendez-vous pour l'acquisition d'objet</span>
              </DialogTitle>
            </div>
            <Divider />
            <div className='p-1 mt-1'>
              <label style={{ marginBottom: "10px" }}><strong>Date du rendez-vous :</strong></label>
              <TextField
                required
                label=""
                type="date"
                value={dateRendez}
                onChange={(e) => { setDateRendez(e.target.value) }}
                fullWidth
                sx={{ marginBottom: '30px' }}
                name='date'
              />
              <label style={{ marginBottom: "10px" }}><strong>Heure du rendez-vous :</strong></label>
              <TextField
                required
                label=""
                type="time"
                value={heureRendez}
                onChange={(e) => setHeureRendez(e.target.value)}
                fullWidth
                sx={{ marginBottom: '20px' }}
                name='heureRendezVous'
              />
            </div>
            <Button type="button" onClick={handleCloseModal} sx={{ marginLeft: '200px', backgroundColor: "rgba(190, 55, 44, 0.8)" }}>Annuler</Button>
            <Button type="submit" sx={{ marginLeft: '30px', backgroundColor: "rgba(134, 162, 114, 0.8)" }}>Envoyer</Button>
          </div>
        </form>
      </Modal>
      {
      <Dialog 
      open={openModal} 
      onClose={() => setOpenModal(false)} 
      aria-labelledby="alert-dialog-title" 
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title" style={{color:"rgba(82, 131, 160, 1)"}}>
        Informations du Donateur :
      </DialogTitle>
      <Divider />
      <DialogContent dividers>
        <Grid container spacing={2} mb={1}>
          <Grid item xs={12} sm={5} sx={{ textAlign: 'center' }}>
            <Avatar
              alt={donateur?.user?.nom}
              src={donateur?.user?.image}
              sx={{ width: 100, height: 100, mx: 'auto', mt:4 }}
            />
          </Grid>
          <Grid item xs={12} sm={7}>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Nom:</strong> {donateur?.user?.nom}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Email:</strong> {donateur?.user?.email}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Numéro de Téléphone:</strong> {donateur?.numTelephone}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Adresse:</strong> {donateur?.adresse}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Nombre d'Objets Donnés:</strong> {donateur?.nbObjetsDonnes}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setOpenModal(false)} 
          
         style={{backgroundColor:"rgba(82, 131, 144, 1)"}}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog> }
      <Dialog open={openModalAnnuler} onClose={() => setOpenModalAnnuler(false)}  aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"  >
        <DialogTitle>
          <WarningAmberOutlined style={{ marginRight: '10px', color: 'red' }} />
          Confirmation
        </DialogTitle>
        <Divider />
        <DialogContent>
          <p style={{ fontFamily: 'inherit', fontSize: '18px', marginBottom: '0px', color: 'black' }}>Êtes-vous sûr de vouloir annuler cet demande ?</p>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant='outlined' color='neutral' onClick={() => setOpenModalAnnuler(false)}>
            Non
          </Button>
          <Button variant='outlined' color='danger' onClick={() => { dispatch(delDemandeReparation(idDmd)).then(err => console.log(err)); setOpenModalAnnuler(false) }}>
            Oui
          </Button>
        </DialogActions>
      </Dialog>

    </>)
}

export default Contenu
