//import Post from "../post/Post";
//import Share from "../share/Share";
//import { Share } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
//import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import "./post.css";

import { DeleteForever, MoreVert, WarningAmberOutlined } from "@mui/icons-material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { findCompteById } from "../../features/utilisateurSlice";
import { Modal, Form, Button, Carousel, Col, Image, Row } from "react-bootstrap";
import { delObjet, getObjetsByDonateur, updateObjet } from "../../features/objetSlice";
import { Alert, Card, CardContent, FormControlLabel, Grid, Radio, RadioGroup, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { green, orange, red } from "@mui/material/colors";
//import { Posts } from "../../dummyData";
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css';

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'

import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { Box, ListDivider, Textarea } from "@mui/joy";
import { getScategories } from "../../features/sousCategorieSlice";
import axios from "axios";
import { Divider } from '@mui/material';
import { delActivite, getActivitesByAssociation, updateActicite } from "../../features/activiteSlice";
import { getDemandeObjetsByObjet } from './../../features/demandeObjetSlice';
import * as yup from 'yup';
import { useFormik } from 'formik';
registerPlugin(FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview)
export default function Feed() {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = React.useState(false);
  const [openSuppActivite, setOpenSuppActivite] = React.useState(false);
  const [openModif, setOpenModif] = React.useState(false);
  const [openModifActivite, setOpenModifActivite] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [files, setFiles] = useState([]);
  const [filesAct, setFilesAct] = useState([]);
  const [idObjet, setIdObjet] = useState()
  const [idActivite, setIdActivite] = useState()
  const [objet, setObjet] = useState({ idDonateur: user && user.id }); // Nouvel état pour stocker l'objet à modifier
  const [activite, setActivite] = useState({ idAssociationA: (user && user.user) && user.user.id });
  const { activites } = useSelector((state) => state.storeActivites);
  const { objets, isLoading, error } = useSelector((state) => state.storeObjets);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [nom, setNom] = useState("")
  const dispatch = useDispatch();

  const serverOptions = () => {
    console.log('server pond');
    return {
      load: (source, load, error, progress, abort, headers) => {
        setFiles([...files, {
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
        console.log(file)
        setLoading(true)
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'aziin_Ecommerce');
        data.append('cloud_name', 'dmbkofiro');
        data.append('public_id', file.name);
        axios.post('https://api.cloudinary.com/v1_1/dmbkofiro/image/upload', data)
          .then((response) => response.data)
          .then((data) => {
            console.log(data);
            setObjet((prevState) => {
              return { ...prevState, image: [...prevState.image, data.url] };
            });
            load(data);
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
  const serverOptionsActivite = () => {
    return {
      load: (source, load, error, progress, abort, headers) => {
        setFilesAct([...filesAct, {
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
        console.log(file)
        setLoading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'aziin_Ecommerce');
        data.append('cloud_name', 'dmbkofiro');
        data.append('public_id', file.name);
        axios.post('https://api.cloudinary.com/v1_1/dmbkofiro/image/upload', data)
          .then((response) => response.data)
          .then((data) => {
            console.log(data);
            setActivite((prevState) => {
              return { ...prevState, image: [...prevState.image, data.url] };
            });
            load(data);
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
  const handlechange = (e) => {
    if (e.target.name == "idSousCategorie") {
      setObjet({ ...objet, [e.target.name]: Number(e.target.value) })
    } else {
      setObjet({ ...objet, [e.target.name]: e.target.value })
    }
  }
  const handlechangeActivite = (e) => {
    setActivite({ ...activite, [e.target.name]: e.target.value })
  }
  const { scategories } = useSelector((state) => state.storeSousCategories);
  const { demandesObjets } = useSelector((state) => state.storeDemandesObjets);
  const [demandes, setDemandes] = useState([]);
  const getDemandes = (id) => {
    dispatch(getDemandeObjetsByObjet(id)).then(err => console.log(err));
    return demandesObjets;
  }
  useEffect(() => {
    let tab = []
    activite.image && activite.image.map((obj, i) => {
      console.log(obj);
      tab = [...tab,
      {
        source: obj.url,
        options: { type: 'local' }
      }
      ]
      setFilesAct([...filesAct,
      {
        source: obj.url,
        options: { type: 'local' }
      }
      ])
    })
    setFilesAct(tab)
  }, [openModifActivite])
  useEffect(() => {
    let tab = []
    objet.image && objet.image.map((obj, i) => {
      console.log(obj);
      tab = [...tab,
      {
        source: obj.url,
        options: { type: 'local' }
      }
      ]
      setFiles([...files,
      {
        source: obj.url,
        options: { type: 'local' }
      }
      ])
    })
    setFiles(tab)
  }, [openModif])
  useEffect(() => {
    /* if(((user && user.user?.role!=="association") || (user && user.donateur?.user?.role!="association")) && (objet))
    objet.image.map(obj=>setFiles( [...files,
       {
       source: obj,
       options: { type: 'local' }
       }
       ]))
       if(user && user.user?.role==="association" && activite) 
       activite.image.map(obj=>setFilesAct( [...filesAct,
         {
         source: obj,
         options: { type: 'local' }
         }
         ]))*/
    dispatch(getActivitesByAssociation(Number(id))).then(res => console.log(res))
    dispatch(getObjetsByDonateur(Number(id)))
      .then(res => {
        res.payload.forEach(obj => {
          dispatch(getDemandeObjetsByObjet(obj.id)).then(err => {
            setDemandes(prevState => ({
              ...prevState,
              [obj.id]: err.payload
            }));
          })
        });
      });
    dispatch(getScategories());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateObjet(objet))
      .then(res => {
        console.log("Insert OK", res.message);
        console.log("l'objet ajouté est :", objet);
        console.log("err", res)
        setObjet({})
        setFiles([])
        setOpenModif(false)
      })
      .catch(error => {
        console.log(error)
        alert("Erreur ! Insertion non effectuée")
      })
  }
  const handleSubmitActivite = (e) => {
    e.preventDefault();
    dispatch(updateActicite(activite))
      .then(res => {
        console.log("Insert OK", res.message);
        console.log("l'objet ajouté est :", activite);
        console.log("err", res)
        setActivite({})
        setFiles([])
        setOpenModifActivite(false)

      })
      .catch(error => {
        console.log(error)
        alert("Erreur ! Insertion non effectuée")
      })
  }
  const filePondRef = useRef(null)
  const handleOnProcessFile = (error, file) => {
    if (error) {
      return;
    }

    // filePondRef.current.removeFile(file);
    console.log(file);
    console.log(files);
    setFiles(files.filter(obj => obj.source != file.source))
    setObjet({ ...objet, image: (objet?.image?.filter(obj => obj.url != file.source)) })
  };
  const handleOnProcessFileAct = (error, file) => {
    if (error) {
      return;
    }

    // filePondRef.current.removeFile(file);
    console.log(file);
    console.log(filesAct);
    setFilesAct(filesAct.filter(obj => obj.source != file.source))
    setActivite({ ...activite, image: (activite?.image?.filter(obj => obj.url != file.source)) })
  };
  const handleremovefile = (e) => {
    console.log(e);
  }
  /*  const validationSchema = (user?.user?.role == "donateur" || user?.donateur?.user.role == "entreprise") ? yup.object({
      nom: yup
        .string('Entrez le titre')
        .required("Le titre est obligatoire"),
      description: yup
        .string('Entrer la description')
        .required('la description est obligatoire'),
      idSousCategorie: yup
        .string('Entrer la description')
        .required('la description est obligatoire'),
  
    })
      : yup.object({
        titre: yup
          .string('Entrez le titre')
          .required("Le titre est obligatoire"),
        description: yup
          .string('Entrer la description')
          .required('la description est obligatoire'),
  
      });
    const formik = useFormik({
      initialValues: (user?.user?.role == "donateur" || user?.donateur?.user.role == "entreprise") ? {
        nom:  "" ,
        description:"",
        idSousCategorie: "",
      } : {
        image: '',
        description: '',
        titre: '',
      },
      validationSchema,
      onSubmit: () => { (user?.user?.role == "donateur" || user.donateur?.user.role == "entreprise") ? handleSubmit() : "" },
    });*/
  return (
    <div className="feed">
      <div className="feedWrapper">
        {(user?.user?.id == Number(id) || user?.donateur?.userIdD == Number(id)) && <div style={{ marginTop: user?.user?.role == "association" ? "80px" : "-10px" }}>
          <Share /></div>}
        {objets ? (
          objets.map((obj, ind) => {
            //const dmds= getDemandes(obj.id);
            return (
              <div className="post1 ">
                <div className="post shadow p-3 mb-5 bg-body-tertiary rounded">
                  <div className="postWrapper">
                    {/*<h6>{JSON.stringify(obj)}</h6>*/}
                    <div className="postTop">
                      <div className="postTopLeft">
                        <img
                          className="postProfileImg"
                          src={(user && user.user) ? user.user.image : (user && user.donateur) ? user.donateur.user.image : ""}
                          alt=""
                        />
                        <span className="postUsername fw-bold fs-6">
                          {(user && user.user) ? user.user.nom : (user && user.donateur) ? user.donateur.user.nom : ""}
                        </span>
                        <span className="postDate">{user && (user.createdAt).Date}</span>
                      </div>
                      
                    </div>
                    <div className="postCenter">

                      {obj.image &&
                        <Carousel className="rounded">
                          {obj.image.map((img, index) => (
                            <Carousel.Item key={index}>
                              <Image src={img.url} alt={`Image ${index + 1}`} thumbnail className='d-block  mx-auto' style={{ maxWidth: "800px", maxHeight: "600px", width: "500px", height: "500px", }} />
                            </Carousel.Item>
                          ))}
                        </Carousel>}
                    </div>
                    <Row>
                      <Col>
                        <Box sx={{ justifyContent: "space-between", alignContent: 'space-around', display: 'flex' }}>
                          <h3>{obj.nom}</h3>
                          <Typography  variant="body1" color="primary" sx={{marginTop:2,marginRight:2}}>
                            
                            {obj.etatObjet=="tresBonEtat" ? <span style={{color:"green"}}>Très bon état</span> : obj.etatObjet=="bonEtat" ? <span style={{color:"orange"}}>Bon état</span>: <span style={{color:"red"}}>Moyen état</span> }
                          </Typography>
                        </Box>
                        <Typography  variant="h6"  sx={{marginLeft:1.3}}>
                        {obj.sousCategorie?.nom}
                          </Typography>
                        <p className="postText">
                          {obj.description}
                        </p>
                      </Col>
                    </Row>
                    <div className="postBottom">
                      <div className="postBottomLeft">
                        <Button variant="outlined" style={{ margin: "20px", backgroundColor: "rgba(82, 131, 144, 0.33)", borderColor: "rgba(82, 131, 144, 0.33)", transition: "background-color 0.3s", ":hover": { backgroundColor: "red" } }} disabled={obj.etatPublication == "refuse" || obj.disponible !== true || (demandes[obj.id] && demandes[obj.id].length)} onClick={() => { setOpenModif(true), setObjet(obj) }} >Modifier</Button>
                        <Button variant="outlined" style={{ margin: "20px", backgroundColor: "rgba(82, 131, 144, 0.33)", borderColor: "rgba(82, 131, 144, 0.33)", transition: "background-color 0.3s", ":hover": { backgroundColor: "red" } }} disabled={obj.disponible == false} onClick={() => { (demandes[obj.id] && demandes[obj.id].length ? setOpenAlert(true) : setOpen(true)), setIdObjet(obj.id) }} >Supprimer</Button>
                        {/*disabled={obj.etatPublication!=="publie" || obj.disponible!==true || (demandes[obj.id] && demandes[obj.id].length) }*/}
                      </div>
                      <div className="postBottomRight">
                        {(obj.etatPublication === "enCoursDeValidation") ? (
                          <Alert severity="warning" sx={{ whiteSpace: 'nowrap' }} >En Cours De Validation</Alert>
                        ) : (obj.etatPublication === "refuse") ? (
                          <Alert severity="error">Refusé</Alert>
                        ) : (obj.disponible === false) ? (
                          <Alert severity="error">Non Disponible</Alert>
                        ) : (
                          (demandes[obj.id] && demandes[obj.id].length > 0) ? (
                            <Link to={`/listeDesDemandes/${(user && user.user) ? user.user.id : (user && user.donateur) ? user.donateur.userIdD : ""}?nom=${encodeURIComponent(obj.nom)}`}>
                              <span className="postCommentText" style={{ whiteSpace: "nowrap" }}>Liste des demandes</span>
                            </Link>
                          ) : (
                            <span className="postCommentText" style={{ whiteSpace: "nowrap" }}> Aucune demande </span>
                          )
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : null
        }

        {activites ? (
          activites.map((obj, ind) => {
            return (
              <div className="post1 ">

                <div className="post shadow p-3 mb-5 bg-body-tertiary rounded">
                  <div className="postWrapper">
                    <div className="postTop">
                      <div className="postTopLeft">
                        {((user && user.user && user.user.id == id) || (user && user.donateur && user.donateur.user.id == id)) &&
                          <>
                            <img
                              className="postProfileImg"
                              src={(user && user.user) ? user.user.image : (user && user.donateur) ? user.donateur.user.image : ""}
                              alt=""
                            />
                            <span className="postUsername">
                              {(user && user.user) ? user.user.nom : (user && user.donateur) ? user.donateur.user.nom : ""}
                            </span></>}
                        <span className="postDate">{user && (user.createdAt).Date}</span>
                      </div>
                     
                    </div>
                    <div className="postCenter">

                      {obj.image &&
                        <Carousel className="rounded">
                          {obj.image.map((img, index) => (
                            <Carousel.Item key={index}>
                              <Image src={img.url} alt={`Image ${index + 1}`} thumbnail className='d-block  mx-auto' style={{ maxWidth: "800px", maxHeight: "600px", width: "500px", height: "500px", }} />
                            </Carousel.Item>
                          ))}
                        </Carousel>}
                    </div>
                    <h3>{obj.titre}</h3>
                    <p className="postText">
                      {obj.description}
                    </p>
                    <div className="postBottom">
                      <div className="postBottomLeft">
                        {((user && user.user && user.user.id == id) || (user && user.donateur && user.donateur.user.id == id)) && <><Button variant="outlined" style={{ margin: "20px", backgroundColor: "rgba(82, 131, 144, 0.33)", borderColor: "rgba(82, 131, 144, 0.33)", transition: "background-color 0.3s", ":hover": { backgroundColor: "red" } }} onClick={() => { setOpenModifActivite(true), setActivite(obj) }}>Modifier</Button>
                          <Button variant="outlined" style={{ margin: "20px", backgroundColor: "rgba(82, 131, 144, 0.33)", borderColor: "rgba(82, 131, 144, 0.33)", transition: "background-color 0.3s", ":hover": { backgroundColor: "red" } }} onClick={() => { setIdActivite(obj.id), setOpenSuppActivite(true) }} >Supprimer</Button>
                        </>}
                      </div>
                      <div className="postBottomRight">

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : null
        }</div>

      {/* Modal pour la modification d'un objet */}
      <Modal show={openModif} onHide={() => setOpenModif(false)} size="lg" centered>
        <Form noValidated onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title> <h2 align="center"> Modification d'un Objet</h2></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container-fluid">
              <Row>
                {/* Première colonne */}
                <Col md={6}>
                  <div className="container">
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "black", fontSize: "17px" }}>Nom :</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Nom"
                        value={objet.nom || ""}
                        name="nom"
                        //onChange={(e) => handlechange(e)}
                        onChange={(e) => {
                          handlechange(e); // Vous pouvez toujours appeler votre propre logique de gestion des changements ici
                          // formik.handleChange(e); // Utilisez la méthode handleChange de Formik pour mettre à jour les valeurs du formulaire
                        }}
                      //onBlur={formik.handleBlur}
                      //isInvalid={formik.touched.nom && Boolean(formik.errors.nom)} // Utilisez isInvalid pour indiquer l'état invalide
                      />
                      { /*<Form.Control.Feedback type="invalid">
              {formik.errors.nom}
            </Form.Control.Feedback>*/}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "black", fontSize: "17px" }}>Catégorie :</Form.Label>
                      <Form.Control
                        required
                        as="select"
                        type="select"
                        value={Number(objet.idSousCategorie) || ""}
                        name="idSousCategorie"
                        //onChange={(e) => handlechange(e)}
                        onChange={(e) => {
                          handlechange(e); // Vous pouvez toujours appeler votre propre logique de gestion des changements ici
                          //formik.handleChange(e); // Utilisez la méthode handleChange de Formik pour mettre à jour les valeurs du formulaire
                        }}
                      // onBlur={formik.handleBlur}
                      //isInvalid={formik.touched.idSousCategorie && Boolean(formik.errors.idSousCategorie)} // Utilisez isInvalid pour indiquer l'état invalide
                      >
                        <option value={""}>Choissisez une sous catégorie</option>
                        {!isLoading
                          ? scategories.map((scat) => (
                            <option key={Number(scat.id)} value={Number(scat.id)}>
                              {scat.nom}
                            </option>
                          ))
                          : null}
                      </Form.Control>
                      {/*<Form.Control.Feedback type="invalid">
                        {formik.errors.idSousCategorie}
                </Form.Control.Feedback>*/}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "black", fontSize: "17px" }}>Etat :</Form.Label>

                      <RadioGroup
                        //required
                        aria-labelledby="demo-radio-buttons-group-label"
                        //defaultValue="female"
                        value={objet.etatObjet || ""}
                        name="etatObjet"
                        onChange={(e) => handlechange(e)}
                      >
                        <FormControlLabel
                          value="tresBonEtat"
                          control={<Radio size="small" sx={{
                            color: green[900],
                            '&.Mui-checked': {
                              color: green[900],
                            },
                          }} />}
                          label="Très bon état"
                          sx={{
                            color: green[900],
                          }}
                        />
                        <FormControlLabel
                          value="bonEtat"
                          control={<Radio size="small" sx={{
                            color: orange[900],
                            '&.Mui-checked': {
                              color: orange[900],
                            },
                          }} />}
                          label="Bon état"
                          sx={{
                            color: orange[900],
                          }}
                        />
                        <FormControlLabel
                          value="moyenEtat"
                          control={<Radio size="small" sx={{
                            color: red[900],
                            '&.Mui-checked': {
                              color: red[900],
                            },
                          }} />}
                          label="Moyen état"
                          sx={{
                            color: red[900],
                          }}
                        />
                      </RadioGroup>
                    </Form.Group>

                  </div>
                </Col>

                {/* Deuxième colonne */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: "black", fontSize: "17px" }}> Description :</Form.Label>
                    <Textarea

                      minRows={2}
                      size="md"
                      required
                      value={objet.description || ""}
                      name="description"
                      onChange={(e) => {
                        handlechange(e); // Vous pouvez toujours appeler votre propre logique de gestion des changements ici
                        //formik.handleChange(e); // Utilisez la méthode handleChange de Formik pour mettre à jour les valeurs du formulaire
                      }}
                    // onBlur={formik.handleBlur}
                    //isInvalid={formik.touched.description && Boolean(formik.errors.description)} // Utilisez isInvalid pour indiquer l'état invalide
                    />
                    {/*formik.touched.description && formik.errors.description && (
              <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {formik.errors.description}
              </div>
            )*/}
                    {/*<Form.Control.Feedback type="invalid">
            {formik.errors.description}
          </Form.Control.Feedback>*/ }
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: "black", fontSize: "17px" }} >Images :</Form.Label>
                    <FilePond
                      // required
                      ref={filePondRef}
                      files={files}
                      allowMultiple={true}
                      onupdatefiles={setFiles}
                      onremovefile={handleOnProcessFile}
                      name="image"
                      server={serverOptions()}
                      labelIdle='<span className="filepond--label-action">Parcourir</span>'
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </Modal.Body>


          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setOpenModif(false)/*, setFiles([])*/ }}>
              Fermer
            </Button>
            <Button type="submit" disabled={loading} style={{ backgroundColor: "rgba(72, 151, 90, 0.68)", borderColor: "rgba(72, 151, 90, 0.68)" }}>Enregistrer</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/*Modal pour la suppression*/}
      <Modal show={open} onHide={() => setOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title> <WarningAmberOutlined style={{ marginRight: "10px" }}></WarningAmberOutlined><strong style={{ fontFamily: 'serif', fontSize: '20px' }}>Attention</strong></Modal.Title>
        </Modal.Header>
        <Modal.Body> <p style={{ fontSize: "16px" }}>Êtes-vous sûr de vouloir supprimer cet objet ?</p></Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size='sm' style={{ height: "33px" }} onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button variant="outline-danger" size='sm' style={{ height: "33px" }} color="error" onClick={() => { dispatch(delObjet(idObjet)).then(err => console.log(err.payload)), setOpen(false) }}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
      {/*Modal pour la suppression*/}
      <Modal show={openAlert} onHide={() => setOpenAlert(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title> <WarningAmberOutlined style={{ marginRight: "10px" }}></WarningAmberOutlined><strong style={{ fontFamily: 'serif' }}>Attention</strong></Modal.Title>
        </Modal.Header>
        <Modal.Body> <p style={{ fontSize: "16px" }}>Cet objet a des demandes en cours. Si vous choisissez de le supprimer, toutes ces demandes seront automatiquement refusées !</p></Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" style={{ height: "35px" }} onClick={() => setOpenAlert(false)}>
            Annuler
          </Button>
          <Button variant="outline-danger" style={{ height: "35px" }} onClick={() => { dispatch(delObjet(idObjet)).then(err => console.log(err)), setOpenAlert(false) }}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
      {/** modal de modification d'une activité */}
      <Modal show={openModifActivite} onHide={() => setOpenModifActivite(false)} size="lg" centered>
        <Form onSubmit={handleSubmitActivite}>
          <Modal.Header closeButton>
            <Modal.Title> <h2 style={{ fontFamily: 'serif' }} align="center">Modification d'une Activité</h2></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container-fluid">
              <Row>
                {/* Première colonne */}
                <Col md={6}>
                  <div className="container">
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "black", fontSize: "17px" }}>Titre :</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Titre"
                        value={activite.titre || ""}
                        name="titre"
                        onChange={(e) => {
                          handlechangeActivite(e); // Vous pouvez toujours appeler votre propre logique de gestion des changements ici
                          // formik.handleChange(e); // Utilisez la méthode handleChange de Formik pour mettre à jour les valeurs du formulaire
                        }}
                      //onBlur={formik.handleBlur}
                      // isInvalid={formik.touched.titre && Boolean(formik.errors.titre)} // Utilisez isInvalid pour indiquer l'état invalide
                      />
                      { /*<Form.Control.Feedback type="invalid">
              {formik.errors.titre}
            </Form.Control.Feedback>*/}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "black", fontSize: "17px" }}>Description :</Form.Label>

                      <Textarea
                        minRows={2}
                        size="md"
                        required
                        value={activite.description || ""}
                        name="description"
                        onChange={(e) => {
                          handlechangeActivite(e);
                          // formik.handleChange(e);
                        }}
                      // onBlur={formik.handleBlur}
                      //isInvalid={formik.touched.description && Boolean(formik.errors.description)}
                      />
                      {/*formik.touched.description && formik.errors.description && (
            <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              {formik.errors.description}
            </div>
          )*/}

                    </Form.Group>

                  </div>
                </Col>

                {/* Deuxième colonne */}
                <Col md={6}>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: "black", fontSize: "17px" }} >Images :</Form.Label>

                    <FilePond
                      //required
                      files={filesAct}
                      allowMultiple={true}
                      onupdatefiles={setFilesAct}
                      onremovefile={handleOnProcessFileAct}
                      name="image"
                      server={serverOptionsActivite()}
                      labelIdle='<span className="filepond--label-action">Parcourir</span>'
                    />

                  </Form.Group>
                </Col>
              </Row>
            </div>
          </Modal.Body>


          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setOpenModifActivite(false)/*, setFilesAct([])*/ }}>
              Fermer
            </Button>
            <Button type="submit" disabled={loading} style={{ backgroundColor: "rgba(72, 151, 90, 0.68)", borderColor: "rgba(72, 151, 90, 0.68)" }} >Enregistrer</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/*Modal pour la suppression*/}
      <Modal show={openSuppActivite} onHide={() => setOpenSuppActivite(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'serif' }}><WarningAmberOutlined style={{ marginRight: '10px' }}></WarningAmberOutlined>Attention</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontFamily: 'serif', fontSize: '20px' }}>Êtes-vous sûr de vouloir supprimer cet activite ?</Modal.Body>
        <Modal.Footer>

          <Button variant="outline-secondary" onClick={() => setOpenSuppActivite(false)}>
            Annuler
          </Button>
          <Button variant="outline-danger" onClick={() => { dispatch(delActivite(idActivite)).then(err => console.log(err)), setOpenSuppActivite(false) }}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

