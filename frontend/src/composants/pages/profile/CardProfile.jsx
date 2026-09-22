import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { Alert, Divider, IconButton, ListItem, ListItemSecondaryAction, Snackbar } from '@mui/material';
import 'react-bootstrap'
import { Col, Container, Form, InputGroup, Modal, NavItem, Row, Stack } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css';

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'

import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { useState } from 'react';
import { useEffect } from 'react';
import { updateCompte } from '../../../features/AuthSlice';
import axios from 'axios';
import { Add, Edit } from '@mui/icons-material';
import { Textarea } from '@mui/joy';
import { createBesoin, delBesoin, findBesoinByCat, updateBesoin } from '../../../features/besoinSlice';
import { findCompteAssoByNum, findCompteByEmail, findCompteById, findCompteDonByNum } from '../../../features/utilisateurSlice';
registerPlugin(FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview)
import * as yup from 'yup';
import { useFormik } from 'formik';
import { CloseIcon } from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
export default function CardProfile({ id }) {
  const axiosUpload = axios.create()
  const { user } = useSelector((state) => state.auth);
  const { utilisateur } = useSelector((state) => state.storeUtilisateurs);
  const [userModif, setUserModif] = useState(user)
  const [files, setFiles] = useState([]);
  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [showBesoin, setShowBesoin] = useState(false);
  const [showAjoutBesoin, setShowAjoutBesoin] = useState(false);
  const [showModifBesoin, setShowModifBesoin] = useState(false);
  const [openSuppBesoin, setOpenSuppBesoin] = useState(false);
  const [newBesoin, setNewBesoin] = useState({ associationId: user && user.user?.id })
  const [modifBesoin, setModifBesoin] = useState({ associationId: user && user.user?.id })
  const [erreurCat, setErreurCat] = useState("")
  const { besoins } = useSelector((state) => state.storeBesoins);
  const [idBesoin, setIdBesoin] = useState();
  const [openSnackbar, setOpenSnackbar] = useState(true);
  const [loading, setLoading] = useState(false);
  const [messageVerifBesoin, setMessageVerifBesoin] = useState("");
  const {categories, isLoading } = useSelector((state) => state.storeCategories);

  const handleClose = (e) => {
    setShow(false)
  }
  useEffect(() => {
    console.log('ussss', user)
    // setFiles([
    //   {
    //     source: (user && user.user) ? user.user.image : (user && user.donateur) ? user.donateur.user.image : "",
    //     options: { type: 'local' }
    //   }
    // ]);
    setUserModif(user)
    //dispatch(findCompteById(id)).then(res=>{console.log(res);})
  }, [dispatch])
  useEffect(() => {
    console.log('ussss', user)
    setFiles([
      {
        source: (user && user.user) ? user.user.image : user.donateur.user.image,
        options: { type: 'local' }
      }
    ]);
    // setUserModif(user)
    // //dispatch(findCompteById(id)).then(res=>{console.log(res);})
  }, [show])
  const handlechange = (e) => {
    setUserModif({ ...userModif, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    console.log("modif", userModif.email)

    dispatch(findCompteByEmail(userModif.email)).then(res => {
      console.log(res);
      if (!res.payload || (res.payload && res.payload.id == (user.user ? user.user.id : user.donateur ? user.donateur.user.id:""))) {
       if(((user && user.user?.role=="donateur") || (user && user.donateur?.user?.role=="entreprise"))){
        dispatch(findCompteDonByNum(userModif.numTelephone)).then(res => {
          console.log(res);
          if (!res.payload || (res.payload && res.payload.userIdD == (user.user ? user.user.id : user.donateur.user.id))) {
            dispatch(updateCompte(userModif)).then(res => {
              console.log(res)
              if (!res.error) {
                setUserModif(res.payload.user)
                handleReset()
              }
            })
          }
          else {
            Swal.fire(
              {
                icon: "error",
                text: "le numéro existe déjà"
              })
          }
        })    
       }
       if(user && user.user?.role=="association"){
        dispatch(findCompteAssoByNum(userModif.numTelephone)).then(res => {
          console.log(res);
          if (!res.payload || (res.payload && res.payload.userIdA == (user.user ? user.user.id : user.donateur.user.id))) {
            dispatch(updateCompte(userModif)).then(res => {
              console.log(res)
              if (!res.error) {
                setUserModif(res.payload.user)
                handleReset()
              }
            })
          }
          else {
            Swal.fire(
              {
                icon: "error",
                text: "le numéro existe déjà"
              })
          }
        })    
       }
       

        // console.log('t3adat');
      }
      else {
        Swal.fire(
          {
            icon: "error",
            text: "l'email est déjà utilisé"
          })
      }
    })
    //setValidated(true);

  }
  const handleReset = () => {
    handleClose()
  }
  const serverOptions = () => {
    console.log('server pond');
    return {
      load: (source, load, error, progress, abort, headers) => {
        setFiles([{
          source: source,
          options: {
            type: 'local'
          }
        }])
        var myRequest = new Request(source);
        fetch(myRequest).then(function (response) {
          response.blob().then(function (myBlob) {
            load(myBlob);
          });
        });
      },
      process: (fieldName, file, metadata, load, error, progress, abort) => {
        console.log("file" + JSON.stringify(file.name))
        setLoading(true)
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'aziin_Ecommerce');
        data.append('cloud_name', 'dmbkofiro');
        data.append('public_id', file.name);
        axiosUpload.post('https://api.cloudinary.com/v1_1/dmbkofiro/image/upload', data)
          .then((response) => response.data)
          .then((data) => {
            console.log(data);
            setUserModif({ ...userModif, image: data.url });
            load(data)
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error uploading file:', error);
            error('Upload failed');
            abort();
          });
      },
    };
  };
  const handlechangeAjoutBesoin = (e) => {
    setNewBesoin({ ...newBesoin, [e.target.name]: e.target.value })
  }
  const handleSubmitAjoutBesoin = (e) => {
    e.preventDefault();
    console.log("Besoinajout", newBesoin)
    dispatch(createBesoin(newBesoin)).then(res =>
      res.error ? (Swal.fire({
        icon: "error",
        text: "un besoin avec la même catégorie existe déjà. Veuillez modifier uniquement la description du besoin existant "
        })) : "")
        setShowAjoutBesoin(false)
        setNewBesoin({associationId: user.user.id })
  }
  const handleDeleteBesoin = (id) => {
    dispatch(delBesoin(id)).then(res => console.log(res));
    setOpenSuppBesoin(false)
  }
  const handlechangeModifBesoin = (e) => {
    setModifBesoin({ ...modifBesoin, [e.target.name]: e.target.value })
  }
  const handleSubmitModifBesoin = (e) => {
    e.preventDefault();
    console.log("Besoinajout", modifBesoin)
    const obj = {
      idCategorie: modifBesoin.idCategorie,
      id:user?.user.id
    }
    dispatch(findBesoinByCat(obj)).then(res => {
      console.log("rrrr0" + res.payload); 
      if (!res.payload || (res.payload && res.payload.id == modifBesoin.id)) {
        dispatch(updateBesoin(modifBesoin)).then(res =>
          res.error ? (setMessageVerifBesoin("un besoin avec la même catégorie existe déjà. Veuillez modifier uniquement la description du besoin existant "), setOpenSnackbar(true)) : (console.log({ "data": res }), setOpenSnackbar(false)))
        setShowModifBesoin(false)
        setModifBesoin({ associationId: user.user.id })

      } else {
        Swal.fire(
          {
            icon: "error",
            text: "Le nom du catégorie que vous avez spécifié est déjà utilisé pour une autre existante. Veuillez choisir un nom différent"
          })
      }
    })

  }

  
  const validationSchema = ((user && user.user?.role == "association") || user?.donateur) ? yup.object({
    nom: yup
      .string('Entrez votre nom')
      .required("Le nom est obligatoire"),
    adresse: yup
      .string('Entrer votre adresse')
      .required("l'adresse est obligatoire"),
    email: yup
      .string('Entrer votre email')
      .email('Veuillez saisir une adresse e-mail valide')
      .required("l'email est obligatoire"),
    numTelephone: yup
      .string('Entrer le numéro du téléphone')
      .matches(/^[0-9]*$/, 'Le numéro ne peut contenir que des chiffres')
      .matches(/^[0-9]{8}$/, 'Le numéro doit contenir exactement 8 chiffres')
      .required('le numéro est obligatoire'),
    ville: yup
      .string('Entrez votre ville')
      .matches(/^[a-zA-ZÀ-ÿ\s]*$/, 'La ville ne doit pas contenir de nombres')
      .required('Votre ville est obligatoire'),
    nomResponsable: yup
      .string('Entrer le nom du responsable')
      .required('le nom du responsable est obligatoire'),
  }) : yup.object({
    nom: yup
      .string('Entrez votre nom')
      .required("Le nom est obligatoire"),
    adresse: yup
      .string('Entrer votre adresse')
      .required("l'adresse est obligatoire"),
    email: yup
      .string('Entrer votre email')
      .email('Veuillez saisir une adresse e-mail valide')
      .required("l'email est obligatoire"),
    numTelephone: yup
      .string('Entrer le numéro du téléphone ')
      .matches(/^[0-9]*$/, 'Le numéro ne peut contenir que des chiffres')
      .matches(/^[0-9]{8}$/, 'Le numéro doit contenir exactement 8 chiffres')
      .required('le numéro est obligatoire'),
    ville: yup
      .string('Entrez votre ville')
      .matches(/^[a-zA-ZÀ-ÿ\s]*$/, 'La ville ne doit pas contenir de nombres')
      .required('Votre ville est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      nom: (user && user.user) ? userModif?.user?.nom : (user && user.donateur) ? userModif?.donateur.user?.nom : "",
      adresse: (user && user.user) ? userModif.adresse : (user && user.donateur) ? userModif.donateur.adresse : "",
      email: (user && user.user) ? userModif?.user?.email : (user && user.donateur) ? userModif?.donateur.user?.email : "",
      numTelephone: (user && user.user) ? userModif.numTelephone : (user && user.donateur) ? userModif.donateur.numTelephone : "",
      ville: (user && user.user) ? user.ville : (user && user.donateur) ? userModif.donateur.ville : "",
      nomResponsable: (user && user.user) ? user.nomResponsable : (user && user.donateur) ? user.nomResponsable : ""
    },
    validationSchema,
    onSubmit: handleSubmit,
  });
  return (
    <>
      {messageVerifBesoin &&
        <Snackbar open={openSnackbar} autoHideDuration={6000} // Durée en millisecondes
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={() => setOpenSnackbar(false)} // Gère la fermeture du Snackbar
        >
          <Alert severity="error">{messageVerifBesoin}{"  "}</Alert>
        </Snackbar>
      }
      <div className="container m-3" >
        <div className='row'>
          <div className='col-5'>
            <img style={{ borderRadius: '50%', width: '200px', height: '200px', marginLeft: "80px" }} className="circular-image" src={(user && user.user) ? user.user.image : (user && user.donateur) ? user.donateur.user.image : ""} alt="Votre Image" />
          </div>
          <div className='col-6' style={{marginTop:"-10px"}}>
            <table class="table">
              <tbody>
                <tr><td> <i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} className="fa-solid fa-user"></i> Nom :</td> <td> {(user && user.user) ? user.user.nom : (user && user.donateur) ? user.donateur.user.nom : ""}</td></tr>
                {((user && user.user?.role == "association") || user?.donateur) && <tr><td> <i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} className="fa-solid fa-user"></i> Nom du responsable :</td> <td> {(user && user.user) ? user.nomResponsable : (user && user.donateur) ? user.nomResponsable : ""}</td></tr>}
                <tr><td><i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} className="fa-solid fa-envelope"></i> Email :</td><td> {(user && user.user) ? user.user.email : (user && user.donateur) ? userModif.donateur.user.email : ""}</td></tr>
                <tr><td><i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} class="fa-solid fa-city" ></i> Ville :</td><td> {(user && user.user) ? user.ville : (user && user.donateur) ? userModif.donateur.ville : ""}</td></tr>
                <tr><td><i class="fa-solid fa-map-marker-alt" style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} ></i> Adresse :</td> <td>{(user && user.user) ? user.adresse : (user && user.donateur) ? user.donateur.adresse : ""} </td></tr>
                <tr><td><i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} className="fa-solid fa-phone"></i> Téléphone :</td> <td>{(user && user.user) ? user.numTelephone : (user && user.donateur) ? user.donateur.numTelephone : ""}</td></tr>
               {( user?.donateur) &&  <tr><td><i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} className="fa-solid fa-gift"></i> Nombre d'objets</td> <td>{(user && user.donateur) ? <> <i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} className="fa-solid fa-gift"></i>{" :  "}{user.donateur.nbObjetsDonnes}</> : ""}<strong style={{marginLeft:"60px"}}> </strong> 
              <i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} className="fa-solid fa-wrench"></i>{" : "}
               {+user.nbObjetsRepares }</td></tr>
               }
               {(user && user.user?.role == "donateur") &&  <tr><td><i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} className="fa-solid fa-gift"></i> Nombre d'objets donnés :</td> <td>{user.nbObjetsDonnes}</td></tr>
               }
               <tr><td><i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} className="fa-solid fa-calendar-days"></i> Membre depuis le :</td><td>{user && new Date(user.createdAt).toISOString().split('T')[0]}</td></tr>
              </tbody>
            </table>

          </div>

        </div>
        <Button style={{ marginLeft: "800px", marginTop: "10px", backgroundColor: "grey" }} onClick={() => { setShow(true) }} >Modifier</Button>
        {(user && user.user?.role === "association") ? (<div style={{ margin: "10px" }} >
          <Typography variant="h7" gutterBottom style={{ textAlign: "center" }}>
            Lorsque vous spécifiez vos besoins, vous recevez une notification pour chaque nouvel objet publié qui correspond à vos critères.
            <p><a style={{ color: "rgba(85, 139, 160, 1)", textDecorationLine: 'underline' }} onClick={() => setShowBesoin(true)}>Consulter vos besoins </a></p>
          </Typography>
        </div>) : <></>}
      </div>

      <hr class="MuiDivider-root">
      </hr>
      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton>
            <h3 style={{ fontFamily: 'serif' }}>Modifier Votre Compte </h3>
          </Modal.Header>
          <Modal.Body >
            <div className="container w-100 d-flex justify-content-center">
              <div>
                <div className='form '>
                  <Row className="mb-2">
                    <Form.Group as={Col} md={user?.user?.role == "donateur" ? "15" : "6"} >
                      <Form.Label style={{ fontFamily: 'serif', fontSize: '18px' }} >Nom :</Form.Label>
                      <Form.Control
                        style={{ width: user?.user?.role == "donateur" && "100%" }}
                        required
                        type="text"
                        placeholder="Nom"
                        name="nom"
                        defaultValue={(user && user.user) ? userModif?.user?.nom : (user && user.donateur) ? userModif?.donateur.user?.nom : ""}
                        onChange={(e) => {
                          handlechange(e); // Vous pouvez toujours appeler votre propre logique de gestion des changements ici
                          formik.handleChange(e); // Utilisez la méthode handleChange de Formik pour mettre à jour les valeurs du formulaire
                        }}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.nom && Boolean(formik.errors.nom)} // Utilisez isInvalid pour indiquer l'état invalide
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.nom}
                      </Form.Control.Feedback>
                    </Form.Group>
                    {((user && user.user?.role == "association") || user?.donateur) &&
                      <Form.Group as={Col} md="6" >
                        <Form.Label style={{ fontFamily: 'serif', fontSize: '18px' }} > Nom du responsable : </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          placeholder="Nom du responsable"
                          name="nomResponsable"
                          defaultValue={(user && user.user) ? user.nomResponsable : (user && user.donateur) ? user.nomResponsable : ""}
                          onChange={(e) => {
                            handlechange(e); // Vous pouvez toujours appeler votre propre logique de gestion des changements ici
                            formik.handleChange(e); // Utilisez la méthode handleChange de Formik pour mettre à jour les valeurs du formulaire
                          }}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.nomResponsable && Boolean(formik.errors.nomResponsable)} // Utilisez isInvalid pour indiquer l'état invalide
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.nomResponsable}
                        </Form.Control.Feedback>
                      </Form.Group>}


                  </Row>
                  <Row className="mb-2">
                    <Form.Group as={Col} md="6">
                      <Form.Label style={{ fontFamily: 'serif', fontSize: '18px' }} >Ville </Form.Label>
                      <Form.Control
                        type="text"
                        name="ville"
                        placeholder="Ville"
                        defaultValue={(user && user.user) ? user.ville : (user && user.donateur) ? userModif.donateur.ville : ""}
                        onChange={(e) => {
                          handlechange(e); // Vous pouvez toujours appeler votre propre logique de gestion des changements ici
                          formik.handleChange(e); // Utilisez la méthode handleChange de Formik pour mettre à jour les valeurs du formulaire
                        }}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.ville && Boolean(formik.errors.ville)} // Utilisez isInvalid pour indiquer l'état invalide
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.ville}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label style={{ fontFamily: 'serif', fontSize: '18px' }}>Adresse </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name={"adresse"}
                        placeholder="Adresse"
                        defaultValue={(user && user.user) ? userModif.adresse : (user && user.donateur) ? userModif.donateur.adresse : ""}
                        onChange={(e) => {
                          handlechange(e); // Vous pouvez toujours appeler votre propre logique de gestion des changements ici
                          formik.handleChange(e); // Utilisez la méthode handleChange de Formik pour mettre à jour les valeurs du formulaire
                        }}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.adresse && Boolean(formik.errors.adresse)} // Utilisez isInvalid pour indiquer l'état invalide
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.adresse}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="col-md-6">
                      <Form.Label style={{ fontFamily: 'serif', fontSize: '18px' }}>Email :</Form.Label>
                      <InputGroup hasValidation>
                        <Form.Control
                          type="email"
                          required
                          name="email"
                          placeholder="Email"
                          defaultValue={(user && user.user) ? userModif?.user?.email : (user && user.donateur) ? userModif.donateur.user?.email : ""}
                          onChange={(e) => {
                            handlechange(e); // Vous pouvez toujours appeler votre propre logique de gestion des changements ici
                            formik.handleChange(e); // Utilisez la méthode handleChange de Formik pour mettre à jour les valeurs du formulaire
                          }}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.email && Boolean(formik.errors.email)} // Utilisez isInvalid pour indiquer l'état invalide
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.email}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label style={{ fontFamily: 'serif', fontSize: '18px' }}>Téléphone</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="numéro de téléphone"
                        name="numTelephone"
                        defaultValue={(user && user.user) ? userModif.numTelephone : (user && user.donateur) ? userModif.donateur.numTelephone : ""}
                        onChange={(e) => {
                          handlechange(e); // Vous pouvez toujours appeler votre propre logique de gestion des changements ici
                          formik.handleChange(e); // Utilisez la méthode handleChange de Formik pour mettre à jour les valeurs du formulaire
                        }}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.numTelephone && Boolean(formik.errors.numTelephone)} // Utilisez isInvalid pour indiquer l'état invalide
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.numTelephone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <div style={{ width: "80%", margin: "auto", padding: "1%" }}>
                    <FilePond
                      files={files}
                      acceptedFileTypes="image/*"
                      onupdatefiles={setFiles}
                      allowMultiple={false}
                      server={serverOptions()}
                      name="file"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='solid' color='neutral' size='sm' onClick={() => { handleClose() }} style={{ marginRight: "20px" }}>Annuler</Button>
            <Button variant='outlined' style={{backgroundColor:"rgba(72, 151, 90, 0.68)",borderColor:"rgba(72, 151, 90, 0.68)", color:"white"}} size='sm'  type="submit" disabled={loading}>Enregistrer</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* modal des besoins */}
      <Modal show={showBesoin} onHide={() => setShowBesoin(false)} className="modal-with-scroll" size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: "inherit", fontSize: "20px" }}>Gérer Vos Besoins</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <IconButton onClick={() => { setShowAjoutBesoin(true) }}><Add style={{ color: "rgba(72, 151, 90, 0.68)" }} /><Typography variant="h6" style={{ color: "rgba(72, 151, 90,1)" }} >Nouveau</Typography></IconButton>
          {
            besoins && besoins.length > 0 && besoins.map(besoin => (
              <ListItem >
                <Card style={{ width: '100%', height: '130px' }}>
                  <CardContent>
                    <Row>
                      <Col>
                        <div style={{ marginRight: '10px', marginTop: '15px' }}>
                          <Typography variant="h6"><span style={{ color: "black" }}>Catégorie:</span>  {besoin.categorie.nom}</Typography>
                          <Typography variant="body2"> <span style={{ color: "black" }}>Date :</span>  {new Date(besoin.createdAt).toISOString().split('T')[0]}</Typography>

                        </div>
                      </Col>
                      <Col>
                        <div style={{ marginTop: '-15px' }} >
                          <Typography variant='h6' style={{ margin: "3px" }}>  <span style={{ color: "black" }}>Description:</span>  </Typography>
                          <Textarea style={{ width: '300px', height: '80px', backgroundColor: "white" }} value={besoin.description} readOnly />
                        </div>
                      </Col>
                      <Col>
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => { setOpenSuppBesoin(true), setIdBesoin(besoin.id) }}><i class="fa-solid fa-trash-can" style={{ color: "#c80418" }}></i></IconButton>
                          <IconButton onClick={() => { setShowModifBesoin(true), setModifBesoin(besoin) }}><Edit /></IconButton>
                        </ListItemSecondaryAction>
                      </Col>
                    </Row>
                  </CardContent>
                </Card>
              </ListItem>

            ))}
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ backgroundColor: "rgba(72, 151, 90, 0.68)", borderColor: "rgba(72, 151, 90, 0.68)" }} onClick={() => setShowBesoin(false)} >
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
      {/* modal d'ajout d'un besoin */}
      <Modal show={showAjoutBesoin} onHide={() => setShowAjoutBesoin(false)} centered>
        <Form onSubmit={handleSubmitAjoutBesoin}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontFamily: "inherit", fontSize: "20px" }}> Ajout d'un besoin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "black", fontSize: "17px" }}>Catégorie :</Form.Label>
                  <Form.Control
                    required
                    as="select"
                    type="select"
                    value={Number(newBesoin.idCategorie)}
                    name="idCategorie"
                    onChange={(e) => handlechangeAjoutBesoin(e)}

                  >
                    <option value={""}>Choissisez une catégorie</option>
                    {!isLoading
                      ? categories.map((cat) => (
                        <option key={Number(cat.id)} value={Number(cat.id)}>
                          {cat.nom}
                        </option>
                      ))
                      : null}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label style={{ color: "black", fontSize: "17px" }}>Description :</Form.Label>
                  <Textarea
                    required
                    type="text"
                    placeholder="Description"
                    name="description"
                    value={newBesoin.description}
                    onChange={(e) => handlechangeAjoutBesoin(e)}
                    style={{ width: '440px', height: '130px' }}
                  />
                  {erreurCat && (
                    <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      erreurCat
                    </div>
                  )}
                </Form.Group>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outlined" color='danger' style={{ marginRight: '20px' }} onClick={() => setShowAjoutBesoin(false)} >Annuler</Button>
            <Button variant="outlined" color='success' type="submit" >Enregistrer</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* modal de modification d'un besoin */}
      <Modal show={showModifBesoin} onHide={() => setShowModifBesoin(false)} centered>
        <Form onSubmit={handleSubmitModifBesoin}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontFamily: "inherit", fontSize: "20px" }}>Modification d'un besoin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "black", fontSize: "17px" }}>Catégorie :</Form.Label>
                  <Form.Control
                    required
                    as="select"
                    type="select"
                    value={Number(modifBesoin.idCategorie)}
                    name="idCategorie"
                    onChange={(e) => handlechangeModifBesoin(e)}
                  >
                    <option value={""}>Choissisez une catégorie</option>
                    {!isLoading
                      ? categories.map((cat) => (
                        <option key={Number(cat.id)} value={Number(cat.id)}>
                          {cat.nom}
                        </option>
                      ))
                      : null}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label style={{ color: "black", fontSize: "17px" }}>Description :</Form.Label>
                  <Textarea
                    required
                    type="text"
                    placeholder="Description"
                    name="description"
                    value={modifBesoin.description}
                    onChange={(e) => handlechangeModifBesoin(e)}
                    style={{ width: '440px', height: '130px' }}
                  />
                </Form.Group>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outlined" color='neutral' style={{ marginRight: '20px' }} onClick={() => setShowModifBesoin(false)} >Annuler</Button>
            <Button variant="outlined" color='danger' type="submit" >Enregistrer</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* modal de suppression d'un besoin */}
      <Modal show={openSuppBesoin} onHide={() => setOpenSuppBesoin(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Attention</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ fontSize: "16px" }}> Êtes-vous sûr de vouloir supprimer cet besoin ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outlined" color='neutral' style={{ marginRight: '20px',height:"35px" }} onClick={() => setOpenSuppBesoin(false)}>
            Annuler
          </Button>
          <Button variant="outlined" color='danger' style={{height:"35px"}} onClick={() => handleDeleteBesoin(idBesoin)}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}