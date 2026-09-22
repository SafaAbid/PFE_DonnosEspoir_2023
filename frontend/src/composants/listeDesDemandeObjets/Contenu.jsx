import React, { useEffect, useState } from 'react'
import { Button, Card, CardContent, DialogActions, DialogContent, DialogTitle, Divider, Grid, ModalDialog, Stack, Tab, TabList, TabPanel, Tabs, Typography } from '@mui/joy';
import { Alert, Avatar, CardMedia, Modal, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { createDonation } from '../../features/donationSlice';
import { Link, useNavigate } from 'react-router-dom';
import { delDemandeObjet, updateRefusDemandeObjet } from '../../features/demandeObjetSlice';
import Swal from 'sweetalert2';
import { Col, FloatingLabel, Form, Row } from 'react-bootstrap';
import { WarningAmberOutlined, WarningRounded } from '@mui/icons-material';

//import moment from 'moment';
const Contenu = ({ nom }) => {
  const [open, setOpen] = React.useState(false);
  const [openAnnuler, setOpenAnnuler] = React.useState(false);
  const [openModalAcceptation, setOpenModalAcceptation] = useState(false);
  const [dateRendez, setDateRendez] = useState("")
  const [heureRendez, setHeureRendez] = useState("")
  const [idDmd, setidDmd] = useState()
  const [filtre, setFiltre] = useState("enCours"); //pour le filtre sélectionné
  const [nomObjetFilter, setNomObjetFilter] = useState(""); // Pour le nom d'objet saisi
  const [donateur, setDonateur] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const [actualiser,setActualiser]=useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleCloseModal = () => {
    setOpenModalAcceptation(false);
    setDateRendez("")
    setHeureRendez("")
    setidDmd()
  };
  useEffect(() => {
    console.log("nomObj", nom)
    if (nom) {
      setNomObjetFilter(nom);
    }

  }, [nom,actualiser]);

  const filtrerDemandes = (demandes) => {
    return demandes.filter((dmdObj) => {
      if (filtre === "acceptees") {
        return dmdObj.etatAcceptation === "acceptee";
      } else if (filtre === "refusees") {
        return dmdObj.etatAcceptation === "refusee";
      } else if (filtre === "annulees") {
        return dmdObj.etatAcceptation === "annulee";
      }
      else {
        // Par défaut, affiche les demandes en cours
        return dmdObj.etatAcceptation === "enCours";
      }
    }).filter((dmdObj) => {
      // Filtrer en fonction du nom d'objet saisi
      return dmdObj.objet.nom.toLowerCase().includes(nomObjetFilter.toLowerCase());
    });;
  };
  const handleNomObjetInputChange = (e) => {
    setNomObjetFilter(e.target.value);
  };
  //format(new Date(dateTime), 'yyyy-MM-ddTHH:mm:ss')
  const ajouterDonation = (id) => {
    const heureParts = heureRendez.split(':');
    const heure = parseInt(heureParts[0], 10);
    const minute = parseInt(heureParts[1], 10);
    // Crée une nouvelle date avec la date actuelle et l'heure spécifiée
    const dateTime = new Date(dateRendez);
    dateTime.setHours(heure);
    dateTime.setMinutes(minute);
    console.log("id", id, "date", dateTime)
    console.log(dateTime.toISOString())
    const donation = {
      date: dateTime.toISOString(),
      idDemandeObjet: id,
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
    dispatch(createDonation(donation)).then(err => {console.log(err),setActualiser(true)})
    handleCloseModal()
    navigate(`/listeDesDemandes/${user.user.id}`)
    /*const dateTime = moment(`${dateRendez}T${heureRendez}`);
        console.log("id", id, "date", dateTime);*/
  }
  const { user } = useSelector((state) => state.auth);
  const { demandesObjets, isLoading, error } = useSelector((state) => state.storeDemandesObjets);
  return (
    <>
      <Tabs
        variant="outlined"
        orientation="{direction.startsWith('row') ? 'vertical' : 'horizontal'}"
        aria-label="Basic tabs"
        value={filtre} // Utilisez la valeur de l'état de filtre pour définir l'onglet actif
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
          <Tab indicatorPlacement="bottom" value="refusees" variant='outlined'
            color='neutral'>
            Refusées
          </Tab>
          <Tab indicatorPlacement="bottom" value="annulees" variant='outlined'
            color='neutral'>
            Annulées
          </Tab>
        </TabList>
        {demandesObjets &&
          <div style={{ marginTop: "20px", marginLeft: "300px" }}>
            <Form.Group as={Row} className="mb-1" controlId="formHorizontalEmail">
              <Form.Label column sm={2}>
                Chercher par
              </Form.Label>
              <Col sm={10}>
                <Form.Control type="text" placeholder="Nom Objet" value={nomObjetFilter} onChange={handleNomObjetInputChange} style={{ width: '200px' }} />
              </Col>
            </Form.Group></div>}
        {/*filtrerDemandes(demandesObjets).length ? >
      */}
        {demandesObjets ? (
          <Stack spacing={2}>
            <TabPanel value="enCours">
              {filtrerDemandes(demandesObjets).length ? (filtrerDemandes(demandesObjets).map((dmdObj, ind) => (
                dmdObj.etatAcceptation === "enCours" && (
                  <Grid item xs={12} key={dmdObj.id} >
                    <Card sx={{ display: 'flex', flexDirection: 'row' }} variant="outlined">
                      <CardMedia
                        component="img"
                        sx={{ width: 200, objectFit: 'contain' }}
                        image={(dmdObj.objet && dmdObj.objet.image[0]) ? (dmdObj.objet.image[0].url) : null}
                        alt=""
                        style={{ width: "200px", height: "150px" }}
                      />
                      <CardContent style={{ marginLeft: "100px" }}>
                        <Typography variant="body2" className="mb-3 mt-2">
                          <strong>Nom de l'Objet:</strong> {dmdObj.objet.nom && dmdObj.objet.nom}
                        </Typography>
                        <Typography variant="body2" className="mb-3" >
                          {user?.user?.role != "association" ? <><strong>Association:</strong>
                            <Link to={`/associationProfil/${dmdObj.association.userIdA}`} style={{ color: 'rgba(54, 79, 112, 0.8)' }} title={`Profil de ${dmdObj.association.user?.nom}`}>
                              {"   "} <strong style={{ textDecoration: 'underline' }}>{dmdObj.association.user?.nom} </strong>
                            </Link></> : <><strong>donateur :</strong>{"   "}
                            <Link onClick={() => { setOpenModal(true), setDonateur(dmdObj.objet.donateur) }} style={{ color: 'rgba(54, 79, 112, 0.8)', textDecoration: 'underline' }}  >
                              {dmdObj.objet.donateur.user?.nom}
                            </Link></>}
                        </Typography>
                        <Typography variant="body2" className="mb-3">
                          <strong>Date de la demande:</strong>
                          {format(new Date(dmdObj.dateDeDemande), 'dd/MM/yyyy  à HH:mm')}

                        </Typography>
                      </CardContent>
                      <div style={{ marginTop: '50px' }}>
                        {((user && !user.donateur && (user && user.user.role === "donateur")) || (user && user.donateur && user.donateur.user.role === "entreprise"))
                         ? (<>
                         {/* <Button style={{ marginRight: '20px', backgroundColor: "rgba(190, 55, 44, 0.8)" }} onClick={() => { setOpen(true), setidDmd(dmdObj.id) }}>
                          Refuser
                        </Button> */}
                          <Button variant="contained" color="secondary" style={{ marginRight: '80px', backgroundColor: "rgba(134, 162, 114, 0.8)" }} onClick={() => { setOpenModalAcceptation(true), setidDmd(dmdObj.id) }}>
                            Accepter
                          </Button></>) : (user && !user.donateur && user.user.role === "association") ? <Button variant="contained" color="secondary" style={{ marginRight: '40px', backgroundColor: "rgba(134, 162, 114, 0.8)" }} onClick={() => { setOpenAnnuler(true), setidDmd(dmdObj.id) }}>
                            Annuler
                          </Button> : <></>}
                      </div>
                    </Card>

                    <Modal open={openAnnuler} onClose={() => setOpenAnnuler(false)} >
                      <ModalDialog variant="outlined" role="" style={{ width: "580px", height: "190px" }}>
                        <DialogTitle>
                          <WarningAmberOutlined style={{ marginRight: '10px', color: 'red' }} />
                          Confirmation
                        </DialogTitle>
                        <Divider />
                        <DialogContent>
                          <p style={{ fontFamily: 'inherit', fontSize: '18px', marginBottom: '0px', color: 'black' }}>Êtes-vous sûr de vouloir annuler cet objet ?</p>
                        </DialogContent>
                        <DialogActions>
                          <Button variant='outlined' color='danger' onClick={() => { dispatch(delDemandeObjet(idDmd)).then(err => console.log(err)); setOpenAnnuler(false); }}>
                            Oui
                          </Button>
                          <Button variant='outlined' color='neutral' onClick={() => setOpenAnnuler(false)}>
                            Non
                          </Button>
                        </DialogActions>
                      </ModalDialog>
                    </Modal>
                  </Grid>
                )
              ))) : <div style={{ padding: "100px", margin: "100px", marginLeft: "100px", textAlign: "center" }}><h3>Aucune demande en cours n'a été trouvée</h3></div>
              }
            </TabPanel>
            <TabPanel value="acceptees">
              {filtrerDemandes(demandesObjets).length ? (filtrerDemandes(demandesObjets).map((dmdObj, ind) => (
                dmdObj.etatAcceptation === "acceptee" && (
                  <Grid item xs={12} key={dmdObj.id}>
                    <Card sx={{ display: 'flex', flexDirection: 'row' }} variant="outlined">
                      <CardMedia
                        component="img"
                        sx={{ width: 200, objectFit: 'contain' }}
                        image={(dmdObj.objet.image[0]) ? (dmdObj.objet.image[0].url) : null}
                        alt=""
                        style={{ width: "200px", height: "150px" }}
                      />
                      <CardContent style={{ marginLeft: "100px" }}>
                        {/*<Typography variant="h5" component="div">
              Demande d'Objet {dmdObj.id}
          </Typography>*/}
                        <Typography variant="body2" className="mb-3 mt-2">
                          <strong>Nom de l'Objet:</strong> {" "}{dmdObj.objet.nom}
                        </Typography>
                        <Typography variant="body2" className="mb-3" >
                          {user?.user?.role != "association" ? <><strong>Association:</strong>
                            <Link to={`/associationProfil/${dmdObj.association.userIdA}`} style={{ color: 'rgba(54, 79, 112, 0.8)' }} title={`Profil de ${dmdObj.association.user?.nom}`}>
                              {"   "} <strong style={{ textDecoration: 'underline' }}>{dmdObj.association.user?.nom} </strong>
                            </Link></> : <><strong>donateur :</strong>{"   "}
                            <Link onClick={() => { setOpenModal(true), setDonateur(dmdObj.objet.donateur) }} style={{ color: 'rgba(54, 79, 112, 0.8)', textDecoration: 'underline' }}  >
                              {dmdObj.objet.donateur.user?.nom}
                            </Link></>}
                        </Typography>
                        <Typography variant="body2" className="mb-3">
                          <strong>Date de la demande:</strong>
                          {format(new Date(dmdObj.dateDeDemande), 'dd/MM/yyyy  à HH:mm')}
                          {/*dmdObjdateDeDemande*/}
                        </Typography>
                        {/* Ajoutez d'autres informations de la demande ici selon votre modèle de données */}

                      </CardContent>

                      <div style={{ marginTop: '50px', marginRight: '40px' }} ><Alert severity="success">Accepté</Alert></div>

                    </Card>
                  </Grid>
                )
              ))) : <div style={{ padding: "100px", margin: "100px", marginLeft: "100px", textAlign: "center" }}><h3>Aucune demande acceptée n'a été trouvée</h3></div>
              }
            </TabPanel>
            <TabPanel value="refusees">
              {filtrerDemandes(demandesObjets).length ? (filtrerDemandes(demandesObjets).map((dmdObj, ind) => (
                dmdObj.etatAcceptation === "refusee" && (
                  <Grid item xs={12} key={dmdObj.id} >
                    <Card sx={{ display: 'flex', flexDirection: 'row' }} variant="outlined">
                      <CardMedia
                        component="img"
                        sx={{ width: 200, objectFit: 'contain' }}
                        image={(dmdObj.objet.image[0]) ? (dmdObj.objet.image[0].url) : null}
                        alt=""
                        style={{ width: "200px", height: "150px" }}
                      />
                      <CardContent style={{ marginLeft: "100px" }}>
                        {/*<Typography variant="h5" component="div">
              Demande d'Objet {dmdObj.id}
          </Typography>*/}
                        <Typography variant="body2" className="mb-3 mt-2">
                          <strong>Nom de l'Objet:</strong> {" " + dmdObj.objet.nom}
                        </Typography>
                        <Typography variant="body2" className="mb-3" >
                          {user?.user?.role != "association" ? <><strong>Association:</strong>
                            <Link to={`/associationProfil/${dmdObj.association.userIdA}`} style={{ color: 'rgba(54, 79, 112, 0.8)' }} title={`Profil de ${dmdObj.association.user?.nom}`}>
                              {"   "} <strong style={{ textDecoration: 'underline' }}>{dmdObj.association.user?.nom} </strong>
                            </Link></> : <><strong>donateur :</strong>{"   "}
                            <Link onClick={() => { setOpenModal(true), setDonateur(dmdObj.objet.donateur) }} style={{ color: 'rgba(54, 79, 112, 0.8)', textDecoration: 'underline' }}  >
                              {dmdObj.objet.donateur.user?.nom}
                            </Link></>}
                        </Typography>
                        <Typography variant="body2" className="mb-3">
                          <strong>Date de la demande:</strong>
                          {format(new Date(dmdObj.dateDeDemande), 'dd/MM/yyyy  à HH:mm')}
                          {/*dmdObjdateDeDemande*/}
                        </Typography>
                        {/* Ajoutez d'autres informations de la demande ici selon votre modèle de données */}

                      </CardContent>

                      <div style={{ marginTop: '50px', marginRight: '20px' }} ><Alert severity="error">Refusé</Alert> </div>

                    </Card>
                  </Grid>
                )
              ))) : <div style={{ padding: "100px", margin: "100px", marginLeft: "100px", textAlign: "center" }}><h3>Aucune demande refusée n'a été trouvée</h3></div>

              }
            </TabPanel>
            <TabPanel value="annulees">
              {filtrerDemandes(demandesObjets).length ? (filtrerDemandes(demandesObjets).map((dmdObj, ind) => (
                dmdObj.etatAcceptation === "annulee" && (
                  <Grid item xs={12} key={dmdObj.id} >
                    <Card sx={{ display: 'flex', flexDirection: 'row' }} variant="outlined">
                      <CardMedia
                        component="img"
                        sx={{ width: 200, objectFit: 'contain' }}
                        image={(dmdObj.objet.image[0]) ? (dmdObj.objet.image[0].url) : null}
                        alt=""
                        style={{ width: "200px", height: "150px" }}
                      />
                      <CardContent style={{ marginLeft: "100px" }}>
                        {/*<Typography variant="h5" component="div">
              Demande d'Objet {dmdObj.id}
          </Typography>*/}
                        <Typography variant="body2" className="mb-3 mt-2">
                          <strong>Nom de l'Objet:</strong> {" " + dmdObj.objet.nom}
                        </Typography>
                        <Typography variant="body2" className="mb-3" >
                          {user?.user?.role != "association" ? <><strong>Association:</strong>
                            <Link to={`/associationProfil/${dmdObj.association.userIdA}`} style={{ color: 'rgba(54, 79, 112, 0.8)' }} title={`Profil de ${dmdObj.association.user?.nom}`}>
                              {"   "} <strong style={{ textDecoration: 'underline' }}>{dmdObj.association.user?.nom} </strong>
                            </Link></> : <><strong>donateur :</strong>{"   "}
                            <Link onClick={() => { setOpenModal(true), setDonateur(dmdObj.objet.donateur) }} style={{ color: 'rgba(54, 79, 112, 0.8)', textDecoration: 'underline' }}  >
                              {dmdObj.objet.donateur.user.nom}
                            </Link></>}
                        </Typography>
                        <Typography variant="body2" className="mb-3">
                          <strong>Date de la demande:</strong>
                          {format(new Date(dmdObj.dateDeDemande), 'dd/MM/yyyy  à HH:mm')}
                          {/*dmdObjdateDeDemande*/}
                        </Typography>
                        {/* Ajoutez d'autres informations de la demande ici selon votre modèle de données */}

                      </CardContent>

                      <div style={{ marginTop: '50px', marginRight: '20px' }} ><Alert severity="error">Annulée</Alert> </div>

                    </Card>
                  </Grid>
                )
              ))) : <div style={{ padding: "100px", margin: "100px", marginLeft: "100px", textAlign: "center" }}><h3>Aucune demande annulée n'a été trouvée</h3></div>
              }
            </TabPanel>
          </Stack>
        ) : null
        }

      </Tabs>

      {/* modal pour le refus */}
      {/* <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog" >
          <DialogTitle>
         
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            Êtes-vous sûr de vouloir refuser cette demande ?
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="danger" onClick={() => { dispatch(updateRefusDemandeObjet(idDmd)).then(err => console.log(err)), setOpen(false) }}>
              Refuser
            </Button>
            <Button variant="outlined" color="neutral" onClick={() => setOpen(false)}>
              Annuler
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal> */}
      {/* modal pour l'acceptation et la planification du rendez-vous */}
      {/* <Modal
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
          <span style={{marginLeft:"85px"}} >Planifier un rendez-vous pour l'acquisition d'objet</span> 
            </DialogTitle>     
            </div>
            <Divider/>
           <div className='p-1 mt-1'>
           <label style={{marginBottom:"10px"}}><strong>Date du rendez-vous :</strong></label>
          <TextField
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
          <Button onClick={()=>ajouterDonation(idDmd)} sx={{ marginLeft: '30px' , backgroundColor:"rgba(134, 162, 114, 0.8)"}}>Envoyer</Button>
        </div>
                </Modal>*/}
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
            ajouterDonation(idDmd);
          }}
        >
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '40px' }} id="modal-container">
            <div className='mb-3'>
              <DialogTitle>
                <span style={{ marginLeft: "85px" }}>Planifier un rendez-vous pour l'acquisition d'objet</span>
              </DialogTitle>
            </div>
            <Divider />
            <div className='p-1 mt-1'>
              <label style={{ marginBottom: "10px" }}><strong>Date du rendez-vous :</strong></label>
              <TextField
                label=""
                type="date"
                value={dateRendez}
                onChange={(e) => { setDateRendez(e.target.value) }}
                fullWidth
                sx={{ marginBottom: '30px' }}
                name='date'
                required // Ajout de l'attribut required
              />
              <label style={{ marginBottom: "10px" }}><strong>Heure du rendez-vous :</strong></label>
              <TextField
                label=""
                type="time"
                value={heureRendez}
                onChange={(e) => setHeureRendez(e.target.value)}
                fullWidth
                sx={{ marginBottom: '20px' }}
                name='heureRendezVous'
                required // Ajout de l'attribut required
              />
            </div>
            <Button type="button" onClick={handleCloseModal} sx={{ marginLeft: '200px', backgroundColor: "rgba(190, 55, 44, 0.8)" }}>Annuler</Button>
            <Button type="submit" sx={{ marginLeft: '30px', backgroundColor: "rgba(134, 162, 114, 0.8)" }}>Envoyer</Button>
          </div>
        </form>
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
          <Typography level="h4" mb={0} style={{ color:"rgba(82, 131, 144, 1)" }}>
            Informations du Donateur :
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
              variant="outlined"
              color="neutral"
              style={{ marginLeft: "400px" ,backgroundColor:"rgba(82, 131, 144, 1)" }}
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
