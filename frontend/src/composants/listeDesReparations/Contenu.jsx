import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { Button, Card, CardContent, DialogActions, DialogContent, DialogTitle, Divider, Grid, ModalDialog, Stack, Tab, TabList, TabPanel, Tabs, Typography } from '@mui/joy';
import { Alert, Avatar, CardMedia, Modal, TextField, colors } from '@mui/material';
import { updateDateRemiseReparation } from '../../features/reparationSlice';
import Swal from 'sweetalert2';
import { Dataset, WarningAmberOutlined, WarningAmberRounded } from '@mui/icons-material';
import { updateRealise } from '../../features/rendezVousSlice';
import { Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const Contenu = () => {
  const [open, setOpen] = React.useState(false);
  const [filtre, setFiltre] = useState("enCours"); // pour le filtre sélectionné
  const [repId,setrepId]=useState();
  const [openModalAcceptation, setOpenModalAcceptation] = useState(false);
  const [openRealise, setOpenRealise] = useState(false);
  const [openAlerte, setOpenAlerte] = useState(false);
  const [benevoleRendez, setBenevoleRendez] = useState(null);
  const [idRendez,setIdRendez]=useState()
  const [idDmd,setidDmd]=useState()
  const [dateRendez,setDateRendez]=useState("")
  const [heureRendez,setHeureRendez]=useState("")
  const [dateSysteme,setDateSysteme]=useState(new Date())
  const {user} = useSelector((state) =>state.auth);
  const dispatch=useDispatch()
  const {reparations,isLoading,error} = useSelector((state)=>state.storeReparations);
  const {desRendezVous} = useSelector((state)=>state.storeRendezVous);
  const [nomObjetFilter, setNomObjetFilter] = useState(""); // Pour le nom d'objet saisi
  const [donateur, setDonateur] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const filtrerReparations = (reparations) => {
    return reparations.filter((reparation) => {
         if(filtre==="repare"){
            return reparation.etat=="repare"
      }else if(filtre=="nonValide"){
return reparation.etat=="nonValide"
      } 
      else {
            return reparation.etat === "enCours";
      }
    }).filter((rep) => {
      // Filtrer en fonction du nom d'objet saisi
      return rep.demandeReparation.donation.demandeObjet.objet.nom.toLowerCase().includes(nomObjetFilter.toLowerCase());
    });
  };
  const handleCloseModal = () => {
    setOpenModalAcceptation(false);
    setDateRendez("")
    setHeureRendez("")
    setidDmd()
  };
  const handleNomObjetInputChange = (e) => {
    setNomObjetFilter(e.target.value);
  };
 /* const terminerReparation= async (reparationId)=>{
    const { value: date } = await Swal.fire({
      title: "saisir la date de remise d'objet ",
      html: '<input id="swal-input1" class="swal2-input">',
      preConfirm: () => {
        return document.getElementById('swal-input1').value;
      },
      didOpen: () => {
        const today = (new Date()).toISOString().split('T')[0];
        document.getElementById('swal-input1').type = 'date';
        document.getElementById('swal-input1').min = today;
      }
    });
    if (date) {
      const objet={
        id:reparationId,
        dateFin:date
      }
      dispatch(updateDateRemiseReparation(objet)).then(err=>console.log(err))
      Swal.fire("date de remise d'objet :", date);
    }
  }*/
  const terminerReparation=(reparationId)=>{
    const heureParts = heureRendez.split(':'); 
    const heure = parseInt(heureParts[0], 10); 
    const minute = parseInt(heureParts[1], 10);
    // Crée une nouvelle date avec la date actuelle et l'heure spécifiée
    const dateTime = new Date(dateRendez);
    dateTime.setHours(heure);
    dateTime.setMinutes(minute);
    console.log("id",reparationId,"date",dateTime)
    console.log(dateTime.toISOString())
    const objet={
      id:reparationId,
      dateFin:dateTime.toISOString()
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
      backdrop:true,
      keydownListenerCapture:true,
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
  dispatch(updateDateRemiseReparation(objet)).then(err=>console.log(err))
  handleCloseModal()
   // navigate(`/listeDesDemandes/${user.user.id}`)
/*const dateTime = moment(`${dateRendez}T${heureRendez}`);
    console.log("id", id, "date", dateTime);*/
  }
   //realiser un rendezVous
   const realiserRendez=(id)=>{
    dispatch(updateRealise(id)).then(err=>err.message)
    setOpenRealise(false)
    setOpenModalAcceptation(true)
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
         width:"80vw",
          marginLeft:"15px",
         flexDirection: "direction",
       }}
     >
         <TabList underlinePlacement="bottom">
         <Tab indicatorPlacement="bottom" value="enCours"  variant='outlined'
           color= 'neutral'>
          En cours
         </Tab>
         <Tab indicatorPlacement="bottom" value={"repare"} variant='outlined'
           color= 'neutral'>
         Terminées
         </Tab>
         <Tab indicatorPlacement="bottom" value={"nonValide"} variant='outlined'
           color= 'neutral'>
         Non effectuées
         </Tab>
       </TabList>
       { reparations && <div style={{marginTop:"20px" , marginLeft:"300px"}}>
     <Form.Group as={Row} className="mb-1" controlId="formHorizontalEmail">
        <Form.Label column sm={2}>
         Chercher par
        </Form.Label>
        <Col sm={10}>
        <Form.Control type="text" placeholder="Nom Objet" onChange={handleNomObjetInputChange}  style={{ width: '200px' }}/>
        </Col>
      </Form.Group>
      </div>}
       
   {reparations ? (
     <Stack spacing={2}>
     <TabPanel value={"enCours"}>
       { filtrerReparations(reparations).length ? filtrerReparations(reparations).map((rep, ind) => (
         rep.etat=="enCours" && (
           <Grid item xs={12} key={rep.id}>
                 <Card sx={{ display: 'flex', flexDirection: 'row',marginBottom:2 }} variant="outlined">
         <CardMedia
           component="img"
           sx={{ width: 200, objectFit: 'contain' }}
           image={( rep.demandeReparation.donation.demandeObjet.objet.image && (rep.demandeReparation.donation.demandeObjet.objet.image).length >0 && rep.demandeReparation.donation.demandeObjet.objet.image[0])?(rep.demandeReparation.donation.demandeObjet.objet.image[0].url):null}
           alt=""
           style={{width:"200px",height:"150px" ,marginTop:"10px"}}
         />
         <CardContent style={{marginLeft:"100px"}}>
           {/* {<p>{JSON.stringify(rep)}</p>} */}
           <Typography variant="body2" className="mb-3 mt-2">
             <strong>Nom de l'Objet :</strong> {"   "}{ rep.demandeReparation.donation.demandeObjet.objet.nom}
           </Typography>
           <Typography variant="body2" className="mb-3" >
           { ((user && user.user?.role !== "association") || (user && user.donateur)) ?<><strong>Association :</strong> 
           <Link to={`/associationProfil/${rep.demandeReparation.donation.demandeObjet.association?.userIdA}`} style={{ color: 'rgba(54, 79, 112, 0.8)' ,textDecoration: 'underline' }} title={`Profil de ${rep.demandeReparation.donation.demandeObjet.association.user?.nom}`}>
           {rep.demandeReparation.donation.demandeObjet?.association?.user?.nom}
                            </Link>
          </>
             :<> <strong> Donateur :</strong>{"  "}
             <Link onClick={() => { setOpenModal(true), setDonateur(rep.demandeReparation.donation?.demandeObjet?.objet?.donateur) }} style={{ color: 'rgba(54, 79, 112, 0.8)', textDecoration: 'underline' }}  >
             {rep.demandeReparation.donation.demandeObjet.objet.donateur?.user?.nom}
               </Link> <p></p>
               <strong> Entreprise :</strong>
             <Link  style={{ color: 'rgba(54, 79, 112, 0.8)', textDecoration: 'underline' }}  >{"  "}
             {rep.entreprise.donateur?.user?.nom}
               </Link>
               </>} 
           </Typography>
           <Typography variant="body2" className="mb-3">
             <strong>Date d'acqusition de l'objet :</strong> 
            {"  "}{format(new Date(rep.debutDeReparation.date), 'dd/MM/yyyy  à HH:mm')}
          { rep.debutDeReparation.etatRealisation=="enCours"  && <strong style={{color:"red"}}>{"     (enCours)"}</strong> }
          { rep.debutDeReparation.etatRealisation=="realise"  && <strong style={{color:"green"}} >{"     (Réalisé)"}</strong> }
           </Typography>
           {/* Ajoutez d'autres informations de la demande ici selon votre modèle de repnées */}
          
         </CardContent>
         
          <div>         
       {(user && user.donateur)  && 
       <>
         { rep.debutDeReparation.etatRealisation=="enCours"  ? 
       <Button  style={{ backgroundColor: "rgba(82, 131, 144)", marginTop: '65px' ,marginRight: '65px'}} onClick={() =>{ (setIdRendez(rep.debutDeReparation.id),setOpenRealise(true),setidDmd(rep.id)),setBenevoleRendez(rep.debutDeReparation.benevolee)}}  disabled={( new Date (rep.debutDeReparation.date).getTime() > dateSysteme.getTime())}> Terminer</Button>
       :(rep.debutDeReparation.etatRealisation=="realise") ? <Button  variant="solid"  style={{  marginTop: '65px' ,marginRight: '65px'}} onClick={() =>{setOpenModalAcceptation(true),setidDmd(rep.id),setBenevoleRendez(rep.debutDeReparation.benevolee)}} disabled={( new Date (rep.debutDeReparation.date).getTime() > dateSysteme.getTime())}>Terminer</Button>:""}
       </>
       }
       </div>  
       </Card>
           </Grid>
     ))):<div style={{padding:"100px",margin:"100px",marginLeft:"100px" ,textAlign:"center"}}><h3>Aucune réparation en cours n'a été trouvée </h3></div>

      
      }
     </TabPanel>
     <TabPanel value="repare">
       {filtrerReparations(reparations).length ? filtrerReparations(reparations).map((rep, ind) => (
        rep.etat=== "repare" && (
           <Grid item xs={12} key={rep.id}>
                 <Card sx={{ display: 'flex', flexDirection: 'row',marginBottom:2  }} variant="outlined">
         <CardMedia
           component="img"
           sx={{ width: 200, objectFit: 'contain' }}
           image={( rep.demandeReparation.donation.demandeObjet.objet.image && (rep.demandeReparation.donation.demandeObjet.objet.image).length >0 && rep.demandeReparation.donation.demandeObjet.objet.image[0])?(rep.demandeReparation.donation.demandeObjet.objet.image[0].url):null}
           alt=""
           style={{width:"200px",height:"150px",marginTop:"15px"}}
         />
         <CardContent style={{marginLeft:"100px"}}>
          
           <Typography variant="body2" className="mb-3 mt-2">
           <strong>Nom de l'Objet :</strong> {"   "}{ rep.demandeReparation.donation.demandeObjet.objet.nom}
           </Typography>
           <Typography variant="body2" className="mb-3" >
           { ((user && user.user?.role !== "association") || (user && user.donateur)) ?<><strong>Association :</strong> 
           <Link to={`/associationProfil/${rep.demandeReparation.donation.demandeObjet.association.userIdA}`} style={{ color: 'rgba(54, 79, 112, 0.8)' ,textDecoration: 'underline' }} title={`Profil de ${rep.demandeReparation.donation.demandeObjet.association.user?.nom}`}>
           {rep.demandeReparation.donation.demandeObjet?.association?.user?.nom}
                            </Link>
             </>
             :<> <strong> Donateur :</strong>
             <Link onClick={() => { setOpenModal(true), setDonateur(rep.demandeReparation.donation?.demandeObjet?.objet?.donateur) }} style={{ color: 'rgba(54, 79, 112, 0.8)', textDecoration: 'underline' }}  >
             {rep.demandeReparation.donation.demandeObjet.objet.donateur?.user?.nom}
               </Link></>} 
           </Typography>
           <Typography variant="body2" className="mb-3">
             <strong>Date d'acquisition de l'objet :</strong> 
             {"  "}{format(new Date(rep.debutDeReparation.date), 'dd/MM/yyyy  à HH:mm')}

           </Typography>
           <Typography variant="body2" className="mb-3">
             <strong>Date de restitution de l'objet :</strong> 
             {"  "}{format(new Date(rep.finDeReparation.date), 'dd/MM/yyyy  à HH:mm')}

           </Typography>
          
         </CardContent>
         <div style={{marginRight:"0px"}}>
         <div style={{ marginRight:"10px",marginTop:"60px"}}><Alert severity="success">réparation terminée</Alert></div>
         <div >
      </div>
         </div>
       </Card>
           </Grid>
                         ))):<div style={{padding:"100px",margin:"100px",marginLeft:"100px" ,textAlign:"center"}}><h3>Aucune réparation terminée n'a été trouvée </h3></div>

      }
     </TabPanel>
     <TabPanel value={"nonValide"}>
       { filtrerReparations(reparations).length ? filtrerReparations(reparations).map((rep, ind) => (
         rep.etat=="nonValide" && (
         <Grid item xs={12} key={rep.id} >
                 <Card sx={{ display: 'flex', flexDirection: 'row',marginBottom:2  }} variant="outlined">
         <CardMedia
           component="img"
           sx={{ width: 200, objectFit: 'contain' }}
           image={( rep.demandeReparation.donation.demandeObjet.objet.image && (rep.demandeReparation.donation.demandeObjet.objet.image).length >0 && rep.demandeReparation.donation.demandeObjet.objet.image[0])?(rep.demandeReparation.donation.demandeObjet.objet.image[0].url):null}
           alt=""
           style={{width:"200px",height:"150px" ,marginTop:"10px"}}/>
         <CardContent style={{marginLeft:"100px"}}>   
           <Typography variant="body2" className="mb-3 mt-2">
             <strong>Nom de l'Objet :</strong> {"   "}{ rep.demandeReparation.donation.demandeObjet.objet.nom}
           </Typography>
           <Typography variant="body2" className="mb-3" >
           { ((user && user.user?.role !== "association") || (user && user.donateur)) ?<><strong>Association :</strong> 
           <Link to={`/associationProfil/${rep.demandeReparation.donation.demandeObjet.association.userIdA}`} style={{ color: 'rgba(54, 79, 112, 0.8)' ,textDecoration: 'underline' }} title={`Profil de ${rep.demandeReparation.donation.demandeObjet.association.user?.nom}`}>
           {rep.demandeReparation.donation.demandeObjet?.association?.user?.nom}
           </Link>
           </>
             :<> <strong> Donateur :</strong>
             <Link onClick={() => { setOpenModal(true), setDonateur(rep.demandeReparation.donation?.demandeObjet?.objet?.donateur) }} style={{ color: 'rgba(54, 79, 112, 0.8)', textDecoration: 'underline' }}  >
             {rep.demandeReparation.donation.demandeObjet.objet.donateur?.user?.nom}
               </Link></>}            </Typography>
           <Typography variant="body2" className="mb-3">
             <strong>Date d'acquisition de l'objet :</strong> 
            {"  "}{format(new Date(rep.debutDeReparation.date), 'dd/MM/yyyy  à HH:mm')}
          { rep.debutDeReparation.etatRealisation=="enCours"  && <strong style={{color:"red"}}>{"     (enCours)"}</strong> }
          { rep.debutDeReparation.etatRealisation=="realise"  && <strong style={{color:"green"}} >{"     (Réalisé)"}</strong> }
           </Typography>
           {/* Ajoutez d'autres informations de la demande ici selon votre modèle de repnées */}
         </CardContent>
          <div style={{ marginTop: '0px' }}>
       </div>
       </Card>
           </Grid>
   ))):<div style={{padding:"100px",margin:"100px",marginLeft:"100px" ,textAlign:"center"}}><h3>Aucune réparation non effectuée n'a été trouvée </h3></div>

      }
     </TabPanel>
   </Stack>
    ) : null
    }  
   </Tabs> 
     
                 {/* modal pour le refus */}
                  {/* <Modal open={open} onClose={() => setOpen(false)}>
       <ModalDialog variant="outlined" role="alertdialog">
         <DialogTitle>
      
           Confirmation
         </DialogTitle>
         <Divider />
         <DialogContent>
         Êtes-vous sûr de vouloir archiver cette reparation ?
         </DialogContent>
         <DialogActions>
           <Button variant="solid" color="danger" onClick={() => { dispatch(updateArchive(repId)).then(err=>console.log(err)),setOpen(false)}}>
           Archiver
           </Button>
           <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
            Annuler
           </Button>
         </DialogActions>
       </ModalDialog>
     </Modal> */}
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
      terminerReparation(idDmd);
    }}
  >
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '40px' }} id="modal-container">
      <div className='mb-3'>
        <DialogTitle>
          <span style={{ marginLeft: "85px" }}>Planifier un rendez-vous pour la restitution de l'objet</span>
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
        {/**modal pour realiser le rendezVous */}
        <Modal  open={openRealise} onClose={()=>setOpenRealise(false)}>
        <ModalDialog  role="alertdialog">
          <DialogTitle >
          <Typography variant='h4' style={{color:"black"}}> <WarningAmberOutlined></WarningAmberOutlined>  <span style={{fontSize:"22px",marginTop:'-2px'}}> Attention </span> </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent variant='h6' style={{marginBottom:"-10px"}}>  
         <p style={{color:"black", fontStyle:'initial'}}>Souhaitez-vous confirmer votre intention de marquer le rendez-vous d'acquisition comme réalisé avant de pouvoir procéder à la finalisation de la réparation ?</p> 
          </DialogContent>
          <Divider></Divider>
          <DialogActions style={{marginTop:"-20px"}}>
         
          <Button variant="solid" color="danger" size='sm' onClick={() => {benevoleRendez ? realiserRendez(idRendez) : setOpenAlerte(true)}} >
            Oui   
          </Button>
            <Button variant="solid" color="neutral" size='sm' onClick={()=>setOpenRealise(false)}>
Non            
</Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
        <Modal  open={openAlerte} onClose={()=>setOpenAlerte(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle variant='h5'>
          {  <WarningAmberRounded/>}
            Attention !
          </DialogTitle>
          <Divider />
          <DialogContent variant='h6'>  
          Impossible de réaliser le rendez-vous prévu, car l'association n'a pas encore affecté de bénévole pour cette mission. Veuillez la contacter pour lui rappeler.
          </DialogContent>
          <DialogActions>
        <Button variant="outlined" color="danger" size='sm' onClick={()=>{setOpenAlerte(false),setOpenRealise(false)}} style={{marginLeft:"410px" ,padding:'0px'}}>
          D'accord          
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
          <Typography level="h4" mb={0} style={{color:"rgba(82, 131, 144, 1)"}}>
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
