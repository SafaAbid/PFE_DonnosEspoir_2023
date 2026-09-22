import React, { useState } from 'react'
import { Typography, Container, Grid, Card, CardContent, Pagination, Icon, Stack, Divider, Modal, Dialog, DialogContentText, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import CallIcon from '@mui/icons-material/Call';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { updateDispo } from '../../features/objetSlice';
import { Alert, Button, ModalDialog, Tab, TabList, TabPanel, Tabs } from '@mui/joy';
import { affecterUnBenevoleRendezVous, findRendezVousByID, updateBenevoleRendezVous, updateRealise, updateRendezVous } from '../../features/rendezVousSlice';
import Swal from 'sweetalert2';
import { createBenevole, findBenevoleByEmail, findBenevoleByNum, getBenevolesDisponibleByDateAndByAssociation } from '../../features/benevoleSlice';
import { Col, Form, Row } from 'react-bootstrap';
import { Edit, WarningAmber, WarningAmberOutlined, WarningRounded } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
const Contenu = () => {
  const { id } = useParams();
  const [openNonRealise, setOpenNonRealise] = useState(false)
  const [openRealise, setOpenRealise] = useState(false)
  const [openModalModif, setOpenModalModif] = useState(false)
  const [idRendezVous, setIdRendezVous] = useState()
  const [dateRendez, setDateRendez] = useState("")
  const [heureRendez, setHeureRendez] = useState("")
  const [idObj, setIdObj] = useState()
  const [idRendez, setIdRendez] = useState()
  const [filtre, setFiltre] = useState("enCours"); // pour le filtre sélectionné
  const [nomObjetFilter, setNomObjetFilter] = useState(""); // Pour le nom d'objet saisi
  const [openAlert, setOpenAlert] = useState(false);
  const [benvoleAjout, setBenevoleAjout] = useState({ idAssociation: Number(id) });
  const [openAjoutBenevole, setOpenAjoutBenevole] = useState(false)
  const filtrerRendezVous = (lesRendezVous) => {
    return lesRendezVous.filter((rendezVous) => {
      if (filtre === "realise") {
        return rendezVous.etatRealisation === "realise";
      } else if (filtre === "nonRealise") {
        return rendezVous.etatRealisation === "nonRealise";
      } else if (filtre === "enCours") {
        return rendezVous.etatRealisation == "enCours"
      }
    })
      .filter((rendezVous) => {
        // Filtrer en fonction du nom d'objet saisi
        return rendezVous.donation?.demandeObjet.objet.nom.toLowerCase().includes(nomObjetFilter.toLowerCase());
      });
  };
  const { desRendezVous } = useSelector((state) => state.storeRendezVous);
  const { benevoles, isLoading, error } = useSelector((state) => state.storeBenevoles);

  const { user } = useSelector((state) => state.auth);
  const handleNomObjetInputChange = (e) => {
    setNomObjetFilter(e.target.value);
  };
  const dateSysteme = new Date()
  console.log("date:", dateSysteme.toISOString())
  const dispatch = useDispatch();
  //rendre l'objet dispo
  const rendreDispo = (id) => {
    dispatch(updateDispo(id)).then(err => console.log(err))
    setOpenNonRealise(false)
  }
  //realiser un rendezVous
  const realiserRendez = (id) => {
    dispatch(updateRealise(id)).then(err => err.message)
    setOpenRealise(false)
  }
  const handlechangeAjout = (e) => {
    setBenevoleAjout({ ...benvoleAjout, [e.target.name]: e.target.value })
  }
  const handleSubmitAjout = async (e) => {
    e.preventDefault();
    console.log("ajout", benvoleAjout)
    const obj = {
      email: benvoleAjout.email,
      idAsso: Number(id)
    }
    const objet = {
      numTelephone: benvoleAjout.numTelephone,
      idAsso: Number(id)
    }
    dispatch(findBenevoleByEmail(obj)).then(res => {
      console.log("res.payload" + res.payload)
      if (!res.payload) {
        dispatch(findBenevoleByNum(objet)).then(res => {
          console.log("res.payload" + res.payload)
          if (!res.payload) {
            dispatch(createBenevole(benvoleAjout)).then(res => res.error ? console.log({ "err": res.error }) : console.log({ "data": res }))
            setOpenAjoutBenevole(false);
            setBenevoleAjout({})
          } else {
            Swal.fire(
              {
                icon: "error",
                text: "Le numéro du téléphone que vous essayez d'ajouter existe déjà",
                customClass: {
                  popup: 'z-index: 99999999;',
                },

              })
          }
        })
      } else {
        Swal.fire(
          {
            icon: "error",
            text: "Le bénévole que vous essayez d'ajouter existe déjà. Veuillez vérifier l'e-mail que vous avez saisi"
            , customClass: {
              popup: 'z-index: 2000000;',
            },
          })
      }
    })
  }
  const affecter = async (date, idRendez) => {
    const objet = {
      id: user.user.id,
      dateDonnee: new Date(date).toISOString().split('T')[0] + " " + new Date(date).toISOString().split('T')[1]
    }

    const inputOptions = {};
    dispatch(getBenevolesDisponibleByDateAndByAssociation(objet)).then(async (err) => {
      console.log(err);
      if (!err.error) {
        err.payload.length != 0 && err.payload.map((benevole) => {
          inputOptions[benevole.id] = `${benevole.nom} ${benevole.prenom} : ${benevole.adresse} `;
        });
        inputOptions["ajout"] = "Ajouter un bénévole";
        const { value: personne } = await Swal.fire({
          title: "Selectionner un bénévole",
          text: `cette liste contient seulement les bénévoles disponibles dans cette date : ${format(new Date(date), 'dd/MM/yyyy à HH:mm ')} `,
          input: "select",
          inputOptions: inputOptions,
          inputPlaceholder: "Sélectionner un bénévole",
          showCancelButton: true,
          cancelButtonText: 'Annuler',
          inputAttributes: {
            onchange: "handleSelectChange(event)" // Ajout d'un événement de changement
          },
          didOpen: () => {
            document.querySelector('.swal2-select').addEventListener('change', handleSelectChange); // Ajout de l'écouteur d'événement sur le select
          },
          willClose: async (dismiss) => {
            if (dismiss.dismiss === "Annuler") {
              return;
            }
            else if (dismiss.dismiss === "ok" && (!personne)) {
              //  return Swal.fire({text:`La sélection n'a pas abouti à l'affectation d'un bénévole.`});
            }
          },
        });
        if (personne) {
          if (personne === "ajout") {
            setOpenAjoutBenevole(true);
          }
          else {
            const objet = {
              id: idRendez,
              idBenevole: Number(personne)
            }
            dispatch(affecterUnBenevoleRendezVous(objet)).then(err => console.log(err));
            Swal.fire({
              icon: "success",
              text: `le bénévole a été selectionné avec succés`
            });
          }
        } else {
          //Swal.fire({text:`La sélection n'a pas abouti à l'affectation d'un bénévole.`});
        }
      }
    })
    function handleSelectChange(event) {
      if (event.target.value === "ajout") {
        setOpenAjoutBenevole(true);
      }
    }
  }
  const modifierBenevole = async (date, idRendez) => {
    const objet = {
      id: user.user.id,
      dateDonnee: new Date(date).toISOString().split('T')[0] + " " + new Date(date).toISOString().split('T')[1]
    }

    const inputOptions = {};
    dispatch(getBenevolesDisponibleByDateAndByAssociation(objet)).then(async (err) => {
      console.log(err)
      console.log(date);
      if (!err.error) {
        err.payload.length != 0 && err.payload.map((benevole) => {
          inputOptions[benevole.id] = `${benevole.nom} ${benevole.prenom} : ${benevole.adresse} `;
        });
        inputOptions["ajout"] = "Ajouter un bénévole";
        const { value: personne } = await Swal.fire({
          title: "Selectionner un bénévole",
          text: `cette liste contient seulement les bénévoles disponibles dans cette date : ${format(new Date(date), 'dd/MM/yyyy à HH:mm ')} `,
          input: "select",
          inputOptions: inputOptions,
          inputPlaceholder: "Sélectionner un bénévole",
          showCancelButton: true,
          cancelButtonText: 'Annuler',
          inputAttributes: {
            onchange: "handleSelectChange(event)" // Ajout d'un événement de changement
          },
          didOpen: () => {
            document.querySelector('.swal2-select').addEventListener('change', handleSelectChange); // Ajout de l'écouteur d'événement sur le select
          },
          willClose: async (dismiss) => {
            if (dismiss.dismiss === "Annuler") {
              return;
            }
            else if (dismiss.dismiss === "ok" && !personne) {
              // return Swal.fire({text:`La sélection n'a pas abouti à l'affectation d'un bénévole.`});
            }
          },
        });
        if (personne) {
          if (personne === "ajout") {
            //setBenevoleAjout({ idAssociation: Number(id) });
            setOpenAjoutBenevole(true);
          }
          else {
            const objet = {
              id: idRendez,
              idBenevole: Number(personne)
            }
            dispatch(updateBenevoleRendezVous(objet)).then(err => console.log(err));
            Swal.fire({
              icon: "success",
              text: `le bénévole a été modifié avec succés`
            });
          }
        }
        else {
          //Swal.fire({text:`La sélection n'a pas abouti à l'affectation d'un bénévole.`});
        }
      }
    })
    function handleSelectChange(event) {
      if (event.target.value === "ajout") {
        setOpenAjoutBenevole(true);
      }
    }
  }
  const modifierRendez = (idRendez) => {
    const heureParts = heureRendez.split(':');
    const heure = parseInt(heureParts[0], 10);
    const minute = parseInt(heureParts[1], 10);
    // Crée une nouvelle date avec la date actuelle et l'heure spécifiée
    const dateTime = new Date(dateRendez);
    dateTime.setHours(heure);
    dateTime.setMinutes(minute);
    console.log(dateTime.toISOString())
    // Vérification de la date
    const dateSysteme = new Date();
    if (dateTime < dateSysteme) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'La date du rendez-vous ne peut pas être antérieure à la date actuelle.',
        confirmButtonText: "d'accord",
        keydownListenerCapture: true,
        position: 'top',
        toast: true,
        customClass: {
          popup: 'z-index: 100000;', // Classe CSS pour personnaliser le style du popup
        },
      });
      return;
    }

    // Vérification de l'heure
    //const selectedHour = parseInt(heureRendez.split(':')[0]);
    if (heure < 9 || heure >= 18) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "L'heure du rendez-vous doit être comprise entre 9h et 18h.",
        confirmButtonText: "d'accord",
        toast: true,
        customClass: {
          popup: 'z-index: 100000;', // Classe CSS pour personnaliser le style du popup
        },
        position: 'top-end',

      });
      return;
    }
    dispatch(findRendezVousByID(idRendez)).then(res => {
      if (!res.error) {
        const dateTest = new Date(new Date(res.payload.date).setHours(new Date(res.payload.date).getHours() - 1))
        console.log(dateTime.getTime());
        console.log(dateTest.getTime());
        console.log(dateTest.getTime() == dateTime.getTime())
        if (dateTest.getTime() == dateTime.getTime()) {
          Swal.fire({
            icon: 'warning',
            text: "La date n'a pas été modifiée",
            confirmButtonText: "d'accord",
            toast: false,
            customClass: {
              popup: 'z-index: 100000;', // Classe CSS pour personnaliser le style du popup
            },
            position: 'center',

          });
        } else {
          dispatch(updateRendezVous(rendez)).then(err => console.log(err))
          setOpenModalModif(false)
        }
      }
    })
    //if()else{ }
    const rendez = {
      id: idRendez,
      date: dateTime
    }
    // navigate(`/listeDesDemandes/${user.user.id}`)
    /*const dateTime = moment(`${dateRendez}T${heureRendez}`);
        console.log("id", id, "date", dateTime);*/
  }
  return (
    <div >
      {console.log("lesRendezVous", desRendezVous)}
      <Tabs
        variant="outlined"
        orientation="{direction.startsWith('row') ? 'vertical' : 'horizontal'}"
        aria-label="Basic tabs"
        value={filtre}
        onChange={(event, newValue) => setFiltre(newValue)}
        sx={{
          width: "74vw",
          marginLeft: "30px",
          marginRight: "10px",
          flexDirection: "direction",
          minHeight: '600px'
        }}
      >
        <TabList underlinePlacement="bottom">
          <Tab indicatorPlacement="bottom" value={"enCours"} variant='outlined'
            color='neutral'>
            En Cours
          </Tab>
          <Tab indicatorPlacement="bottom" value={"realise"} variant='outlined'
            color='neutral'>
            Realisés
          </Tab>
          <Tab indicatorPlacement="bottom" value={"nonRealise"} variant='outlined'
            color='neutral'>
            Non Réalisés
          </Tab>

        </TabList>

        <>
          <div style={{ marginTop: "20px", marginLeft: "10px", fontStyle: 'initial' }}> <Typography variant="h4" gutterBottom>
            Les Rendez-vous :
          </Typography></div>
          <div style={{ marginTop: "2px", marginLeft: "230px" }}>
            <Form.Group as={Row} className="mb-1" controlId="formHorizontalEmail">
              <Form.Label column sm={2}>
                Chercher
              </Form.Label>
              <Col sm={10}>
                <Form.Control type="text" placeholder="Nom Objet" onChange={handleNomObjetInputChange} style={{ width: '200px' }} />
              </Col>
            </Form.Group>
          </div></>
        {desRendezVous ?
          (<Stack spacing={2}>
            <TabPanel value="enCours">
              {
                console.log("en cours :", filtrerRendezVous(desRendezVous).length)}
              <Grid container spacing={3}>
                {filtrerRendezVous(desRendezVous).length ? (filtrerRendezVous(desRendezVous).map((rendezVous, ind) => (
                  rendezVous.etatRealisation === "enCours" && (
                    <Grid item xs={12} md={6} lg={4} >
                      <Card class="shadow  bg-body-tertiary rounded">
                        <CardContent sx={{ '& > *': { marginBottom: '6px' } }}>
                          <Typography variant="h6" gutterBottom style={{ textAlign: "center", backgroundColor: "rgba(82, 131, 144, 0.33)" }}>
                            <EventAvailableIcon /><strong> Rendez-vous le {format(new Date(rendezVous.date), 'dd/MM/yyyy')} </strong>
                            {((user && user.user && user.user.role !== "association") || (user && user.donateur && user.donateur.user.role !== "association")) &&
                              <IconButton aria-label="Modifier" className="mb=2"
                                onClick={() => { setOpenModalModif(true), setIdRendezVous(rendezVous.id), setDateRendez((rendezVous.date).split('T')[0]), setHeureRendez(((rendezVous.date).split('T')[1]).split(':')[0] + ':' + ((rendezVous.date).split('T')[1]).split(':')[1]) }}
                              >
                                <Edit />
                              </IconButton>}
                          </Typography>
                          <Divider style={{ margin: "20px" }} />
                          <Stack spacing={1}>
                            <Typography variant="body1" gutterBottom>
                              <AccessTimeIcon fontSize="small" />  <strong> Horaire : </strong> {rendezVous.date.split('T')[1].split('.')[0].substring(0, 5)}
                            </Typography>
                            {((user && user.user?.role == "donateur") || (user && user.donateur && user.donateur?.user.role === "entreprise")) &&
                              (<> <Typography variant="body2" gutterBottom>
                                <Diversity1Icon fontSize="small" />   <strong> Association : </strong>    {rendezVous.donation.demandeObjet.association.user?.nom}
                              </Typography>
                                <Typography variant="body2" gutterBottom>
                                  <CallIcon fontSize="small" />  <strong> Contact : </strong>   {rendezVous.donation.demandeObjet.association.numTelephone}
                                </Typography></>)}
                            {user && !user.donateur && user.user.role == "association" &&
                              (<>  <Typography variant="body2" gutterBottom>
                                <HowToRegIcon fontSize="small" /> <strong> donateur :  </strong>{user && rendezVous.donation.demandeObjet.objet.donateur.user?.nom}
                              </Typography>
                                <Typography variant="body2" gutterBottom>
                                  <CallIcon fontSize="small" />  <strong> Contact : </strong> {rendezVous.donation.demandeObjet.objet.donateur.numTelephone}
                                </Typography></>)}
                            <Typography variant="body2" gutterBottom>
                              <VolunteerActivismIcon fontSize="small" />  <strong> Objet : </strong> {rendezVous.donation.demandeObjet.objet.nom}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <VolunteerActivismIcon fontSize="small" />  <strong> Bénévole : </strong>
                              {
                                rendezVous.benevolee ? (
                                  <>
                                    {rendezVous.benevolee?.nom} {rendezVous.benevolee?.prenom} { }
                                    {user && !user.donateur && user.user.role === "association" && (
                                      <a onClick={() => { modifierBenevole(rendezVous.date, rendezVous.id) }} style={{ color: 'blue', textDecoration: 'underline' }} >modifier</a>
                                    )}
                                  </>
                                ) : (
                                  user && !user.donateur && user.user.role === "association" ? (
                                    <a onClick={(e) => affecter(rendezVous.date, rendezVous.id)} style={{ color: 'blue', textDecoration: 'underline' }}>Affecter un bénévole</a>
                                  ) : (
                                    "aucun bénévole affecté"
                                  )
                                )
                              }
                            </Typography>
                          </Stack>
                          <div style={{ paddingTop: "8px" }}>
                            <Button variant="outlined" color="success" style={{ marginLeft: '18px' }} onClick={() => { rendezVous.benevolee ? (setIdRendez(rendezVous.id), setOpenRealise(true)) : setOpenAlert(true) }} disabled={((new Date(rendezVous.date).getTime()) > (new Date().getTime()))}>
                              Realisé
                            </Button>
                            <Button variant="outlined" color="danger" style={{ marginLeft: '15px' }} onClick={() => { setIdObj(Number(rendezVous.donation.demandeObjet.objet.id)), setOpenNonRealise(true) }} disabled={(new Date(rendezVous.date).getTime()) > (new Date().getTime())}>
                              Non réalisé
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                ))) : <div style={{ padding: "100px", margin: "100px", marginLeft: "100px", textAlign: "center" }}><h3>Aucun rendez-vous en cours n'a été trouvé.</h3></div>
                }    </Grid>

            </TabPanel>
            <TabPanel value="nonRealise">
              <Grid container spacing={3}>
                {filtrerRendezVous(desRendezVous).length ? (filtrerRendezVous(desRendezVous).map((rendezVous, ind) => (
                  rendezVous.etatRealisation == "nonRealise" && (
                    <Grid item xs={12} md={6} lg={4} >
                      <Card class="shadow  bg-body-tertiary rounded">
                        <CardContent sx={{ '& > *': { marginBottom: '0px' } }}>
                          <Typography variant="h6" gutterBottom style={{ textAlign: "center", backgroundColor: "rgba(82, 131, 144, 0.33)" }}>
                            <EventAvailableIcon /><strong> Rendez-vous le {format(new Date(rendezVous.date), 'dd/MM/yyyy')} </strong>
                          </Typography>
                          <Divider style={{ margin: "20px" }} />
                          <Stack spacing={1}>
                            <Typography variant="body1" gutterBottom>
                              <AccessTimeIcon fontSize="small" />  <strong> Horaire : </strong> {rendezVous.date.split('T')[1].split('.')[0].substring(0, 5)}
                            </Typography>
                            {((user && !user.donateur && user.user.role == "donateur") || (user && user.donateur && user.donateur?.user.role === "entreprise")) &&
                              (<> <Typography variant="body2" gutterBottom>
                                <Diversity1Icon fontSize="small" />   <strong> Association : </strong>    {rendezVous.donation.demandeObjet.association.user?.nom}
                              </Typography>
                                <Typography variant="body2" gutterBottom>
                                  <CallIcon fontSize="small" />  <strong> Contact : </strong>   {rendezVous.donation.demandeObjet.association.numTelephone}
                                </Typography></>)}
                            {user && !user.donateur && user.user.role == "association" &&
                              (<>  <Typography variant="body2" gutterBottom>
                                <HowToRegIcon fontSize="small" />  <strong> donateur :  </strong>{user && rendezVous.donation.demandeObjet.objet.donateur.user?.nom}
                              </Typography>
                                <Typography variant="body2" gutterBottom>
                                  <CallIcon fontSize="small" />  <strong> Contact : </strong> {rendezVous.donation.demandeObjet.objet.donateur.numTelephone}
                                </Typography></>)}
                            <Typography variant="body2" gutterBottom>
                              <VolunteerActivismIcon fontSize="small" />  <strong> Objet : </strong> {rendezVous.donation.demandeObjet.objet.nom}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <VolunteerActivismIcon fontSize="small" />  <strong> Bénévole : </strong> {rendezVous.benevolee ? rendezVous.benevolee.nom + "  " + rendezVous.benevolee.prenom : "aucun bénévole affecté"}
                            </Typography>
                          </Stack>
                        </CardContent>

                      </Card>
                    </Grid>

                  )
                ))) : <div style={{ padding: "100px", margin: "100px", marginLeft: "100px", textAlign: "center" }}><h3>Aucun rendez-vous non réalisé n'a été trouvé.</h3></div>

                }   </Grid>

            </TabPanel>
            <TabPanel value="realise">
              <Grid container spacing={3}>
                {filtrerRendezVous(desRendezVous).length ? (filtrerRendezVous(desRendezVous).map((rendezVous, ind) => (
                  rendezVous.etatRealisation == "realise" && (
                    <Grid item xs={12} md={6} lg={4}>
                      <Card class="shadow  bg-body-tertiary rounded">
                        <CardContent sx={{ '& > *': { marginBottom: '0px' } }}>
                          <Typography variant="h6" gutterBottom style={{ textAlign: "center", backgroundColor: "rgba(82, 131, 144, 0.33)" }}>
                            <EventAvailableIcon /><strong> Rendez-vous le {format(new Date(rendezVous.date), 'dd/MM/yyyy')} </strong>
                          </Typography>
                          <Divider style={{ margin: "20px" }} />
                          <Stack spacing={1}>
                            <Typography variant="body1" gutterBottom>
                              <AccessTimeIcon fontSize="small" />  <strong> Horaire : </strong> {rendezVous.date.split('T')[1].split('.')[0].substring(0, 5)}
                            </Typography>
                            {((user && !user.donateur && user.user.role == "donateur") || (user && user.donateur && user.donateur?.user.role === "entreprise")) &&
                              (<> <Typography variant="body2" gutterBottom>
                                <Diversity1Icon fontSize="small" />   <strong> Association : </strong>    {rendezVous.donation.demandeObjet.association.user?.nom}
                              </Typography>
                                <Typography variant="body2" gutterBottom>
                                  <CallIcon fontSize="small" />  <strong> Contact : </strong>   {rendezVous.donation.demandeObjet.association.numTelephone}
                                </Typography></>)}
                            {user && !user.donateur && user.user.role == "association" &&
                              (<>  <Typography variant="body2" gutterBottom>
                                <HowToRegIcon fontSize="small" />  <strong> donateur :  </strong>{rendezVous.donation.demandeObjet.objet.donateur.user?.nom}
                              </Typography>
                                <Typography variant="body2" gutterBottom>
                                  <CallIcon fontSize="small" />  <strong> Contact : </strong> {rendezVous.donation.demandeObjet.objet.donateur.numTelephone}
                                </Typography></>
                              )}
                            <Typography variant="body2" gutterBottom>
                              <VolunteerActivismIcon fontSize="small" />  <strong> Objet : </strong> {rendezVous.donation.demandeObjet.objet.nom}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <VolunteerActivismIcon fontSize="small" />  <strong> Bénévole : </strong> {rendezVous.benevolee ? rendezVous.benevolee.nom + "  " + rendezVous.benevolee.prenom : "aucun bénévole affecté"}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                ))) : <div style={{ padding: "100px", margin: "100px", marginLeft: "100px", textAlign: "center" }}><h3>Aucun rendez-vous réalisé n'a été trouvé.</h3></div>
                }
              </Grid>
            </TabPanel>
          </Stack>
          ) : null}
      </Tabs>
      {/*dialog non realiser */}
      <Dialog open={openNonRealise} onClose={() => setOpenNonRealise(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth={"sm"}>

        <DialogTitle variant='h6' >
          <WarningAmber style={{ marginRight: '10px' }} />
          Attention</DialogTitle>
        <Divider ></Divider>
        <DialogContent>
          <DialogContentText >
            <Typography variant='h7' style={{ color: "black" }}>
              Êtes-vous sûr de vouloir marquer ce rendez-vous comme non réalisé ?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <Divider ></Divider>
        <DialogActions>
          <Button onClick={() => setOpenNonRealise(false)} color="danger" variant="outlined" size="md">
            Non
          </Button>
          <Button onClick={() => { rendreDispo(idObj) }} variant="outlined" color="success" size="md"  >
            Oui
          </Button>
        </DialogActions>
      </Dialog>
      {/*dialog pour realiser */}
      <Dialog open={openRealise} onClose={() => setOpenRealise(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth={"sm"}>
        <DialogTitle variant="h6"><WarningAmberOutlined /> Confirmation</DialogTitle>
        <Divider ></Divider>
        <DialogContent>
          <DialogContentText >
            <Typography variant='h7' style={{ color: "black" }}>  Êtes-vous sûr de vouloir marquer ce rendez-vous comme réalisé ?</Typography>
          </DialogContentText>
        </DialogContent>
        <Divider ></Divider>
        <DialogActions>

          <Button onClick={() => setOpenRealise(false)} color="danger" variant="outlined" size="md">
            Non
          </Button>
          <Button onClick={() => realiserRendez(idRendez)} variant="outlined" color="success" size="md"  >
            Oui
          </Button>
        </DialogActions>
      </Dialog>
      {/**modal pour la modification du rendez-vous*/}
      {/* {<Modal
        open={openModalModif}
        onClose={()=>setOpenModalModif(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        size="sm"
      >
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px' }}    id="modal-container">
       <div className='mb-3'>
        <DialogTitle >
          <span style={{marginLeft:"85px"}} >Saisir une nouvelle date du rendez-vous</span> 
            </DialogTitle>     
            </div>
           <div className='p-1 mt-1'>
           <label style={{marginBottom:"10px"}}><strong>Date du rendez-vous :</strong></label>
          <TextField
            label=""
            type="date"
            value={dateRendez}
            onChange={(e) => {setDateRendez((e.target.value))}}
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
          <Button onClick={()=>setOpenModalModif(false)} sx={{ marginLeft: '200px',backgroundColor:"rgba(190, 55, 44, 0.8)" }}>Annuler</Button>
          <Button onClick={()=>modifierRendez(idRendezVous)} sx={{ marginLeft: '30px', backgroundColor:"rgba(134, 162, 114, 0.8)"}}>Envoyer</Button>
        </div>
      </Modal>} */}
      <Modal
        open={openModalModif}
        onClose={() => setOpenModalModif(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        size="sm"
        style={{ zIndex: '1050' }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Empêche la soumission par défaut du formulaire
            modifierRendez(idRendezVous);
          }}
        >
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px' }} id="modal-container">
            <div className='mb-3'>
              <DialogTitle>
                <span style={{ marginLeft: "85px" }}>Saisir une nouvelle date du rendez-vous</span>
              </DialogTitle>
              <Divider></Divider>
            </div>
            <div className='p-1 mt-1'>
              <label style={{ marginBottom: "10px" }}><strong>Date du rendez-vous :</strong></label>
              <TextField
                required
                label=""
                type="date"
                value={dateRendez}
                onChange={(e) => { setDateRendez((e.target.value)) }}
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
            <Button color='neutral' type="button" onClick={() => setOpenModalModif(false)} sx={{ marginLeft: '200px', color: 'white' }}>Annuler</Button>
            <Button type="submit" sx={{ marginLeft: '30px', backgroundColor: "rgba(134, 162, 114, 0.8)", color: 'white' }}>Envoyer</Button>
          </div>
        </form>
      </Modal>
      {/*dialog alert */}
      <Dialog open={openAlert} onClose={() => setOpenAlert(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth={"sm"}>
        <DialogTitle variant="danger">
          <Typography variant='h6'>
            <WarningAmber style={{ marginRight: '10px' }} />

            Attention
          </Typography>

        </DialogTitle>
        <Divider ></Divider>
        <DialogContent>
          <DialogContentText style={{ fontFamily: "inherit" }} >
            <Typography variant='h7' style={{ color: "black" }}>
              {((user && user.user?.role == "donateur") || (user && user.donateur)) && "Impossible de réaliser ce rendez-vous pour le moment. L’association n’a pas encore affecté un bénévole pour cette mission"}        </Typography>
            {(user && user.user?.role == "association") && "Veuillez affecter un bénévole à ce rendez-vous pour que vous puissiez réaliser ce rendez-vous"}
          </DialogContentText>
        </DialogContent>
        <Divider ></Divider>
        <DialogActions>

          <Button onClick={() => setOpenAlert(false)} style={{ backgroundColor: "rgba(72, 151, 90, 0.68)", borderColor: "rgba(72, 151, 90, 0.68)" }} size="md"  >
            D'accord
          </Button>
        </DialogActions>
      </Dialog>
      <Modal open={openAjoutBenevole} onClose={() => setOpenAjoutBenevole(false)} style={{ zIndex: '1060' }} centered>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle style={{ marginBottom: "-20px", marginTop: "-10px" }}>
            <Typography variant='h5'>
              Ajout d'un bénévole
            </Typography>
          </DialogTitle>
          <Divider style={{ marginBottom: "-20px" }} />
          <Form onSubmit={handleSubmitAjout}>
            <DialogContent>
              <Container>
                <Row>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Email :</Form.Label>
                    <Form.Control
                      required
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={benvoleAjout.email}
                      onChange={(e) => handlechangeAjout(e)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Nom :</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Nom"
                      name="nom"
                      value={benvoleAjout.nom}
                      onChange={(e) => handlechangeAjout(e)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Prénom :</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Prénom"
                      name="prenom"
                      value={benvoleAjout.prenom}
                      onChange={(e) => handlechangeAjout(e)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Numéro du téléphone :</Form.Label>
                    <Form.Control
                      required
                      min="10000000"
                      max="99999999"
                      type="number"
                      placeholder="numTelephone"
                      name="numTelephone"
                      value={benvoleAjout.numTelephone}
                      onChange={(e) => handlechangeAjout(e)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Adresse :</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Adresse"
                      name="adresse"
                      value={benvoleAjout.adresse}
                      onChange={(e) => handlechangeAjout(e)}
                    />
                  </Form.Group>
                </Row>
              </Container>
            </DialogContent>
            <Divider style={{ marginBottom: "5px" }} />
            <DialogActions style={{ marginBottom: "-15px" }}>
              <Button style={{ backgroundColor: "rgba(82, 131, 144)", borderColor: "rgba(82, 131, 144, 0.33)", color: 'white' }} onClick={() => setOpenAjoutBenevole(false)}>Annuler</Button>
              <Button style={{ backgroundColor: "rgba(82, 131, 144)", borderColor: "rgba(82, 131, 144, 0.33)", color: 'white' }} type="submit">Enregistrer</Button>
            </DialogActions>
          </Form>
        </ModalDialog>
      </Modal>
    </div>
  )
}

export default Contenu
