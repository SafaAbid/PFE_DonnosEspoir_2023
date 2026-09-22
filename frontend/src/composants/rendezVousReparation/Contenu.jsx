import React, { useState } from 'react'
import { Typography, Container, Grid, Card, CardContent, Button, Pagination, Icon, Stack, Divider, Modal, Dialog, InputLabel, FormControl, Input, RadioGroup, FormControlLabel, Radio, IconButton, TextField, DialogContentText } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import CallIcon from '@mui/icons-material/Call';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { updateDispo } from '../../features/objetSlice';
import { Alert, DialogActions, DialogContent, DialogTitle, ModalDialog, Tab, TabList, TabPanel, Tabs } from '@mui/joy';
import { findRendezVousByID, updateBenevoleRendezVous, updateNonRealise, updateRealise, updateRendezVous } from '../../features/rendezVousSlice';
import Swal from 'sweetalert2';
import { createBenevole, findBenevoleByEmail, findBenevoleByNum, getBenevolesDisponibleByDateAndByAssociation } from '../../features/benevoleSlice';
import { useParams } from 'react-router-dom';
import { Col, Form, Row } from 'react-bootstrap';
import { updateDateRemiseReparation, updateEnCoursReparation, updateNonValideReparation } from '../../features/reparationSlice';
import { Edit, Send, WarningAmber, WarningAmberOutlined, WarningRounded } from '@mui/icons-material';
const Contenu = () => {
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();
  const [openNonRealise, setOpenNonRealise] = useState(false)
  const [openRealise, setOpenRealise] = useState(false)
  const [openModalModif, setOpenModalModif] = useState(false)
  const [idRendezVous, setIdRendezVous] = useState()
  const [openAjoutBenevole, setOpenAjoutBenevole] = useState(false)
  const [benvoleAjout, setBenevoleAjout] = useState({ idAssociation: Number(id) });
  const [idObj, setIdObj] = useState()
  const [idRendez, setIdRendez] = useState()
  const [nomObjetFilter, setNomObjetFilter] = useState(""); // Pour le nom d'objet saisi
  const [filtre, setFiltre] = useState("debut"); // pour le filtre sélectionné
  const [filtreSelect, setFiltreSelect] = useState("enCours");
  const [dateRendez, setDateRendez] = useState("")
  const [heureRendez, setHeureRendez] = useState("")
  const [openAlert, setOpenAlert] = useState(false);
  const [openModif, setOpenModif] = useState(false);
  const filtrerRendezVous = (lesRendezVous) => {
    return lesRendezVous.filter((rendezVous) => {
      if (filtre == "fin") {
        return rendezVous.reparationFin && rendezVous.reparationFin[0];
      } else if (filtre == "debut") {
        return rendezVous.reparationDebut && rendezVous.reparationDebut[0];
      }
      /*else if (filtre == "nonRéalisé") { // ni7i hadhom w nzid condition fil return mte3 filtre condition 3al select ili bech itzidha ya safsoufa sem7a mizyana 3sall
        return rendezVous.etatRealisation === "nonRealise"
      } else {
        return rendezVous.etatRealisation === "realise"
      }*/
    })
      .filter((rendezVous) => {
        // Filtrer en fonction du nom d'objet saisi
        return rendezVous.reparationDebut && rendezVous.reparationDebut[0]?.demandeReparation?.donation?.demandeObjet.objet.nom.toLowerCase().includes(nomObjetFilter.toLowerCase()) || rendezVous.reparationFin && rendezVous.reparationFin[0]?.demandeReparation?.donation?.demandeObjet.objet.nom.toLowerCase().includes(nomObjetFilter.toLowerCase());
      });
  };
  const { desRendezVous } = useSelector((state) => state.storeRendezVous);
  const { benevoles, isLoading, error } = useSelector((state) => state.storeBenevoles);
  const handleNomObjetInputChange = (e) => {
    setNomObjetFilter(e.target.value);
  };
  const dateSysteme = new Date()
  console.log("date:", dateSysteme.toISOString())
  const dispatch = useDispatch();
  //rendre l'objet dispo
  /*const rendreDispo=(id)=>{
  dispatch(updateDispo(id)).then(err=>err.message)
  setOpenNonRealise(false)
  }*/
  //realiser un rendezVous
  const realiserRendez = (id) => {
    dispatch(updateRealise(id)).then(err => console.log(err.message))
    setOpenRealise(false)
  }
  const affecter = async (date, id) => {
    const objet = {
      id: user.user.id,
      dateDonnee: new Date(date).toISOString().split('T')[0] + " " + new Date(date).toISOString().split('T')[1]
    }
    console.log("idddd", id)
    dispatch(getBenevolesDisponibleByDateAndByAssociation(objet)).then(async (err) => {
      console.log("pp", err)

      const inputOptions = {};
      if (!err.error) {
        err.payload.length != 0 && err.payload.map((benevole) => {
          inputOptions[benevole.id] = `${benevole.nom} ${benevole.prenom} : ${benevole.adresse} `;
        });
        inputOptions["ajout"] = "Ajouter un bénévole";
        const { value: personne } = await Swal.fire({
          title: "Selectionner un bénévole",
          text: `cette liste contient seulement vos bénévoles disponibles dans cette date : ${format(new Date(date), 'dd/MM/yyyy à HH:mm ')} `,
          input: "select",
          inputOptions: inputOptions,
          inputPlaceholder: "Sélectionner un bénévole",
          showCancelButton: true,
          cancelButtonText: 'Annuler',
          customClass: {
            popup: 'z-index: 100000;', // Classe CSS pour personnaliser le style du popup
          },
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
              // return alert({text:`La sélection n'a pas abouti à l'affectation d'un bénévole.`});
            }
          },
        });
        if (personne) {
          if (personne === "ajout") {
            setOpenAjoutBenevole(true);
          }
          else {
            const objet = {
              id: id,
              idBenevole: Number(personne)
            }
            dispatch(updateBenevoleRendezVous(objet)).then(err => console.log(err));
            Swal.fire({ icon: "success", text: `le bénévole a été selectionné avec succés` });
          }
        } else {
          // Swal.fire({text:`La sélection n'a pas abouti à l'affectation d'un bénévole.`});
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
          customClass: {
            popup: 'z-index: 5;', // Classe CSS pour personnaliser le style du popup
          },
          confirmButtonText: 'Ok',
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
              //return Swal.fire(`La sélection n'a pas abouti à l'affectation d'un bénévole.`);
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
            dispatch(updateBenevoleRendezVous(objet)).then(err => console.log(err));
            Swal.fire({ icon: "success", text: `le bénévole a été modifié avec succés` });
          }
        }
      }
    })
    function handleSelectChange(event) {
      if (event.target.value === "ajout") {
        setOpenAjoutBenevole(true);
      }
    }

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

  const nonRealiserRendezFin = () => {
    Swal.fire({
      title: "Rendez-vous de restitution du l'objet manqué",
      html:
        "<p> Vous pouvez choisir une nouvelle date pour la restitution du l'objet.</p>",
      showCancelButton: true,
      confirmButtonColor: "rgba(72, 151, 90, 0.66)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Choisir une nouvelle date de fin",
      cancelButtonText: "Annuler",
      showCloseButton: true,

    }).then((result) => {
      if (result.isConfirmed) {
        // Swal.fire({
        //   title: "Choisir une nouvelle date de fin",
        //   html: `<input id="newEndDate"  type="date" class="swal2-input"  min=${new Date()}>  <input id="newEndTime"  type="time" class="swal2-input" min="09:00" max="18:00">`,
        //   showCancelButton: true,
        //   confirmButtonText: "Confirmer",
        //   cancelButtonText: "Annuler",
        //   showCloseButton: true,
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     const newEndDate = document.getElementById("newEndDate").value;
        //     const newEndTime = document.getElementById("newEndTime").value;
        //     const heureParts = newEndTime.split(':');
        //     const heure = parseInt(heureParts[0], 10);
        //     const minute = parseInt(heureParts[1], 10);
        //     // Crée une nouvelle date avec la date actuelle et l'heure spécifiée
        //     const dateTime = new Date(newEndDate);
        //     dateTime.setHours(heure);
        //     dateTime.setMinutes(minute);
        //     const objet = {
        //       id: idRendez,
        //       date: dateTime
        //     }

        //     //dispatch(updateNonRealise(idRendez)) 
        //     dispatch(updateRendezVous(objet)).then(err => { console.log(err) })
        //     // Envoyer la nouvelle date à votre backend pour mise à jour dans la base de données
        //     // Afficher un message de confirmation ou de succès
        //   } else {
        //     // L'utilisateur choisit d'annuler la sélection de la nouvelle date
        //     // Vous pouvez prendre une action appropriée ici
        //   }
        // });
        setOpenModif(true)
      } else {
        // L'utilisateur choisit de laisser la réparation en cours
        // Mettre à jour l'état de la réparation dans la base de données
        // Afficher un message de confirmation ou de succès
        // dispatch(updateNonRealise(idRendez)).then(res=>{dispatch(updateEnCoursReparation(id)).then(res=>console.log(res))})

      }
    });
  }
  const nonRealiserRendezVous = (id) => {
    /* Swal.fire({
       text: " Êtes-vous sûr de vouloir marquer ce rendez-vous comme non réalisé ? ",
       icon: "warning",
       cancelButtonText:"Annuler",
       confirmButtonText: "continuer",
       showCancelButton: true,
       confirmButtonColor: "#d33",
       cancelButtonColor: "rgba(72, 151, 90, 0.68)",
       
     }).then((result) => {
       if (result.isConfirmed) {*/
    dispatch(updateNonValideReparation(id)).then(res => console.log(res.message))
    /* Swal.fire({
       title: "Deleted!",
       text: "Your file has been deleted.",
       icon: "success"
     });*/
    //}
    // });
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
        confirmButtonText: 'OK',
        keydownListenerCapture: true,
        toast: true,
        customClass: {
          popup: 'z-index: 100000;',
        },
        position: 'top',
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
        confirmButtonText: 'OK',
        toast: true,
        customClass: {
          popup: 'z-index: 100000;', // Classe CSS pour personnaliser le style du popup
        },
        position: 'top',
        toast: true,
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
          const rendez = {
            id: idRendez,
            date: dateTime
          }
          dispatch(updateRendezVous(rendez)).then(err => console.log(err))
          setOpenModalModif(false)
        }
      }
    })
    
    // navigate(`/listeDesDemandes/${user.user.id}`)
    /*const dateTime = moment(`${dateRendez}T${heureRendez}`);
        console.log("id", id, "date", dateTime);*/
  }
  const modifierRendezRestitution = (idRendez) => {
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
        confirmButtonText: 'OK',
        keydownListenerCapture: true,
        toast: true,
        customClass: {
          popup: 'z-index: 100000;',
        },
        position: 'top',
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
        confirmButtonText: 'OK',
        toast: true,
        customClass: {
          popup: 'z-index: 100000;', // Classe CSS pour personnaliser le style du popup
        },
        position: 'top',
        toast: true,
      });
      return;
    }
    const objet = {
      id: idRendez,
      date: dateTime
    }

    //dispatch(updateNonRealise(idRendez)) 
    dispatch(updateRendezVous(objet)).then(err => { console.log(err) })
    setOpenModif(false)
    // navigate(`/listeDesDemandes/${user.user.id}`)
    /*const dateTime = moment(`${dateRendez}T${heureRendez}`);
        console.log("id", id, "date", dateTime);*/
  }
  return (
    <div>
      {console.log("lesRendezVous", desRendezVous)}
      <Tabs
        variant="outlined"
        orientation="{direction.startsWith('row') ? 'vertical' : 'horizontal'}"
        aria-label="Basic tabs"
        value={filtre}
        onChange={(event, newValue) => setFiltre(newValue)}
        sx={{
          gridColumn: "1/1",
          width: "70vw",
          marginLeft: "45px",
          flexDirection: "direction",
          minHeight: '600px'
        }}
      >
        <TabList underlinePlacement="bottom">
          <Tab indicatorPlacement="bottom" value={"debut"} variant='outlined'
            color='neutral' onChange={() => setFiltreSelect("enCours")} >
            Acquisition
          </Tab>
          <Tab indicatorPlacement="bottom" value={"fin"} variant='outlined'
            color='neutral' onChange={() => setFiltreSelect("enCours")}>
            Restitution
          </Tab>
          {/*<Tab indicatorPlacement="bottom" value={"réalisé"} variant='outlined'
            color= 'neutral'>
          Réalisés
          </Tab>
          <Tab indicatorPlacement="bottom" value={"nonRéalisé"} variant='outlined'
            color= 'neutral'>
         Non Réalisés
      </Tab>*/}
        </TabList>

        {desRendezVous ?
          (<Stack spacing={2}>
            <TabPanel value="debut" sx={{ minHeight: '600px' }}>
              <Row>
                <Col>
                  <Typography variant="h4" gutterBottom>
                    Les Rendez-vous :
                  </Typography>
                </Col>
                <Col style={{ marginRight: "115px" }}>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel value="female" control={<Radio checked={filtreSelect === 'enCours'} />} onClick={() => setFiltreSelect("enCours")} label="En cours" />
                    <FormControlLabel value="male" control={<Radio checked={filtreSelect === 'realise'} />} onClick={() => setFiltreSelect("realise")} label="Réalisés" />
                    <FormControlLabel value="" control={<Radio checked={filtreSelect === 'nonRealise'} />} onClick={() => setFiltreSelect("nonRealise")} label="Non réalisés" />
                  </RadioGroup>
                </Col>
              </Row>
              <>

                <div style={{ marginTop: "2px", marginLeft: "230px" }}>
                  <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                    <Form.Label column sm={2}>
                      Chercher :
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control type="text" placeholder="Nom Objet" onChange={handleNomObjetInputChange} style={{ width: '200px' }} />
                    </Col>
                  </Form.Group>
                </div></>
              {console.log("début :", filtrerRendezVous(desRendezVous).length)}
              <Grid container spacing={2}>
                {filtrerRendezVous(desRendezVous).length != 0 ? (filtrerRendezVous(desRendezVous).map((rendezVous, ind) => (

                  (rendezVous.reparationDebut[0] !== "" && rendezVous.etatRealisation === filtreSelect) && (

                    <Grid item xs={12} md={6} lg={4} sx={{ minHeight: '500px' }} >
                      <Card class="shadow  bg-body-tertiary rounded " style={{ width: "280px" }}>

                        <CardContent sx={{ '& > *': { marginBottom: '8px' } }}>
                          <Typography variant="h6" gutterBottom style={{ textAlign: "center", backgroundColor: "rgba(82, 131, 144, 0.33)" }}>
                            <EventAvailableIcon /><strong> Rendez-vous le {format(new Date(rendezVous.date), 'dd/MM/yyyy')} </strong>
                            {filtreSelect == "enCours" && ((user && user.user && user.user.role !== "association") || (user && user.donateur && user.donateur.user.role !== "association")) && <IconButton aria-label="Modifier" className="mb=2"
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
                            <Typography variant="body2" gutterBottom>
                              {(user && user.user) ?
                                <> <Diversity1Icon fontSize="small" />
                                  <strong> entreprise : </strong>{rendezVous.reparationDebut[0]?.entreprise.donateur.user.nom}</>
                                : (user && user.donateur) ?
                                  <><Diversity1Icon fontSize="small" /> <strong> Association : </strong>{rendezVous.reparationDebut[0]?.demandeReparation.donation.demandeObjet.association.user.nom}
                                  </> : ""}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <CallIcon fontSize="small" />  <strong> Contact : </strong>   {rendezVous.reparationDebut[0]?.demandeReparation.donation.demandeObjet.association.numTelephone}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <VolunteerActivismIcon fontSize="small" />  <strong> Objet : </strong> {rendezVous.reparationDebut[0]?.demandeReparation.donation.demandeObjet.objet.nom}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              {
                                filtreSelect === "nonRealise" || filtreSelect === "realise" ? (
                                  <>
                                    <VolunteerActivismIcon fontSize="small" />
                                    <strong> Bénévole : </strong>
                                    {rendezVous.benevolee ? rendezVous.benevolee.nom + "  " + rendezVous.benevolee.prenom : "aucun bénévole affecté"}
                                  </>
                                ) : (
                                  <>
                                    <VolunteerActivismIcon fontSize="small" />
                                    <strong> Bénévole : </strong>
                                    {
                                      rendezVous.benevolee ? (
                                        <>
                                          {rendezVous.benevolee.nom} {rendezVous.benevolee.prenom} { }
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
                                    }    </>
                                )
                              }

                            </Typography>
                          </Stack>
                          {filtreSelect == "enCours" &&
                            <div style={{ padding: "10px" }}>
                              <Button variant="outlined" color="success" style={{ marginRight: '8px' }} onClick={() => { rendezVous.benevolee ? (setIdRendez(rendezVous.id), setOpenRealise(true)) : setOpenAlert(true) }} disabled={((new Date(rendezVous.date).getTime()) > (new Date().getTime()))}>
                                Realisé
                              </Button>
                              <Button variant="outlined" color="error" onClick={() => { setOpenNonRealise(true); setIdRendez(rendezVous.reparationDebut[0].id)/*,nonRealiserRendezVous(rendezVous.reparationDebut[0].id)*/ }} disabled={(new Date(rendezVous.date).getTime()) > (new Date().getTime())}>
                                Non réalisé
                              </Button>
                            </div>}
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                ))) : <div style={{ padding: "100px", margin: "100px", marginLeft: "100px", textAlign: "center" }}><h3>Aucun rendez-vous n'a été trouvé.</h3></div>
                }
              </Grid>
            </TabPanel>
            <TabPanel value="fin" sx={{ minHeight: '600px' }}>
              <Row>
                <Col>
                  <Typography variant="h4" gutterBottom>
                    Les Rendez-vous :
                  </Typography>
                </Col>
                <Col style={{ marginRight: "115px" }}>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel value="female" control={<Radio checked={filtreSelect === 'enCours'} />} onClick={() => setFiltreSelect("enCours")} label="En cours" />
                    <FormControlLabel value="male" control={<Radio checked={filtreSelect === 'realise'} />} onClick={() => setFiltreSelect("realise")} label="Réalisés" />
                    <FormControlLabel value="other" control={<Radio checked={filtreSelect === 'nonRealise'} />} onClick={() => setFiltreSelect("nonRealise")} label="Non réalisés" />
                  </RadioGroup>
                </Col>
              </Row>
              <>

                <div style={{ marginTop: "2px", marginLeft: "230px" }}>
                  <Form.Group as={Row} className="mb-1" controlId="formHorizontalEmail">
                    <Form.Label column sm={2}>
                      Chercher :
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control type="text" placeholder="Nom Objet" onChange={handleNomObjetInputChange} style={{ width: '200px' }} />
                    </Col>
                  </Form.Group>
                </div></>
              {
                console.log("fin :", filtrerRendezVous(desRendezVous).length)}
              <Grid container spacing={3}>
                {filtrerRendezVous(desRendezVous).length ? (filtrerRendezVous(desRendezVous).map((rendezVous, ind) => (

                  (rendezVous.reparationFin[0] != {} && rendezVous.etatRealisation === filtreSelect) && (

                    <Grid item xs={12} md={6} lg={4} sx={{ minHeight: '500px' }} >
                      {console.log("zzz" + rendezVous.reparationFin[0])}
                      <Card class="shadow  bg-body-tertiary rounded" style={{ width: "280px" }}>
                        <CardContent sx={{ '& > *': { marginBottom: '8px' } }}>
                          <Typography variant="h6" gutterBottom style={{ textAlign: "center", backgroundColor: "rgba(82, 131, 144, 0.33)" }}>
                            <EventAvailableIcon /><strong> Rendez-vous le {format(new Date(rendezVous.date), 'dd/MM/yyyy')} </strong>
                            {filtreSelect == "enCours" && ((user && user.user && user.user.role !== "association") || (user && user.donateur && user.donateur.user.role !== "association")) && <IconButton aria-label="Modifier" className="mb=2"
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
                            <Typography variant="body2" gutterBottom>
                              {(user && user.user) ?
                                <> <Diversity1Icon fontSize="small" />
                                  <strong> entreprise : </strong>{rendezVous.reparationFin[0]?.entreprise.donateur.user.nom}</>
                                : (user && user.donateur) ?
                                  <><Diversity1Icon fontSize="small" /> <strong> Association : </strong>{rendezVous.reparationFin[0]?.demandeReparation.donation.demandeObjet.association.user.nom}
                                  </> : ""}               </Typography>
                            <Typography variant="body2" gutterBottom>
                              <CallIcon fontSize="small" />  <strong> Contact : </strong>   {rendezVous.reparationFin[0]?.demandeReparation.donation.demandeObjet.association.numTelephone}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <VolunteerActivismIcon fontSize="small" />  <strong> Objet : </strong> {rendezVous.reparationFin[0]?.demandeReparation.donation.demandeObjet.objet.nom}
                            </Typography>
                            {
                              filtreSelect === "nonRealise" || filtreSelect === "realise" ? (
                                <Typography variant="body2" gutterBottom>
                                  <VolunteerActivismIcon fontSize="small" />
                                  <strong> Bénévole : </strong>
                                  {rendezVous.benevolee ? rendezVous.benevolee.nom + "  " + rendezVous.benevolee.prenom : "aucun bénévole affecté"}
                                </Typography>
                              ) : (
                                <Typography variant="body2" gutterBottom>
                                  <VolunteerActivismIcon fontSize="small" />
                                  <strong> Bénévole : </strong>
                                  {
                                    rendezVous.benevolee ? (
                                      <>
                                        {rendezVous.benevolee.nom} {rendezVous.benevolee.prenom} { }
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
                                  }      </Typography>
                              )
                            }
                          </Stack>

                          {filtreSelect == "enCours" && <div style={{ padding: "10px" }}>
                            <Button variant="outlined" color="success" style={{ marginLeft: user && user.donateur && user.donateur.user.role == "entreprise" ? '0px' : "75px", marginRight: user && user.donateur && user.donateur.user.role == "entreprise" ? "8px" : "0px" }} onClick={() => { rendezVous.benevolee ? (setIdRendez(rendezVous.id), setOpenRealise(true)) : setOpenAlert(true) }} disabled={((new Date(rendezVous.date).getTime()) > (new Date().getTime()))}>
                              Realisé
                            </Button>
                            {user && user.donateur && user.donateur.user.role == "entreprise" && <Button variant="outlined" color="error" onClick={() => {
                              nonRealiserRendezFin(), setIdRendezVous(rendezVous.id),
                                setDateRendez((rendezVous.date).split('T')[0]),
                                setHeureRendez(((rendezVous.date).split('T')[1]).split(':')[0] + ':' + ((rendezVous.date).split('T')[1]).split(':')[1])
                            }} /*onClick={()=>{setIdRendez(rendezVous.id),setOpenNonRealise(true)}}*/ disabled={(new Date(rendezVous.date).getTime()) > (new Date().getTime())}>
                              Non réalisé
                            </Button>}
                          </div>}
                        </CardContent>

                      </Card>
                    </Grid>

                  )
                ))) : <div style={{ padding: "100px", margin: "100px", marginLeft: "100px", textAlign: "center" }}><h3>Aucun rendez-vous n'a été trouvé.</h3></div>

                }
              </Grid>

            </TabPanel>
            {/* <TabPanel value="réalisé">
              <Typography variant="h4" gutterBottom>
                Les Rendez-vous :
              </Typography>
              <Grid container spacing={3}>
                {filtrerRendezVous(desRendezVous).length ? (filtrerRendezVous(desRendezVous).map((rendezVous, ind) => (
                  rendezVous.etatRealisation === "realise" && (
                    <Grid item xs={12} md={6} lg={4} sx={{ minHeight: '500px' }} >
                      <Card class="shadow  bg-body-tertiary rounded">
                        <CardContent sx={{ '& > *': { marginBottom: '8px' } }}>
                          <Typography variant="h6" gutterBottom style={{ textAlign: "center", backgroundColor: "rgba(211, 180, 152, 0.57)" }}>
                            <EventAvailableIcon /><strong> Rendez-vous le {format(new Date(rendezVous.date), 'dd/MM/yyyy')} </strong>
                          </Typography>
                          <Divider style={{ margin: "20px" }} />
                          <Stack spacing={1}>
                            <Typography variant="body1" gutterBottom>
                              <AccessTimeIcon fontSize="small" />  <strong> Horaire : </strong> {format(new Date(rendezVous.date), 'HH:mm')}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              {(user && user.user) ?
                                <>          <Diversity1Icon fontSize="small" />   <strong> entreprise : </strong>{rendezVous.reparationFin[0]?.entreprise.donateur.user.nom || rendezVous.reparationDebut[0]?.entreprise.donateur.user.nom} </>
                                : (user && user.donateur) ?
                                  <><Diversity1Icon fontSize="small" /> <strong> Association : </strong>{rendezVous.reparationFin[0]?.demandeReparation.donation.demandeObjet.association.user.nom || rendezVous.reparationDebut[0]?.demandeReparation.donation.demandeObjet.association.user.nom}
                                  </> : ""}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <CallIcon fontSize="small" />  <strong> Contact : </strong>{rendezVous.reparationFin[0]?.demandeReparation.donation.demandeObjet.association.numTelephone}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <VolunteerActivismIcon fontSize="small" />  <strong> Objet : </strong> {rendezVous.reparationFin[0]?.demandeReparation.donation.demandeObjet.objet.nom}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <VolunteerActivismIcon fontSize="small" />  <strong> Bénévole : </strong> {rendezVous.benevolee ? rendezVous.benevolee.nom + "  " + rendezVous.benevolee.prenom : user && !user.donateur && user.user.role == "association" ? <a onClick={(e) => affecter(rendezVous.date, rendezVous.id)}>Affecter un bénévole </a> : "aucun bénévole affecté"}
                            </Typography>
                          </Stack>
                          <div style={{ marginLeft: "40px", marginRight: "40px", marginTop: "30px" }}>
                            <Alert sx={{ paddingLeft: '55px' }} color='success' >Realisé</Alert>
                          </div>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                ))) : <div style={{ padding: "100px", margin: "100px", marginLeft: "100px", textAlign: "center" }}><h3>Aucun rendez-vous n'a été trouvé.</h3></div>
                }
              </Grid>
            </TabPanel>
            <TabPanel value="nonRéalisé">
              <Typography variant="h4" gutterBottom>
                Les Rendez-vous :
              </Typography>
              <Grid container spacing={3}>
                {filtrerRendezVous(desRendezVous).length ? (filtrerRendezVous(desRendezVous).map((rendezVous, ind) => (
                  rendezVous.etatRealisation === "nonRealise" && (
                    <Grid item xs={12} md={6} lg={4} sx={{ minHeight: '500px' }}>
                      <Card class="shadow  bg-body-tertiary rounded">
                        <CardContent sx={{ '& > *': { marginBottom: '8px' } }}>
                          <Typography variant="h6" gutterBottom style={{ textAlign: "center", backgroundColor: "rgba(211, 180, 152, 0.57)" }}>
                            <EventAvailableIcon /><strong> Rendez-vous le {format(new Date(rendezVous.date), 'dd/MM/yyyy')} </strong>
                          </Typography>
                          <Divider style={{ margin: "20px" }} />
                          <Stack spacing={1}>
                            <Typography variant="body1" gutterBottom>
                              <AccessTimeIcon fontSize="small" />  <strong> Horaire : </strong> {format(new Date(rendezVous.date), 'HH:mm')}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              {(user && user.user) ?
                                <><Diversity1Icon fontSize="small" />   <strong> entreprise : </strong>{rendezVous.reparationFin[0]?.entreprise.donateur.user.nom || rendezVous.reparationDebut[0]?.entreprise.donateur.user.nom} </>
                                : (user && user.donateur) ?
                                  <><Diversity1Icon fontSize="small" /> <strong> Association : </strong>{rendezVous.reparationFin[0]?.demandeReparation.donation.demandeObjet.association.user.nom || rendezVous.reparationDebut[0]?.demandeReparation.donation.demandeObjet.association.user.nom}
                                  </> : ""}               </Typography>
                            <Typography variant="body2" gutterBottom>
                              <CallIcon fontSize="small" />  <strong> Contact : </strong>   {rendezVous.reparationFin[0]?.demandeReparation.donation.demandeObjet.association.numTelephone}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <VolunteerActivismIcon fontSize="small" />  <strong> Objet : </strong> {rendezVous.reparationFin[0]?.demandeReparation.donation.demandeObjet.objet.nom}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <VolunteerActivismIcon fontSize="small" />  <strong> Bénévole : </strong> {rendezVous.benevolee ? rendezVous.benevolee.nom + "  " + rendezVous.benevolee.prenom : "aucun bénévole affecté"}
                            </Typography>
                          </Stack>
                          <div style={{ marginLeft: "40px", marginRight: "40px", marginTop: "30px" }}>
                            <Alert sx={{ paddingLeft: '55px' }} color='danger' > Non Realisé</Alert>
                          </div>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                ))) : <div style={{ padding: "100px", margin: "100px", marginLeft: "100px", textAlign: "center" }}><h3>Aucun rendez-vous non réalisé n'a été trouvé.</h3></div>
                }
              </Grid>
            </TabPanel> */}
          </Stack>
          ) : null}
      </Tabs>
      {/* modal pour le refus */}
      <Modal open={openNonRealise} onClose={() => setOpenNonRealise(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            {<WarningAmberOutlined />}
            Attention
          </DialogTitle>
          <Divider />
          <DialogContent>
            Êtes-vous sûr de vouloir marquer ce rendez-vous comme non réalisé ?
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="success" size='small' onClick={() => { nonRealiserRendezVous(idRendez); setOpenNonRealise(true) /*dispatch(updateNonRealise(idRendez)).then(res => { console.log(res.error), setOpenNonRealise(true) }) */ }}>
              comfirmer
            </Button>
            <Button variant="outlined" color="error" size='small' onClick={() => setOpenNonRealise(false)}>
              Annuler
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
      <Modal open={openRealise} onClose={() => setOpenRealise(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            { /* <WarningRoundedIcon />*/}
            Comfirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            Êtes-vous sûr de vouloir  comfirmer cet rendez-vous ?
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={() => { realiserRendez(idRendez) }}>
              comfimer
            </Button>
            <Button variant="plain" color="neutral" onClick={() => setOpenRealise(false)}>
              Annuler
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>



      {/**modal pour la modification du rendez-vous*/}
      {/* {<Modal open={openModalModif} onClose={()=>setOpenModalModif(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        size="md"
      >
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '40px' }}    id="modal-container">
       <div className='mb-3'>
        <DialogTitle >
          <span style={{marginLeft:"85px"}} >Planifier un nouveau rendez-vous pour la restitution de l'objet</span> 
            </DialogTitle>     
            </div>
            <Divider/>
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
        size="md"
        style={{ zIndex: '1050' }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Empêche la soumission par défaut du formulaire
            modifierRendez(idRendezVous);
          }}
        >
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '40px' }} id="modal-container">
            <div className='mb-3'>
              <DialogTitle>
                <span style={{ marginLeft: "160px" }}> Planifier un nouveau rendez-vous </span>
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
            <Button variant="contained" color='error' onClick={() => setOpenModalModif(false)} sx={{ marginLeft: '200px', color: "white" }}>Annuler</Button>
            <Button type="submit" variant="contained" color='success' sx={{ marginLeft: '30px', backgroundColor: "rgba(134, 162, 114, 0.8)", color: "white" }}>Envoyer</Button>
          </div>
        </form>
      </Modal>
      <Modal
        open={openModif}
        onClose={() => setOpenModif(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        size="md"
        style={{ zIndex: '1050' }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Empêche la soumission par défaut du formulaire
            modifierRendezRestitution(idRendezVous);
          }}
        >
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '40px' }} id="modal-container">
            <div className='mb-3'>
              <DialogTitle>
                <span style={{ marginLeft: "90px" }}> Planifier un nouveau rendez-vous du restitution  </span>
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
            <Button variant="contained" color='error' onClick={() => setOpenModif(false)} sx={{ marginLeft: '200px' }} >Annuler</Button>
            <Button type="submit" variant="contained" color='success' sx={{ marginLeft: '30px'}}>Envoyer</Button>
          </div>
        </form>
      </Modal>
      {/*dialog alert */}
      <Modal open={openAlert} onClose={() => setOpenAlert(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle >
            <div>
              <Typography variant='h5'>
                <WarningRounded color='red' className='m-1' />
                Attention
              </Typography>
            </div>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <DialogContentText>
              <Typography variant='body1' style={{ color: "black" }}>
                {((user && user.user?.role === "donateur") || (user && user.donateur)) &&
                  "Impossible de réaliser ce rendez-vous pour le moment. L’association n’a pas encore affecté un bénévole pour cette mission"}
              </Typography>
              {(user && user.user?.role === "association") && "Veuillez affecter un bénévole à ce rendez-vous pour que vous puissiez réaliser ce rendez-vous"}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ width: 100, alignSelf: "flex-end" }}>
            <Button variant="outlined" color="success" size='small' onClick={() => setOpenAlert(false)}>
              D'accord
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
      <Modal open={openAjoutBenevole} onClose={() => setOpenAjoutBenevole(false)} style={{ zIndex: '1060' }} centered>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <Typography variant='h5'>
              Ajout d'un bénévole
            </Typography>
          </DialogTitle>
          <Divider />
          <Form onSubmit={handleSubmitAjout}> {/* Ajout du formulaire ici */}
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
            <DialogActions>
              <Button style={{ backgroundColor: "rgba(82, 131, 144)", borderColor: "rgba(82, 131, 144, 0.33)", color: 'white' }} type="submit"> Enregistrer </Button>
              <Button style={{ backgroundColor: "rgba(82, 131, 144)", borderColor: "rgba(82, 131, 144, 0.33)", color: 'white' }} onClick={() => setOpenAjoutBenevole(false)}>Annuler</Button>
            </DialogActions>
          </Form>
        </ModalDialog>
      </Modal>
      {/*dialog non realiser */}
      {/* <Dialog open={openNonRealise} onClose={() => setOpenNonRealise(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth={"sm"}> 
       <DialogTitle variant='h6' >
       <WarningAmber style={{marginRight:'10px'}}/>
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
     </Dialog> */}
    </div>
  )
}

export default Contenu
