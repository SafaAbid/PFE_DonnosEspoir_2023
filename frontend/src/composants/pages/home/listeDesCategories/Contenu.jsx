import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Avatar,
  Grid,
  Box
} from '@mui/material';
import { Add, Edit, Delete, WarningAmberOutlined } from '@mui/icons-material';
import './CategoriesAdmin.css'; // Importer le fichier CSS externe
import { Modal } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
//import { Table } from '@mui/material/Table';
import { Card } from '@mui/material';
import { CardContent } from '@mui/material';
import { useSelector } from 'react-redux';
import { archiverScategorie, createScategorie, desarchiverSCategorie, findScategorieByNom, getScategoriesByCat, getScategoriesByCatAdmin, updateScategorie } from '../../../../features/sousCategorieSlice';
import { useDispatch } from 'react-redux';
import { Col } from 'react-bootstrap';
import { Alert, Stack, Tab, TabList, TabPanel, Tabs, Textarea } from '@mui/joy';
import { archiverCategorie, createCategorie, desarchiverCategorie, findCategorieByNom, updateCategorie } from '../../../../features/categorieSlice';
import { Row } from 'react-bootstrap';
import axios from "axios"
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css';

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import Swal from 'sweetalert2';
import { getObjetsByCat, getObjetsByScat } from '../../../../features/objetSlice';
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)
const Contenu = () => {
  const { categories } = useSelector((state) => state.storeCategories);
  const { scategories } = useSelector((state) => state.storeSousCategories);
  const dispatch = useDispatch()
  const [newCategorie, setNewCategorie] = useState({});
  const [modifCategorie, setModifCategorie] = useState({});
  const [newSousCategorie, setNewSousCategorie] = useState({});
  const [modifSousCategorie, setModifSousCategorie] = useState({});
  const [files, setFiles] = useState([]);
  const [fileAjoutSCat, setFileAjoutSCat] = useState([]);
  const [fileModifSCat, setFileModifSCat] = useState([]);
  const [fileModif, setFileModif] = useState([]);
  const [show, setShow] = useState(false)
  const [showCategorieAjout, setShowCategorieAjout] = useState(false)
  const [showCategorieModif, setShowCategorieModif] = useState(false)
  const [showSousCategorieAjout, setShowSousCategorieAjout] = useState(false)
  const [showSousCategorieModif, setShowSousCategorieModif] = useState(false)
  const [openSuppCat, setOpenSuppCat] = useState(false)
  const [openSuppSCat, setOpenSuppSCat] = useState(false)
  const [idCat, setIdCat] = useState();
  const [idScat, setIdScat] = useState();
  const [filtre, setFiltre] = useState("nonArchive"); // pour le filtre sélectionné
  const [openActiveCat, setOpenActiveCat] = useState(false)
  const [openActiveSCat, setOpenActiveSCat] = useState(false)
  const { objets, isLoading, error } = useSelector((state) => state.storeObjets);
  const [controlCategorie, setControlCategorie] = useState({})
  const [loading, setLoading] = useState(false);
  const filtrerCategories = (categories) => {
    return categories.filter((obj) => {
      if (filtre === "nonArchive") {
        return obj.etatArchive == "";
      } else if (filtre === "archive") {
        return obj.etatArchive == 1
      }
    });
  };
  useEffect(() => {
    modifSousCategorie.image && setFileModifSCat([
      {
        source: modifSousCategorie.image,
        options: { type: 'local' }
      }
    ])
  }, [showSousCategorieModif])
  useEffect(() => {
    modifCategorie.image && setFileModif([
      {
        source: modifCategorie.image,
        options: { type: 'local' }
      },
    ])
  }, [showCategorieModif])
  const getAllSousCategorieByCat = (id) => {
    dispatch(getScategoriesByCatAdmin(id)).then(er => console.log(er));
  }
  const handlechangeAjout = (e) => {
    setNewCategorie({ ...newCategorie, [e.target.name]: e.target.value })
  }
  const handlechangeModif = (e) => {
    setModifCategorie({ ...modifCategorie, [e.target.name]: e.target.value })
  }
  const handleSubmitAjoutCat = (e) => {
    e.preventDefault();
    //const form = e.currentTarget;
    //if (form.checkValidity() === true) {
    console.log("newCat", newCategorie)
    const obj = {
      nom: newCategorie.nom
    }
    dispatch(findCategorieByNom(obj)).then(res => {
      if (!res.payload) {
        dispatch(createCategorie(newCategorie)).then(res => res.error ? console.log({ "err": res.error }) : console.log({ "data": res }))
        setShowCategorieAjout(false)
        setNewCategorie({})
        setFiles([])
      } else {
        Swal.fire(
          {
            icon: "error",
            text: "Le nom de catégorie que vous avez spécifié est déjà utilisé pour une autre existante. Veuillez choisir un nom  différent"
          })
      }
    })

  }
  const handleSubmitModifCat = (e) => {
    e.preventDefault();
    //const form = e.currentTarget;
    //if (form.checkValidity() === true) {
    console.log("modifCat", modifCategorie)

    const obj = {
      nom: modifCategorie.nom
    }
    dispatch(findCategorieByNom(obj)).then(res => {
      if (!res.payload || (res.payload && res.payload.id == modifCategorie.id)) {

        dispatch(updateCategorie(modifCategorie)).then(res => {
          console.log(res)
          if (!res.error) {
            setModifCategorie(res.payload)
          }
        })

        setShowCategorieModif(false)

      } else {
        Swal.fire(
          {
            icon: "error",
            text: "Le nom de sous catégorie que vous avez spécifié est déjà utilisé pour une autre existante. Veuillez choisir un nom différent"
          })
      }
    })

  }

  const handlechangeModifSCat = (e) => {
    setModifSousCategorie({ ...modifSousCategorie, [e.target.name]: e.target.value })
  }
  const handlechangeAjoutSCategorie = (e) => {
    setNewSousCategorie({ ...newSousCategorie, [e.target.name]: e.target.value })
  }
  const handleSubmitAjoutSCat = (e) => {
    e.preventDefault();
    //const form = e.currentTarget;
    //if (form.checkValidity() === true) {
    console.log("ajout", newSousCategorie)
    const obj = {
      nom: newSousCategorie.nom
    }
    dispatch(findScategorieByNom(obj)).then(res => {
      console.log("res.payload" + res.payload)
      if (!res.payload) {
        dispatch(createScategorie(newSousCategorie)).then(res => res.error ? console.log({ "err": res.error }) : console.log({ "data": res }))
        setShowSousCategorieAjout(false)
        setNewSousCategorie({})
        setShow(true)
        setFileAjoutSCat([])
        // getAllSousCategorieByCat(newSousCategorie.idCategorie),
        //setShow(true)        
      } else {
        Swal.fire(
          {
            icon: "error",
            text: "Le nom de sous catégorie que vous avez spécifié est déjà utilisé pour une autre existante. Veuillez choisir un nom différent"
          })
      }
    })

  }
  const handleSubmitModifSCat = (e) => {
    e.preventDefault();
    //const form = e.currentTarget;
    //if (form.checkValidity() === true) {
    console.log("ajout", modifSousCategorie)

    const obj = {
      nom: modifSousCategorie.nom
    }
    dispatch(findScategorieByNom(obj)).then(res => {
      if (!res.payload || (res.payload && res.payload.id == modifSousCategorie.id)) {
        dispatch(updateScategorie(modifSousCategorie)).then(res => {
          console.log(res)
          if (!res.error) {
            setModifCategorie(res.payload)
          }
        })
        setShowSousCategorieModif(false)
        setShow(true)
        setFileModif([])
      } else {
        Swal.fire(
          {
            icon: "error",
            text: "Le nom de sous catégorie que vous avez spécifié est déjà utilisé pour une autre existante. Veuillez choisir un nom différent"
          })
      }
    })
  }
  const serverOptions = () => {
    console.log('server pond');
    return {
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
            setNewCategorie({ ...newCategorie, image: data.url });
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
  const serverOptionsAjoutSCat = () => {
    console.log('server pond');
    return {
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
            setNewSousCategorie({ ...newSousCategorie, image: data.url });
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
  const serverOptionsModif = () => {
    console.log('server pond');
    return {
      load: (source, load, error, progress, abort, headers) => {
        setFileModif([{
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
            setModifCategorie({ ...modifCategorie, image: data.url });
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
  const serverOptionsModifSCat = () => {
    console.log('server pond');
    return {
      load: (source, load, error, progress, abort, headers) => {
        setFileModifSCat([{
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
            setModifSousCategorie({ ...modifSousCategorie, image: data.url });
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
  const verifArchiverCat = (id) => {
    dispatch(getObjetsByCat(id)).then(res => {
      console.log(res)
      if (res.payload.length == 0) {
        setOpenSuppCat(true)
      } else {
        Swal.fire({
          icon: "error",
          text: "La catégorie sélectionnée est associée à des objets. Êtes-vous sûr de vouloir la désactiver ?",
          confirmButtonText: 'Désactiver',
          cancelButtonText: 'Annuler',
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch(archiverCategorie(id)).then(res => console.log(res))
          }

        });
      }
    })
  }
  const verifSuppSCat = (id) => {
    dispatch(getObjetsByScat(id)).then(res => {
      console.log(res)
      if (res.payload.length == 0) {
        setOpenSuppSCat(true)
      } else {

        Swal.fire({
          icon: "error",
          text: "La sous catégorie sélectionnée est associée à des objets. Êtes-vous sûr de vouloir la désactiver ?",
          showCancelButton: true,
          cancelButtonText: 'Annuler',
          confirmButtonText: 'Désactiver',
          customClass: {
            confirmButton: 'swal2-confirm',
            cancelButton: 'swal2-cancel'
          }

        }).then((result) => {
          if (result.isConfirmed) {
            dispatch(archiverScategorie(id)).then(res => console.log(res.message))
          }

        });

      }
    })
  }
  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }} className='m-2'>

        <Typography variant="h5" className="header"> Les Catégories :</Typography>
        <Button variant='outlined' color='success' size='small' startIcon={<Add style={{ color: '#0a5200' }} />} onClick={() => setShowCategorieAjout(true)} >Nouveau</Button>
      </Box>
      <Tabs
        variant="outlined"
        orientation="{direction.startsWith('row') ? 'vertical' : 'horizontal'}"
        aria-label="Basic tabs"
        value={filtre}
        onChange={(event, newValue) => setFiltre(newValue)}
        sx={{
          gridColumn: "1/-1",
          width: "75vw",
          marginLeft: "10px",
          marginRight: "80px",
          flexDirection: "direction",
          marginTop: '20px'
        }}
      >
        <TabList underlinePlacement="bottom">
          <Tab indicatorPlacement="bottom" value={"nonArchive"} variant='outlined'
            color='neutral'>
            Actives
          </Tab>
          <Tab indicatorPlacement="bottom" value={"archive"} variant='outlined'
            color='neutral'>
            Inactives
          </Tab>
        </TabList>
        <Stack spacing={3}>
          <TabPanel value={"nonArchive"}>
            {filtrerCategories(categories).length > 0 ? filtrerCategories(categories).map((category, ind) => (
              <List >
                <Grid spacing={2}>
                  <center>
                    {//categories.length > 0 ? (categories.map(category => (

                      <ListItem key={category.id} className="category-item" sx={{ width: '70%' }} >

                        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: '10px', alignItems: 'center', marginTop: '-14px', marginRight: '0px' }}>
                          <div style={{ marginTop: "-97px", margin: "35px", marginRight: '40px' }}>
                            <img src={category.image} style={{ width: '100px', height: '100px', borderRadius: "100%" }} />
                          </div>
                          <h6 style={{ marginLeft: "-40px", marginRight: '10px' }}> {"  " + category.nom}</h6>

                        </div>
                        <center>
                          <ListItemSecondaryAction sx={{ display: "flow" }}>
                            <div>
                              <IconButton onClick={() => {
                                setModifCategorie(category), setShowCategorieModif(true), setFileModif([
                                  {
                                    source: category.image,
                                    options: { type: 'local' }
                                  },
                                ])
                              }}><i class="fa-solid fa-pen" style={{ color: "#24519e" }}></i></IconButton>
                              {/* <IconButton onClick={() => { verifArchiverCat(category.id), setIdCat(category.id) }}><i class="fa-solid fa-trash-can" style={{ color: "#c80418" }}></i></IconButton> */}
                              <Button onClick={() => { verifArchiverCat(category.id), setIdCat(category.id) }} style={{ marginTop: '0px' }} variant='outlined' color='error' size='small'>Désactiver</Button>
                            </div>
                            <Button onClick={() => { getAllSousCategorieByCat(category.id), setShow(true), setNewSousCategorie({ idCategorie: category.id }), setControlCategorie(category) }} >Voir Les Sous Catégories</Button>
                          </ListItemSecondaryAction>
                        </center>
                      </ListItem>
                      //))) : <Typography variant='h5' marginLeft={50} marginTop={20}> Aucune catégorie </Typography>

                    }
                  </center>
                </Grid>
              </List>
            )) : <></>}
          </TabPanel>
          <TabPanel value={"archive"}>
            {filtrerCategories(categories).length > 0 ? filtrerCategories(categories).map((category, ind) => (
              <List >
                <Grid spacing={2}>
                  <center>
                    {//categories.length > 0 ? (categories.map(category => (

                      <ListItem key={category.id} className="category-item" sx={{ width: '70%' }} >

                        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: '10px', alignItems: 'center', marginTop: '-14px', marginRight: '0px' }}>
                          <div style={{ marginTop: "-97px", margin: "35px", marginRight: '40px' }}>
                            <img src={category.image} style={{ width: '100px', height: '100px', borderRadius: "100%" }} />
                          </div>
                          <h6 style={{ marginLeft: "-40px", marginRight: '10px' }}> {"  " + category.nom}</h6>

                        </div>
                        <center>
                          <ListItemSecondaryAction sx={{ display: "flow" }}>
                            <div >
                              {/* <IconButton onClick={() => { setModifCategorie(category), setShowCategorieModif(true) }}><i class="fa-solid fa-pen" style={{ color: "#24519e" }}></i></IconButton>
                    <IconButton onClick={() => { verifArchiverCat(category.id), setIdCat(category.id) }}><i class="fa-solid fa-trash-can" style={{ color: "#c80418" }}></i></IconButton> */}
                              <Button onClick={() => { setOpenActiveCat(true), setIdCat(category.id) }} style={{ marginTop: '0px' }} variant='outlined' size='small' color='success'>Activer</Button>
                            </div>
                            <Button style={{ marginTop: '15px' }} onClick={() => { getAllSousCategorieByCat(category.id), setShow(true), setNewSousCategorie({ idCategorie: category.id }), setControlCategorie(category) }} >Voir Les Sous Catégories</Button>
                          </ListItemSecondaryAction>
                        </center>
                      </ListItem>
                      //))) : <Typography variant='h5' marginLeft={50} marginTop={20}> Aucune catégorie </Typography>        
                    }
                  </center>
                </Grid>
              </List>
            )) : <></>}
          </TabPanel>

        </Stack>
      </Tabs>

      {/* modal des sousCategorie */}
      <Modal show={show} onHide={() => setShow(false)} className="modal-with-scroll" centered>
        <Modal.Header closeButton>
          <Modal.Title>Gérer les sous-catégories</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          {controlCategorie.etatArchive == false && <Button variant='outlined' color='success' size='small' startIcon={<Add style={{ color: '#0a5200' }} />} onClick={() => { setShowSousCategorieAjout(true), setNewSousCategorie(...newSousCategorie, { idCategorie: controlCategorie.id }) }} >Nouveau</Button>
          }          {scategories && scategories.length > 0 && scategories.map(sousCat => (
            <ListItem className='mt-2'>
              <Card style={{ width: '100%' }}>
                <CardContent>
                  <Row>
                    <Col>
                      <div style={{ marginRight: '10px' }}>
                        <img src={sousCat.image} alt={sousCat.nom} style={{ width: '50px', height: '50px', borderRadius: '30%', marginTop: "10px" }} /> {/* Ajoutez cette ligne pour l'image */}
                      </div></Col>
                    <Col>
                      <div style={{ marginTop: '15px' }} >
                        <Typography variant="h6">{sousCat.nom}</Typography>
                      </div>
                    </Col>
                    <Col>
                      {controlCategorie.etatArchive == false ?
                        <ListItemSecondaryAction style={{ marginRight: '10px' }}>
                          {sousCat.etatArchive == false && <IconButton onClick={() => {
                            setShowSousCategorieModif(true), setModifSousCategorie(sousCat), setFileModifSCat([
                              {
                                source: sousCat.image,
                                options: { type: 'local' }
                              },
                            ])
                          }}><Edit /></IconButton>}
                          {/* <IconButton onClick={() => { verifSuppSCat(sousCat.id), setIdScat(sousCat.id) }}><i class="fa-solid fa-trash-can" style={{ color: "#c80418" }}></i></IconButton> */}
                          {sousCat.etatArchive == false ? <Button onClick={() => { verifSuppSCat(sousCat.id), setIdScat(sousCat.id) }} variant='outlined' size='small' color='error'>Désactiver</Button>
                            : <Button onClick={() => { setOpenActiveSCat(true), setIdScat(sousCat.id) }} style={{ marginTop: '0px' }} variant='outlined' size='small' color='success'>Activer</Button>}

                        </ListItemSecondaryAction>
                        : <ListItemSecondaryAction style={{ marginRight: '10px' }}>
                          <Alert color='danger' size='sm' style={{ marginRight: "10px" }} >Désactivée</Alert>
                        </ListItemSecondaryAction>}
                    </Col>
                  </Row>
                </CardContent>
              </Card>
            </ListItem>

          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outlined" size="small" onClick={() => setShow(false)} >
            Fermer
          </Button>

        </Modal.Footer>
      </Modal>
      {/* modal d'ajout d'une catégorie */}
      <Modal show={showCategorieAjout} onHide={() => setShowCategorieAjout(false)} centered>
        <Form onSubmit={handleSubmitAjoutCat}>
          <Modal.Header closeButton>
            <Modal.Title>Ajout d'une catégorie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Form.Group as={Col} md="6">
                  <Form.Label>Nom :</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Nom"
                    name="nom"
                    value={newCategorie.nom}
                    onChange={(e) => handlechangeAjout(e)}
                  />
                </Form.Group>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "black", fontSize: "17px" }} >Image :</Form.Label>
                <FilePond
                  required

                  files={files}
                  allowMultiple={false}
                  onupdatefiles={setFiles}
                  name="image"
                  server={serverOptions()}
                  labelIdle='<span className="filepond--label-action">BrowseOne</span>'
                />
              </Form.Group>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outlined" color="error" style={{ marginRight: "10px" }} onClick={() => { setShowCategorieAjout(false), setFiles([]) }} >Annuler</Button>
            <Button variant="outlined" color="success" type="submit" disabled={loading} >Enregistrer</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* modal de modification d'une catégorie */}
      <Modal show={showCategorieModif} onHide={() => { setShowCategorieModif(false); }} centered>
        <Form onSubmit={handleSubmitModifCat}>
          <Modal.Header closeButton>
            <Modal.Title>Modification d'une catégorie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Form.Group as={Col} md="6">
                  <div style={{ marginTop: "9px" }}>
                    <Form.Label>Nom :</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Nom"
                      name="nom"
                      value={modifCategorie.nom}
                      onChange={(e) => handlechangeModif(e)}
                    />
                  </div>
                </Form.Group>


              </Row>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "black", fontSize: "17px" }} >Images :</Form.Label>
                <FilePond
                  required
                  files={fileModif}
                  allowMultiple={false}
                  onupdatefiles={setFileModif}
                  name="image/*"
                  server={serverOptionsModif()}
                  labelIdle='<span className="filepond--label-action">BrowseOne</span>'
                />
              </Form.Group>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outlined" color="error" style={{ marginRight: '10px' }} onClick={() => { setShowCategorieModif(false); }} >Annuler</Button>
            <Button variant="outlined" color="success" type="submit" disabled={loading}>Enregistrer</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* modal d'ajout d'une sous catégorie */}
      <Modal show={showSousCategorieAjout} onHide={() => setShowSousCategorieAjout(false)} centered>
        <Form onSubmit={handleSubmitAjoutSCat}>
          <Modal.Header closeButton>
            <Modal.Title>Ajout d'une sous catégorie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Form.Group as={Col} md="6">
                  <Form.Label>Nom :</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Nom"
                    name="nom"
                    value={newSousCategorie.nom}
                    onChange={(e) => handlechangeAjoutSCategorie(e)}
                  />
                </Form.Group>

              </Row>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "black", fontSize: "17px" }} >Images :</Form.Label>
                <FilePond
                  required
                  files={fileAjoutSCat}
                  allowMultiple={false}
                  onupdatefiles={setFileAjoutSCat}
                  name="image"
                  server={serverOptionsAjoutSCat()}
                  labelIdle='<span className="filepond--label-action">BrowseOne</span>'
                />
              </Form.Group>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outlined" color="error" style={{ marginRight: '10px' }} onClick={() => { setShowSousCategorieAjout(false) }} >Annuler</Button>
            <Button variant="outlined" color="success" type="submit" disabled={loading} >Enregistrer</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* modal de modification d'une sous catégorie */}
      <Modal show={showSousCategorieModif} onHide={() => { setShowSousCategorieModif(false); }} centered>
        <Form onSubmit={handleSubmitModifSCat}>
          <Modal.Header closeButton>
            <Modal.Title>Modification d'une sous catégorie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Form.Group as={Col} md="6">
                  <Form.Label>Nom :</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Nom"
                    name="nom"
                    value={modifSousCategorie.nom}
                    onChange={(e) => handlechangeModifSCat(e)}
                  />
                </Form.Group>

              </Row>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "black", fontSize: "17px" }} >Images :</Form.Label>
                <FilePond
                  required
                  files={fileModifSCat}
                  allowMultiple={false}
                  onupdatefiles={setFileModifSCat}
                  name="image"
                  server={serverOptionsModifSCat()}
                  labelIdle='<span className="filepond--label-action">BrowseOne</span>'
                />
              </Form.Group>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="warning" style={{ marginRight: '10px' }} onClick={() => { setShowSousCategorieModif(false) }} >Annuler</Button>
            <Button variant="primary" type="submit" disabled={loading} >Enregistrer</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* modal de desactivation d'une catégorie */}
      <Modal show={openSuppCat} onHide={() => setOpenSuppCat(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <Typography variant='h6'> <WarningAmberOutlined></WarningAmberOutlined>    Attention</Typography>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ marginBottom: "-10px" }}>
          <p style={{ fontSize: "16px" }}> Êtes-vous sûr de vouloir désactiver cette catégorie ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outlined" color="success" size='small' style={{ marginRight: "10px" }} onClick={() => setOpenSuppCat(false)}>
            Annuler
          </Button>
          <Button variant="outlined" color="error" size='small' onClick={() => { dispatch(archiverCategorie(idCat)).then(res => console.log(res)), setOpenSuppCat(false) }}>
            Désactiver
          </Button>
        </Modal.Footer>
      </Modal>
      {/* modal d'activation d'une catégorie */}
      <Modal show={openActiveCat} onHide={() => setOpenActiveCat(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <Typography variant='h6'> <WarningAmberOutlined></WarningAmberOutlined>    Attention</Typography>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ fontSize: "16px" }}> Êtes-vous sûr de vouloir activer cette catégorie ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outlined" color="primary" size='small' style={{ marginRight: '10px' }} onClick={() => setOpenActiveCat(false)}>
            Annuler
          </Button>
          <Button variant="outlined" color="success" size='small' onClick={() => { dispatch(desarchiverCategorie(idCat)).then(res => console.log(res)), setOpenActiveCat(false) }}>
            Activer
          </Button>
        </Modal.Footer>
      </Modal>
      {/* modal de desactivation d'une sous catégorie */}
      <Modal show={openSuppSCat} onHide={() => { setOpenSuppSCat(false) }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Attention</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir désactiver cette sous Catégorie ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outlined" color="success" onClick={() => setOpenSuppSCat(false)}>
            Annuler
          </Button>
          <Button variant="outlined" color="error" onClick={() => { dispatch(archiverScategorie(idScat)).then(res => console.log(res.message)), setOpenSuppSCat(false), setShow(false) }}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
      {/* modal d'activation d'une sous  catégorie */}
      <Modal show={openActiveSCat} onHide={() => setOpenActiveSCat(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Attention</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir activer cette sous-catégorie ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outlined" color="primary" onClick={() => setOpenActiveSCat(false)}>
            Annuler
          </Button>
          <Button variant="outlined" color="success" onClick={() => { dispatch(desarchiverSCategorie(idScat)).then(res => console.log(res)), setOpenActiveSCat(false) }}>
            Activer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>

  );
};

export default Contenu;
