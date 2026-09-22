import React, { useState } from 'react'
import { Col, Container, Form, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../features/AuthSlice';
import * as yup from 'yup';
import { useFormik } from 'formik';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Alert, Snackbar, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { findUtilisateurByIdentifiant, findUtilisateurByNom, findUtilisateurByNum } from '../../features/utilisateurSlice';
const MySwal = withReactContent(Swal)
const Inscription = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [type, setType] = useState("donateur")
  const [val, setVal] = useState(1)
  const [image, setImage] = useState("https://res.cloudinary.com/dmbkofiro/image/upload/v1708631085/images/pkbirqapn20hltqq50xg.jpg")
  const [password2, setPassword2] = useState("")
  const [newUser, setNewUser] = useState({ role: "donateur" })
  const handlechange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value })
  }
  const [showPassword, setShowPassword] = React.useState(false);
  const [message, setMessage] = useState("");
  const [messageAlert, setMessageAlert] = useState("");
  const [openSnack,setOpenSnack]=useState(true)
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  /* const [nom,setNom]=useState("")
 const [adresse,setAdresse]=useState("")
 const [email, setEmail] = useState("");
 const [motDePasse, setMotDePasse] = useState("");*/
const handleCloseSnack =()=>{
  setOpenSnack(false)
}
  const { user, isSuccess, isError, isLoggedIn } = useSelector((state) => state.auth);
  const handleSubmit = () => {
    console.log(motDePasse)
    console.log(password2)
    if (newUser.motDePasse !== password2) {
      alert('Les mots de passe ne correspondent pas')
    } else {
      if(newUser.role==="association"|| newUser.role==="entreprise"){
        const obj={
          nom:newUser.nom
        }
        const objet ={
          numTelephone:newUser.numTelephone,
          role:newUser.role
        }
        const objIdentifinat={
          identifiant:newUser.identifiant,
          role:newUser.role
        }
       console.log(newUser);
        dispatch(findUtilisateurByNom(obj)).then(resNom=>{ console.log("resss",resNom.payload);
        if(!resNom.payload){ 
          dispatch(findUtilisateurByIdentifiant(objIdentifinat)).then(resId=>{ console.log("resss",resId.payload);
          if(!resId.payload){ 
        dispatch(findUtilisateurByNum(objet)).then(resNum=>{ console.log("resssNum",resNum.payload);
        if(!resNum.payload){
          dispatch(register(newUser)).then(res => {
            console.log(res);
            if (!res.error) {
              if (res.payload.user?.user?.role == "donateur") {
                setMessage("Un e-mail d'activation de compte vous a été envoyé. Veuillez vérifier votre boîte de réception et suivre les instructions pour activer votre compte")
              } else if (res.payload.user?.user?.role == "association" || res.payload.user?.donateur?.user.role == "entreprise") {
                setMessage("Nous vous remercions pour votre inscription ! Votre compte est actuellement en cours de validation par l'administrateur. Dès que celui-ci aura validé votre compte, vous recevrez un e-mail de confirmation. Nous vous prions de patienter et vous remercions pour votre compréhension.")
              }
            } 
            else {
              if (res.payload && res.payload.response && res.payload.response.data && res.payload.response.data.message) {
                setMessageAlert(res.payload.response.data.message);
              } else if (res.payload && res.payload.message) {
                setMessageAlert(res.payload.message);
              } else {
                setMessageAlert("ce Compte existe déja. vérifier votre email");
              }
            }
            //console.log(JSON.stringify(res.payload.user.user.role))
          });
         }
        else{
          setMessageAlert("le numéro du téléphone est déja utilisé. vérifier votre Numéro");
        }
      })
          }
          else{
            setMessageAlert("l'identifiant existe déja !");
          }
        })
   }
  else{
    setMessageAlert("le nom existe déja. vérifier votre Nom");
  }
  })
    }else{
      const objet ={
        numTelephone:newUser.numTelephone,
        role:newUser.role
      }
      dispatch(findUtilisateurByNum(objet)).then(resNum=>{ console.log("resssNum",resNum.payload);
        if(!resNum.payload){
        dispatch(register(newUser)).then(res => {
          console.log(res);
          /*if (isLoggedIn  && !user.donateur && user.user.role === "administrateur") {
            navigate("/admin");
          } else if (((isLoggedIn && !user.donateur) && user.user.role !== "administrateur")  ) {
            navigate("/accueil");
          } else {
            navigate("/accueil");
          }*/
          if (!res.error) {
            if (res.payload.user?.user?.role == "donateur") {
              setMessage("Un e-mail d'activation de compte vous a été envoyé. Veuillez vérifier votre boîte de réception et suivre les instructions pour activer votre compte")
            } else if (res.payload.user?.user?.role == "association" || res.payload.user?.donateur?.user.role == "entreprise") {
              setMessage("Nous vous remercions pour votre inscription ! Votre compte est actuellement en cours de validation par l'administrateur. Dès que celui-ci aura validé votre compte, vous recevrez un e-mail de confirmation.")
            }
          } else {
            if (res.payload && res.payload.response && res.payload.response.data && res.payload.response.data.message) {
              setMessageAlert(res.payload.response.data.message);
            } else if (res.payload && res.payload.message) {
              setMessageAlert(res.payload.message);
            } else {
              setMessageAlert("ce Compte existe déja. vérifier votre email");
            }
          }
          //console.log(JSON.stringify(res.payload.user.user.role))
        });}
        else {
          setMessageAlert("le numéro du téléphone est déja utilisé. vérifier votre Numéro");
        }
      })
      }
      //console.log(newUser)
      //  navigate('/accueil')

    }
  };
  /* React.useEffect(() => {
     // if (isLoggedIn  && !user.donateur && user.user.role === "administrateur") {
     //   navigate("/admin");
     // } else if ((isLoggedIn && !user.donateur && user.user.role !== "administrateur")  ) {
     //   navigate("/accueil");
     // } else if(isLoggedIn && user.donateur && user.donateur.user.role==="entreprise"){
     //   navigate("/accueil");
     // }
   }, [navigate, isLoggedIn])*/

  const [validationSchema, setValidationSchema] = useState(yup.object({
    email: yup
      .string('Entrez votre adresse e-mail')
      .email('Veuillez saisir une adresse e-mail valide')
      .required("L'adresse e-mail est obligatoire"),
    nom: yup
      .string('Entrer votre nom')
      .required('votre nom est obligatoire'),
    ville: yup
      .string('Entrez votre ville')
      .matches(/^[a-zA-ZÀ-ÿ\s]*$/, 'La ville ne doit pas contenir de nombres')
      .required('Votre ville est obligatoire'),
    numTelephone: yup
      .string('Entrer votre numéro du téléphone')
      .matches(/^[0-9]*$/, 'Le numéro ne peut contenir que des chiffres')
      .matches(/^[0-9]{8}$/, 'Le numéro doit contenir exactement 8 chiffres')
      .required('Votre numéro est obligatoire'),
    adresse: yup
      .string('Entrer votre adresse')
      .required('Votre adresse est obligatoire'),
    motDePasse: yup
      .string('Entrer votre mot de passe')
      .required('Votre mot de passe est obligatoire'),
    // identifiant : yup
    //     .string('Entrer votre identifiant')
    //     .required('Votre identifiant est obligatoire'),
    // nomResponsable : yup
    //     .string('Entrer le nom du responsable')
    //     .required('le nom du responsable est obligatoire')
  }));
  const formik = useFormik({
    initialValues: {
      email: '',
      nom: '',
      ville: '',
      numTelephone: '',
      adresse: '',
      motDePasse: '',
      identifiant: '',
      nomResponsable: ''
    },
    validationSchema: validationSchema,
    onSubmit: (valeurs) => {
      console.log(JSON.stringify(valeurs));
      handleSubmit();
    },
  });
  return (

    <Container fluid style={{ height: '115vh', boxShadow: '4px 4px 8px 8px rgba(0,0,0,0.2)', }}>
      {message && (
        Swal.fire({
          icon: 'success',
          text: message,
          showCancelButton: false,
          confirmButtonText: 'D\'accord',
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirection vers "/accueil"
            window.location.href = '/accueil';
            // navigate('/accueil')
          }
        })
      )}
      {
        messageAlert &&
        <Snackbar open={openSnack}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handleCloseSnack}>
          <Alert onClose={handleCloseSnack} severity="error">{messageAlert}{"   "}
          </Alert>
        </Snackbar>
      }
      <Row style={{ height: '100%' }}>
        {/* Partie avec la photo */}
        <Col md={6} style={{ height: '99%', overflow: 'hidden', marginBottom: "10px" }}>
          <img
            src={image}
            alt="Illustration"
            className="img-fluid"
            style={{ width: '100%', height: '100%', objectFit: 'cover', boxShadow: "4px 4px 16px -5px rgba(0, 0, 0, 0.68)" }}
          />
        </Col>

        {/* Partie avec le formulaire */}

        <Col md={6} style={{ width: '40%', height: '80%', display: 'flex', alignItems: 'center', marginTop: '50px', marginRight: '50px', marginLeft: '50px', border: 'solid 2px #deb887', borderColor: '#deb887' }} >
          <div style={{ width: '100%', margin: '0px', marginTop: '1px' }}>


            <Form onSubmit={formik.handleSubmit} style={{ width: '90%', margin: 'auto', border: '4px' }}>

              {(type == "association" && val == 1) && (
                <div>
                <Typography  variant='h4' gutterBottom  style={{ marginLeft: "40px", padding: "6px" ,marginTop:"-50px",marginBottom:"35px"}}> <Link style={{color:"black"}} to={'/'}>Bienvenue association </Link> </Typography> 
                  <div className='row mb-3 mt-1' >
                    <div className='col-4 '>
                      <Form.Label>Votre fonction :</Form.Label>
                    </div>
                    <div className='col'>
                      <ButtonGroup color="neutral" disabled={false} orientation="horizontal"  variant="outlined"   >
                        <Button onClick={(e) => {
                          setType("donateur")
                          setImage("https://res.cloudinary.com/dmbkofiro/image/upload/v1708631085/images/pkbirqapn20hltqq50xg.jpg")
                          setNewUser({ ...newUser, role: "donateur" })
                          setValidationSchema(yup.object({
                            email: yup
                              .string('Entrez votre adresse e-mail')
                              .email('Veuillez saisir une adresse e-mail valide')
                              .required("L'adresse e-mail est obligatoire"),
                            nom: yup
                              .string('Entrer votre nom')
                              .required('votre nom est obligatoire'),
                            ville: yup
                              .string('Entrez votre ville')
                              .matches(/^[a-zA-ZÀ-ÿ\s]*$/, 'La ville ne doit pas contenir de nombres')
                              .required('Votre ville est obligatoire'),
                            numTelephone: yup
                              .string('Entrer votre numéro du téléphone')
                              .matches(/^[0-9]*$/, 'Le numéro ne peut contenir que des chiffres')
                              .matches(/^[0-9]{8}$/, 'Le numéro doit contenir exactement 8 chiffres')
                              .required('Votre numéro est obligatoire'),
                            adresse: yup
                              .string('Entrer votre adresse')
                              .required('Votre adresse est obligatoire'),
                            motDePasse: yup
                              .string('Entrer votre mot de passe')
                              .required('Votre mot de passe est obligatoire'),
                            // identifiant : yup
                            //     .string('Entrer votre identifiant')
                            //     .required('Votre identifiant est obligatoire'),
                            // nomResponsable : yup
                            //     .string('Entrer le nom du responsable')
                            //     .required('le nom du responsable est obligatoire')
                          }))
                        }}>Donateur</Button>
                        <Button disabled onClick={(e) => {
                          setType("association")
                          setImage("https://res.cloudinary.com/dmbkofiro/image/upload/v1708681297/images/vc7o4bc7duufjbdgi5kb.jpg")
                          setNewUser({ ...newUser, role: "association" })
                          setValidationSchema(yup.object({
                            email: yup
                              .string('Entrez votre adresse e-mail')
                              .email('Veuillez saisir une adresse e-mail valide')
                              .required("L'adresse e-mail est obligatoire"),
                            nom: yup
                              .string('Entrer votre nom')
                              .required('votre nom est obligatoire'),
                            ville: yup
                              .string('Entrez votre ville')
                              .matches(/^[a-zA-ZÀ-ÿ\s]*$/, 'La ville ne doit pas contenir de nombres')
                              .required('Votre ville est obligatoire'),
                            numTelephone: yup
                              .string('Entrer votre numéro du téléphone')
                              .matches(/^[0-9]*$/, 'Le numéro ne peut contenir que des chiffres')
                              .matches(/^[0-9]{8}$/, 'Le numéro doit contenir exactement 8 chiffres')
                              .required('Votre numéro est obligatoire'),
                            adresse: yup
                              .string('Entrer votre adresse')
                              .required('Votre adresse est obligatoire'),
                            motDePasse: yup
                              .string('Entrer votre mot de passe')
                              .required('Votre mot de passe est obligatoire'),
                            identifiant: yup
                              .string('Entrer votre identifiant')
                              .required('Votre identifiant est obligatoire'),
                            nomResponsable: yup
                              .string('Entrer le nom du responsable')
                              .required('le nom du responsable est obligatoire')
                          }))
                        }}>Association</Button>
                        <Button onClick={(e) => {
                          setType("entreprise")
                          setImage("https://res.cloudinary.com/dmbkofiro/image/upload/v1708681805/images/xzqbb8rxx2jbzaezz6ox.jpg")
                          setNewUser({ ...newUser, role: "entreprise" })
                          setValidationSchema(yup.object({
                            email: yup
                              .string('Entrez votre adresse e-mail')
                              .email('Veuillez saisir une adresse e-mail valide')
                              .required("L'adresse e-mail est obligatoire"),
                            nom: yup
                              .string('Entrer votre nom')
                              .required('votre nom est obligatoire'),
                            ville: yup
                              .string('Entrez votre ville')
                              .matches(/^[a-zA-ZÀ-ÿ\s]*$/, 'La ville ne doit pas contenir de nombres')
                              .required('Votre ville est obligatoire'),
                            numTelephone: yup
                              .string('Entrer votre numéro du téléphone')
                              .matches(/^[0-9]*$/, 'Le numéro ne peut contenir que des chiffres')
                              .matches(/^[0-9]{8}$/, 'Le numéro doit contenir exactement 8 chiffres')
                              .required('Votre numéro est obligatoire'),
                            adresse: yup
                              .string('Entrer votre adresse')
                              .required('Votre adresse est obligatoire'),
                            motDePasse: yup
                              .string('Entrer votre mot de passe')
                              .required('Votre mot de passe est obligatoire'),
                            identifiant: yup
                              .string('Entrer votre identifiant')
                              .required('Votre identifiant est obligatoire'),
                            nomResponsable: yup
                              .string('Entrer le nom du responsable')
                              .required('le nom du responsable est obligatoire')
                          }))
                        }}>Entreprise</Button>
                      </ButtonGroup>
                    </div>
                  </div>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="nom"
                    label="Nom"
                    name="nom"
                    value={newUser.nom}
                    autoComplete="text"
                    onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.nom && Boolean(formik.errors.nom)}
                    helperText={formik.touched.nom && formik.errors.nom}
                    //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="identifiant"
                    label="Identifiant"
                    name="identifiant"
                    value={newUser.identifiant}
                    autoComplete="text"
                    onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.identifiant && Boolean(formik.errors.identifiant)}
                    helperText={formik.touched.identifiant && formik.errors.identifiant}
                   // inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                    />
                    
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="nom"
                    label="Nom Du Responsable"
                    name="nomResponsable"
                    value={newUser.nomResponsable}
                    autoComplete="text"
                    onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.nomResponsable && Boolean(formik.errors.nomResponsable)}
                    helperText={formik.touched.nomResponsable && formik.errors.nomResponsable}
                    //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                    />
                  <Form.Group>

                  </Form.Group>
              <Button variant="outlined" color="neutral" onClick={(e) => { setVal(val + 1) }} style={{ marginTop: '10px', marginLeft: '380px' }} >next</Button>
              <div style={{  textAlign:'center',marginTop:'20px'}}>
              <Link to={'/login'} style={{color:'rgba(129, 97, 26, 1)'}}>Vous avez déjà un compte ? Connectez-vous</Link>
               </div> 
               </div>

              )}
              {(type == "association" && val == 2) &&
                (<div>

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="ville"
                    label="Ville"
                    name="ville"
                    autoComplete="text"
                    value={newUser.ville}
                    autoFocus
                    onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.ville && Boolean(formik.errors.ville)}
                    helperText={formik.touched.ville && formik.errors.ville}
                    //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="adresse"
                    label="Adresse"
                    name="adresse"
                    value={newUser.adresse}
                    autoComplete="text"
                    onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.adresse && Boolean(formik.errors.adresse)}
                    helperText={formik.touched.adresse && formik.errors.adresse}
                   // inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                  />
                  <TextField
                    margin="normal"
                    //required
                    fullWidth
                    id="numDeTelephone"
                    label="Numéro du Téléphone"
                    name="numTelephone"
                    value={newUser.numTelephone}
                    autoComplete="number"
                    onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.numTelephone && Boolean(formik.errors.numTelephone)}
                    helperText={formik.touched.numTelephone && formik.errors.numTelephone}
                    //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    value={newUser.email}
                    autoComplete="email"
                    onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                   // inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    type='password'
                    id="motDePasse"
                    label="Mot De Passe"
                    name="motDePasse"
                    value={newUser.motDePasse}
                    autoComplete="password"
                    onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.motDePasse && Boolean(formik.errors.motDePasse)}
                    helperText={formik.touched.motDePasse && formik.errors.motDePasse}
                    //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}                  
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    type='password'
                    id="motDePasse2"
                    label="Confirmer votre mot de passe"
                    name="motDePasse"
                    autoComplete="password"
                    onChange={(e) => { setPassword2(e.target.value) }}
                    //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                  />
                  <Button variant="outlined" color="neutral" onClick={(e) => setVal(val - 1)} style={{ marginTop: '10px' }}>back</Button>
                  <div style={{ marginTop: '10px', marginLeft: '180px' }}>
                    <Button variant="solid" color="neutral" type="submit" >
                      S'inscrire
                    </Button>

                  </div>

                </div>)}
              {(type == "entreprise" && val == 1) &&

                <div>
                <Typography  variant='h4' gutterBottom  style={{ marginLeft: "40px", padding: "6px" ,marginTop:"-50px",marginBottom:"35px"}}> <Link style={{color:"black"}} to={'/'}>Bienvenue entreprise</Link> </Typography> 
                  <div className='row mb-3 mt-1' >

                    <div className='col-4 '>
                      <Form.Label>Votre fonction :</Form.Label>
                    </div>
                    <div className='col'>
                      <ButtonGroup  color="neutral" disabled={false} orientation="horizontal"  variant="outlined">
                        <Button onClick={(e) => {
                          setType("donateur")
                          setImage("https://res.cloudinary.com/dmbkofiro/image/upload/v1708631085/images/pkbirqapn20hltqq50xg.jpg")
                          setNewUser({ ...newUser, role: "donateur" })
                          setValidationSchema(yup.object({
                            email: yup
                              .string('Entrez votre adresse e-mail')
                              .email('Veuillez saisir une adresse e-mail valide')
                              .required("L'adresse e-mail est obligatoire"),
                            nom: yup
                              .string('Entrer votre nom')
                              .required('votre nom est obligatoire'),
                            ville: yup
                              .string('Entrez votre ville')
                              .matches(/^[a-zA-ZÀ-ÿ\s]*$/, 'La ville ne doit pas contenir de nombres')
                              .required('Votre ville est obligatoire'),
                            numTelephone: yup
                              .string('Entrer votre numéro du téléphone')
                              .matches(/^[0-9]*$/, 'Le numéro ne peut contenir que des chiffres')
                              .matches(/^[0-9]{8}$/, 'Le numéro doit contenir exactement 8 chiffres')
                              .required('Votre numéro est obligatoire'),
                            adresse: yup
                              .string('Entrer votre adresse')
                              .required('Votre adresse est obligatoire'),
                            motDePasse: yup
                              .string('Entrer votre mot de passe')
                              .required('Votre mot de passe est obligatoire'),
                            // identifiant : yup
                            //     .string('Entrer votre identifiant')
                            //     .required('Votre identifiant est obligatoire'),
                            // nomResponsable : yup
                            //     .string('Entrer le nom du responsable')
                            //     .required('le nom du responsable est obligatoire')
                          }))
                        }}>Donateur</Button>
                        <Button onClick={(e) => {
                          setType("association")
                          setImage("https://res.cloudinary.com/dmbkofiro/image/upload/v1708681297/images/vc7o4bc7duufjbdgi5kb.jpg")
                          setNewUser({ ...newUser, role: "association" })
                          setValidationSchema(yup.object({
                            email: yup
                              .string('Entrez votre adresse e-mail')
                              .email('Veuillez saisir une adresse e-mail valide')
                              .required("L'adresse e-mail est obligatoire"),
                            nom: yup
                              .string('Entrer votre nom')
                              .required('votre nom est obligatoire'),
                            ville: yup
                              .string('Entrez votre ville')
                              .matches(/^[a-zA-ZÀ-ÿ\s]*$/, 'La ville ne doit pas contenir de nombres')
                              .required('Votre ville est obligatoire'),
                            numTelephone: yup
                              .string('Entrer votre numéro du téléphone')
                              .matches(/^[0-9]*$/, 'Le numéro ne peut contenir que des chiffres')
                              .matches(/^[0-9]{8}$/, 'Le numéro doit contenir exactement 8 chiffres')
                              .required('Votre numéro est obligatoire'),
                            adresse: yup
                              .string('Entrer votre adresse')
                              .required('Votre adresse est obligatoire'),
                            motDePasse: yup
                              .string('Entrer votre mot de passe')
                              .required('Votre mot de passe est obligatoire'),
                            identifiant: yup
                              .string('Entrer votre identifiant')
                              .required('Votre identifiant est obligatoire'),
                            nomResponsable: yup
                              .string('Entrer le nom du responsable')
                              .required('le nom du responsable est obligatoire')
                          }))
                        }}>Association</Button>
                        <Button disabled onClick={(e) => {
                          setType("entreprise")
                          setImage("https://res.cloudinary.com/dmbkofiro/image/upload/v1708681805/images/xzqbb8rxx2jbzaezz6ox.jpg")
                          setNewUser({ ...newUser, role: "entreprise" })
                          setValidationSchema(yup.object({
                            email: yup
                              .string('Entrez votre adresse e-mail')
                              .email('Veuillez saisir une adresse e-mail valide')
                              .required("L'adresse e-mail est obligatoire"),
                            nom: yup
                              .string('Entrer votre nom')
                              .required('votre nom est obligatoire'),
                            ville: yup
                              .string('Entrez votre ville')
                              .matches(/^[a-zA-ZÀ-ÿ\s]*$/, 'La ville ne doit pas contenir de nombres')
                              .required('Votre ville est obligatoire'),
                            numTelephone: yup
                              .string('Entrer votre numéro du téléphone')
                              .matches(/^[0-9]*$/, 'Le numéro ne peut contenir que des chiffres')
                              .matches(/^[0-9]{8}$/, 'Le numéro doit contenir exactement 8 chiffres')
                              .required('Votre numéro est obligatoire'),
                            adresse: yup
                              .string('Entrer votre adresse')
                              .required('Votre adresse est obligatoire'),
                            motDePasse: yup
                              .string('Entrer votre mot de passe')
                              .required('Votre mot de passe est obligatoire'),
                            identifiant: yup
                              .string('Entrer votre identifiant')
                              .required('Votre identifiant est obligatoire'),
                            nomResponsable: yup
                              .string('Entrer le nom du responsable')
                              .required('le nom du responsable est obligatoire')
                          }))
                        }}>Entreprise</Button>
                      </ButtonGroup>

                    </div>
                  </div>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="nom"
                    label="Nom"
                    name="nom"
                    autoComplete="text"
                    value={newUser.nom}
                    onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.nom && Boolean(formik.errors.nom)}
                    helperText={formik.touched.nom && formik.errors.nom}
                    //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="identifiant"
                    label="Identifiant"
                    name="identifiant"
                    value={newUser.identifiant}
                    autoComplete="text"
                    onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.identifiant && Boolean(formik.errors.identifiant)}
                    helperText={formik.touched.identifiant && formik.errors.identifiant}
                    //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                    />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="nom"
                    label="Nom Du Responsable"
                    name="nomResponsable"
                    value={newUser.nomResponsable}
                    autoComplete="text"
                    onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.nomResponsable && Boolean(formik.errors.nomResponsable)}
                    helperText={formik.touched.nomResponsable && formik.errors.nomResponsable}
                   // inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                  />
                  <Button variant="outlined" color="neutral" onClick={(e) => setVal(val + 1)} style={{ marginTop: '10px', marginLeft: '380px' }}>next</Button>
                  <div style={{  textAlign:'center',marginTop:'20px'}}>
              <Link to={'/login'} style={{color:'rgba(129, 97, 26, 1)'}}>Vous avez déjà un compte ? Connectez-vous</Link>
               </div> 
                </div>}
              {(type == "entreprise" && val == 2) && <div>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="ville"
                  label="Ville"
                  name="ville"
                  value={newUser.ville}
                  autoComplete="text"
                  onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.ville && Boolean(formik.errors.ville)}
                  helperText={formik.touched.ville && formik.errors.ville}
                  //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="adresse"
                  label="Adresse"
                  name="adresse"
                  value={newUser.adresse}
                  autoComplete="text"
                  onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.adresse && Boolean(formik.errors.adresse)}
                  helperText={formik.touched.adresse && formik.errors.adresse} 
                  //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                  />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="numDeTelephone"
                  label="Numéro du Téléphone"
                  name="numTelephone"
                  value={newUser.numTelephone}
                  autoComplete="number"
                  onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.numTelephone && Boolean(formik.errors.numTelephone)}
                  helperText={formik.touched.numTelephone && formik.errors.numTelephone}
                  //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  value={newUser.email}
                  autoComplete="email"
                  type="email"
                  onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="motDePasse"
                  type='password'
                  label="Mot De Passe"
                  name="motDePasse"
                  value={newUser.motDePasse}
                  autoComplete="password"
                  onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.motDePasse && Boolean(formik.errors.motDePasse)}
                  helperText={formik.touched.motDePasse && formik.errors.motDePasse}
                  //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type='password'
                  id="motDePasse2"
                  label="Confirmer votre mot de passe"
                  name="motDePasse"
                  autoComplete="password"
                  onChange={(e) => { setPassword2(e.target.value) }}
                  //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                />
                <Button variant="outlined" color="neutral" onClick={(e) => setVal(val - 1)} style={{ marginTop: '10px' }} >back</Button>
                <div style={{ marginTop: '10px', marginLeft: '180px' }}>
                  <Button variant="solid" color="neutral" type="submit">
                    S'inscrire
                  </Button>

                </div>
              </div>}
              {(type == "donateur" && val == 1) &&

                <div>
                <Typography  variant='h4' gutterBottom  style={{ marginLeft: "40px", padding: "6px" ,marginTop:"-50px",marginBottom:"35px"}}> <Link style={{color:"black"}} to={'/'}>Bienvenue donateur </Link> </Typography> 
                  <div className='row mb-3 mt-1' >
                    <div className='col-4 '>
                      <Form.Label>Votre fonction :</Form.Label>
                    </div>
                    <div className='col'>
                      <ButtonGroup color="neutral" disabled={false} orientation="horizontal"  variant="outlined">
                        <Button disabled onClick={(e) => {
                          setType("donateur")
                          setImage("https://res.cloudinary.com/dmbkofiro/image/upload/v1708631085/images/pkbirqapn20hltqq50xg.jpg")
                          setNewUser({ ...newUser, role: "donateur" })
                          setValidationSchema(yup.object({
                            email: yup
                              .string('Entrez votre adresse e-mail')
                              .email('Veuillez saisir une adresse e-mail valide')
                              .required("L'adresse e-mail est obligatoire"),
                            nom: yup
                              .string('Entrer votre nom')
                              .required('votre nom est obligatoire'),
                            ville: yup
                              .string('Entrez votre ville')
                              .matches(/^[a-zA-ZÀ-ÿ\s]*$/, 'La ville ne doit pas contenir de nombres')
                              .required('Votre ville est obligatoire'),
                            numTelephone: yup
                              .string('Entrer votre numéro du téléphone')
                              .matches(/^[0-9]*$/, 'Le numéro ne peut contenir que des chiffres')
                              .matches(/^[0-9]{8}$/, 'Le numéro doit contenir exactement 8 chiffres')
                              .required('Votre numéro est obligatoire'),
                            adresse: yup
                              .string('Entrer votre adresse')
                              .required('Votre adresse est obligatoire'),
                            motDePasse: yup
                              .string('Entrer votre mot de passe')
                              .required('Votre mot de passe est obligatoire'),
                            // identifiant : yup
                            //     .string('Entrer votre identifiant')
                            //     .required('Votre identifiant est obligatoire'),
                            // nomResponsable : yup
                            //     .string('Entrer le nom du responsable')
                            //     .required('le nom du responsable est obligatoire')
                          }))
                        }}>Donateur</Button>
                        <Button onClick={(e) => {
                          setType("association")
                          setImage("https://res.cloudinary.com/dmbkofiro/image/upload/v1708681297/images/vc7o4bc7duufjbdgi5kb.jpg")
                          setNewUser({ ...newUser, role: "association" })
                          setValidationSchema(yup.object({
                            email: yup
                              .string('Entrez votre adresse e-mail')
                              .email('Veuillez saisir une adresse e-mail valide')
                              .required("L'adresse e-mail est obligatoire"),
                            nom: yup
                              .string('Entrer votre nom')
                              .required('votre nom est obligatoire'),
                            ville: yup
                              .string('Entrez votre ville')
                              .matches(/^[a-zA-ZÀ-ÿ\s]*$/, 'La ville ne doit pas contenir de nombres')
                              .required('Votre ville est obligatoire'),
                            numTelephone: yup
                              .string('Entrer votre numéro du téléphone')
                              .matches(/^[0-9]*$/, 'Le numéro ne peut contenir que des chiffres')
                              .matches(/^[0-9]{8}$/, 'Le numéro doit contenir exactement 8 chiffres')
                              .required('Votre numéro est obligatoire'),
                            adresse: yup
                              .string('Entrer votre adresse')
                              .required('Votre adresse est obligatoire'),
                            motDePasse: yup
                              .string('Entrer votre mot de passe')
                              .required('Votre mot de passe est obligatoire'),
                            identifiant: yup
                              .string('Entrer votre identifiant')
                              .required('Votre identifiant est obligatoire'),
                            nomResponsable: yup
                              .string('Entrer le nom du responsable')
                              .required('le nom du responsable est obligatoire')
                          }))
                        }}>Association</Button>
                        <Button onClick={(e) => {
                          setType("entreprise")
                          setImage("https://res.cloudinary.com/dmbkofiro/image/upload/v1708681805/images/xzqbb8rxx2jbzaezz6ox.jpg")
                          setNewUser({ ...newUser, role: "entreprise" })
                          setValidationSchema(yup.object({
                            email: yup
                              .string('Entrez votre adresse e-mail')
                              .email('Veuillez saisir une adresse e-mail valide')
                              .required("L'adresse e-mail est obligatoire"),
                            nom: yup
                              .string('Entrer votre nom')
                              .required('votre nom est obligatoire'),
                            ville: yup
                              .string('Entrez votre ville')
                              .matches(/^[a-zA-ZÀ-ÿ\s]*$/, 'La ville ne doit pas contenir de nombres')
                              .required('Votre ville est obligatoire'),
                            numTelephone: yup
                              .string('Entrer votre numéro du téléphone')
                              .matches(/^[0-9]*$/, 'Le numéro ne peut contenir que des chiffres')
                              .matches(/^[0-9]{8}$/, 'Le numéro doit contenir exactement 8 chiffres')
                              .required('Votre numéro est obligatoire'),
                            adresse: yup
                              .string('Entrer votre adresse')
                              .required('Votre adresse est obligatoire'),
                            motDePasse: yup
                              .string('Entrer votre mot de passe')
                              .required('Votre mot de passe est obligatoire'),
                            identifiant: yup
                              .string('Entrer votre identifiant')
                              .required('Votre identifiant est obligatoire'),
                            nomResponsable: yup
                              .string('Entrer le nom du responsable')
                              .required('le nom du responsable est obligatoire')
                          }))
                        }}>Entreprise</Button>
                      </ButtonGroup>

                    </div>
                  </div>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="nom"
                    label="Nom"
                    name="nom"
                    value={newUser.nom}
                    autoComplete="text"
                    onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.nom && Boolean(formik.errors.nom)}
                    helperText={formik.touched.nom && formik.errors.nom}
                    //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}                  
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="ville"
                    label="Ville"
                    name="ville"
                    value={newUser.ville}
                    autoComplete="text"
                    onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.ville && Boolean(formik.errors.ville)}
                    helperText={formik.touched.ville && formik.errors.ville} 
                    //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                    />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="adresse"
                    label="Adresse"
                    name="adresse"
                    value={newUser.adresse}
                    autoComplete="text"
                    onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.adresse && Boolean(formik.errors.adresse)}
                    helperText={formik.touched.adresse && formik.errors.adresse}
                    //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                  />

                  <Button variant="outlined" color="neutral" onClick={(e) => setVal(val + 1)} style={{ marginTop: '10px', marginLeft: '380px' }} >next</Button>
                  <div style={{  textAlign:'center',marginTop:'20px'}}>
              <Link to={'/login'} style={{color:'rgba(129, 97, 26, 1)'}}>Vous avez déjà un compte ? Connectez-vous</Link>
               </div> 
                </div>}
              {(type == "donateur" && val == 2) && <div>
                <TextField
                  margin="normal"
                  //required
                  fullWidth
                  id="numDeTelephone"
                  label="Numéro du Téléphone"
                  name="numTelephone"
                  autoComplete="text"
                  value={newUser.numTelephone}
                  autoFocus
                  onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.numTelephone && Boolean(formik.errors.numTelephone)}
                  helperText={formik.touched.numTelephone && formik.errors.numTelephone}
                  //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  value={newUser.email}
                  autoComplete="email"
                  type="email"
                  // onChange={(e)=>{setEmail(e.target.value)}}
                  onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="motDePasse"
                  type='password'
                  label="Mot De Passe"
                  name="motDePasse"
                  value={newUser.motDePasse}
                  autoComplete="password"
                  // onChange={(e)=>{setMotDePasse(e.target.value)}}
                  onChange={(e) => { handlechange(e); formik.handleChange(e) }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.motDePasse && Boolean(formik.errors.motDePasse)}
                  helperText={formik.touched.motDePasse && formik.errors.motDePasse}
                  //inputProps={{ style: { height: '13px', padding:'9px',marginTop:'19px' } }}
                  />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="motDePasse2"
                  type='password'
                  label="Confirmer votre mot de passe"
                  name="motDePasse2"
                  autoComplete="password"
                  onChange={(e) => { setPassword2(e.target.value); }}
                  //inputProps={{ style: { height: '8px', paddingTop:'9px',marginTop:'19px' } }}
                />
                <Button variant="outlined" color="neutral" onClick={(e) => setVal(val - 1)} style={{ marginTop: '10px' }} >back</Button>
                <div style={{ marginTop: '10px', marginLeft: '180px' }}>
                  <Button variant="solid" color="neutral" type="submit">
                    S'inscrire
                  </Button>
                </div>
              </div>

              }
            </Form>
          </div>

        </Col>

      </Row>
    </Container>

  )
}


export default Inscription
