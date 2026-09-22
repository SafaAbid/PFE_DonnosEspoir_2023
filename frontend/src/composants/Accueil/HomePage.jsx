import { Avatar, Box, CardActions, CardContent, CardMedia, Grid, IconButton, InputLabel, MenuItem, OutlinedInput, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Navbar, Nav, Container, Row, Col, Card, Button, Form, InputGroup, FormControl, DropdownButton, Dropdown, ListGroup, Modal, Image, Carousel, Figure, Stack, CardHeader, Alert } from 'react-bootstrap';
import NavBarA from '../navbar/NavBarA';
import SideBar from '../sideBar2/SideBar';
import { useDispatch, useSelector } from 'react-redux';
import { getObjetsDispoEtValide, getObjetsDispoEtValideEtDemande, getObjetsDispoEtValideEtNonDemande } from '../../features/objetSlice';
import { createDemandeObjet, getDemandeObjetsByAssociation, getDemandeObjetsEnCoursByAssociation } from './../../features/demandeObjetSlice';
import { Option, Select, Textarea } from '@mui/joy';
import { getCategories } from './../../features/categorieSlice';
import { getScategories } from '../../features/sousCategorieSlice';
import DrawerExa from '../exemple/DrawerExe';
import Footer from '../Footer';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const [showModal, setShowModal] = useState(false); // State pour contrôler l'ouverture du modal
    const [existe, setExiste] = useState(false)
    const [objetId, setObjetId] = useState();
    const [role, setRole] = useState();
    const { objets, isLoading, error } = useSelector((state) => state.storeObjets);
    // Fonction pour ouvrir le modal
    // const handleShowModal = () => setShowModal(true);
    const [selectedObject, setSelectedObject] = useState(null);
    const [filterValue, setFilterValue] = useState('');
    const [categoryFilter, setCategoryFilter] = useState("");
    const [filteredUtilisateurs, setfilteredUtilisateurs] = useState([]);
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const handleFilterChange = (objets) => {
        if (objets && objets.length !== 0)
            if (filterValue != "" && categoryFilter != "")
                return objets.filter(obj =>
                    obj.donateur?.ville.toLowerCase().includes(filterValue.toLowerCase()) &&
                    categoryFilter && obj.idSousCategorie == Number(categoryFilter)
                )
            else if (filterValue != "")
                return objets.filter(obj =>
                    obj.donateur?.ville.toLowerCase().includes(filterValue.toLowerCase())
                )
            else if (categoryFilter != "")
                return objets.filter(obj =>
                    categoryFilter && obj.idSousCategorie == Number(categoryFilter)
                )
            else
                return objets
        else
            return []
    };
    const handleCategoryFilterChange = (event) => {
        setCategoryFilter(event.target.value);
    };
    useEffect(() => {
        setfilteredUtilisateurs(objets && objets.length !== 0 && objets.filter(obj =>
            obj.donateur?.ville.toLowerCase().includes(filterValue.toLowerCase()) ||
            categoryFilter && obj.idSousCategorie == Number(categoryFilter)
        ))
    }, [filterValue, categoryFilter])

    // Fonction pour fermer le modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedObject(null)
    }
    // Fonction pour tronquer une chaîne de caractères a une longueur spécifique
    const ajusterChaine = (str, maxLength) => {
        if (str && (str.length > maxLength)) {
            return str.substring(0, maxLength) + '...';
        } else {
            return str;
        }
    };
    const dispatch = useDispatch();
    const { demandesObjets } = useSelector((state) => state.storeDemandesObjets);
    //pour la lise déroulante
    const { scategories } = useSelector((state) => state.storeSousCategories);
    const { categories } = useSelector((state) => state.storeCategories);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedSubOption, setSelectedSubOption] = useState('');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        setSelectedSubOption('');
    };

    const handleSubOptionChange = (event) => {
        setSelectedSubOption(event.target.value);
    };
    const initFetch = useCallback(() => {
        console.log(user);
        dispatch(getObjetsDispoEtValide()).then(res => !res.error && handleFilterChange(res.payload));
        dispatch(getScategories());
        dispatch(getCategories()).then(res => console.log(res));
        if (user && user.user && user.user.role == "association") {
            //dispatch(getObjetsDispoEtValideEtNonDemande(user.user.id));
            dispatch(getDemandeObjetsEnCoursByAssociation(user.user.id));
        }

    }, [dispatch])
    useEffect(() => {
        initFetch()
        console.log(scategories)
    }, [initFetch])
    const [filtreVille, setFiltreVille] = useState("")

    const handleShowModal = (obj) => {
        setSelectedObject(obj);
        setExiste(false)
        console.log(obj)
    };
    const ajouterDemande = () => {
        const demande = {
            idObjet: objetId,
            associationId: user.user.id
        }
        dispatch(createDemandeObjet(demande)).then(err => console.log("dmderreur" + err))
    }
    const options = categories.map(category => ({
        label: category.nom,
        options: category.sousCategories?.map(sousCategorie => ({
            label: sousCategorie.nom,
            value: sousCategorie.id,
            image: sousCategorie.image, // Ajouter l'image ici
        })),
        image: category.image // Ajouter l'image ici
    }));
    return (
        <div>
            <DrawerExa />
            <div style={{ marginLeft: user ? "270px" : "0", padding: 20, marginTop: user ? "60px" :"60px" }}>
                <Container fluid>
                    <Row>
                        <Row className={ user ?' m-4':'m-5'}>
                            <Col xs={6} className="pr-3">
                                <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                    <Form.Label column sm={3}>Chercher par:</Form.Label>
                                    <Col sm={9}>
                                        <FormControl
                                            type='text'
                                            placeholder="Entrez une ville"
                                            aria-label="Entrez une ville"
                                            aria-describedby="basic-addon2"
                                            onChange={event => setFilterValue(event.target.value)}
                                        />
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col xs={2}>
                            </Col>
                            <Col xs={3} className="pl-2">
                                <Form.Control
                                    as="select"
                                    type="select"
                                    name="idSousCategorie"
                                    onChange={(e) => { setCategoryFilter(e.target.value), console.log(categoryFilter) }}
                                >
                                    <option value={""}>tous catégories</option>
                                    {categories.map(obj => obj.sousCategories?.length != 0 && <optgroup key={Number(obj.id)} label={obj.nom}>
                                        {!isLoading ? scategories.map((scat) => scat.idCategorie == obj.id && <option key={Number(scat.id)} value={Number(scat.id)}>
                                            {scat.nom}
                                        </option>) : null}
                                    </optgroup>)

                                    }
                                </Form.Control>

                            </Col>
                        </Row>
                        {/* Contenu principal de la page */}
                        <Row className='m-3'>
                            {(user && user.user && user.user.role == "association"
                                ? (handleFilterChange(objets).map((obj, ind) => {
                                    const demandeObj = demandesObjets.filter(dmdObj => dmdObj.idObjet === obj.id);
                                    if (demandeObj.length > 0) {
                                        return (
                                            <Col md={4} key={ind}>
                                                <Card style={{ width: '19rem' }}>

                                                    <Card.Img variant="top" src={obj.image && obj.image[0] ? obj.image[0].url : ""} style={{ width: '100%', height: '250px', padding: "5px" }} />

                                                    <Card.Body>
                                                        <Card.Title style={{ textAlign: 'center' }}>{ajusterChaine(obj.nom, 7)}</Card.Title>
                                                        <Card.Text>
                                                            {ajusterChaine(obj.description, 30)}
                                                        </Card.Text>

                                                        <div className='container' style={{ display: 'flex', justifyContent: 'space-between', padding: "0px" }}>
                                                            <Button variant="" style={{ backgroundColor: "rgba(126, 188, 141, 0.65)",  margin: "1px", height: "35px", whiteSpace: 'nowrap', marginRight: 'auto', fontSize: "14px" }} onClick={() => { user ? (handleShowModal(obj), setObjetId(obj.id), setExiste(true)) : navigate("/login") }}>Plus De Détails</Button>
                                                            <Alert variant="danger" className="m-1 p-2" style={{ fontSize: "14px", padding: "0px", marginRight: "18px", height: "35px", whiteSpace: 'nowrap' }}>
                                                                Déjà Demandé
                                                            </Alert>
                                                        </div>

                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        );
                                    } else {
                                        return (
                                            <Col md={4} key={ind}>
                                                <Card style={{ width: '19rem' }}>

                                                    <Card.Img variant="top" src={obj.image && obj.image[0] ? obj.image[0].url : ""} style={{ width: '100%', height: '250px', padding: "5px" }} />
                                                    <Card.Body>
                                                        <Card.Title style={{ textAlign: 'center' }}>{ajusterChaine(obj.nom, 7)}</Card.Title>
                                                        <Card.Text>
                                                            {ajusterChaine(obj.description, 30)}
                                                        </Card.Text>
                                                        <Button variant="" style={{ backgroundColor: "rgba(126, 188, 141, 0.65)", marginLeft: "60px", fontSize: "14px" }} onClick={() => { user ? (handleShowModal(obj), setObjetId(obj.id)) : navigate("/login") }}>Plus De Détails</Button>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        );
                                    }
                                }))
                                : handleFilterChange(objets).length == 0
                                    ? (
                                        <center>

                                            <Grid item xs={10} style={{ marginTop: "150px" }}>
                                                <Typography variant="h6" > Aucun résultat trouvé</Typography></Grid>
                                        </center>
                                    )
                                    : (handleFilterChange(objets).map((obj, ind) => {
                                        return (
                                            <Col md={4} key={ind}>
                                                <Card style={{ width: '19rem' }}>

                                                    <Card.Img variant="top" src={obj.image && obj.image[0] ? obj.image[0].url : ""} style={{ width: '100%', height: '250px', padding: "2px" }} />

                                                    <Card.Body>
                                                        <Card.Title style={{ textAlign: 'center' }}>{ajusterChaine(obj.nom, 7)}</Card.Title>
                                                        <Card.Text>
                                                            {ajusterChaine(obj.description, 30)}
                                                        </Card.Text>
                                                        <Button variant="" style={{ backgroundColor: "rgba(126, 188, 141, 0.65)", marginLeft: "60px", fontSize: "14px" }} onClick={() => { user ? (handleShowModal(obj), setObjetId(obj.id)) : navigate("/login") }}>Plus De Détails</Button>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        );

                                    })
                                    )
                            )
                            }
                            {/* Ajoutez d'autres cartes pour d'autres objets à donner */}
                        </Row>

                    </Row>
                </Container>
            </div>

            {/* Modal pour afficher les détails de l'objet */}
            <Modal show={selectedObject !== null} onHide={handleCloseModal} size="xl" centered>
                <Modal.Body className="d-flex " style={{ maxHeight: "880vh", overflowY: "auto" }}>
                    {selectedObject && <Container>
                        <Row className="justify-content-md-center">
                            <Col >
                                <div >
                                    <Carousel className="rounded">
                                        {selectedObject.image.map((image, index) => (
                                            <Carousel.Item key={index}>
                                                <Image src={image.url} alt={`Image ${index + 1}`} thumbnail className='d-block  mx-auto' style={{ maxWidth: "800px", maxHeight: "600px", width: "500px", height: "500px", }} />
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                </div>
                            </Col>
                            <Col className='mt-3'>
                                <Box
                                    component="section"
                                    sx={{ mb: 2, mr: 3, ml: 0, p: 2, border: '1px solid grey', backgroundColor: "rgba(182, 182, 182, 0.18)" }}
                                >
                                    <Grid container spacing={2}>
                                        <Row>
                                            <Col>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item xs={12} sm={5}>
                                                        <Avatar
                                                            src={selectedObject.donateur.user.image}
                                                            alt="Image du donateur"
                                                            sx={{ width: 76, height: 76, marginTop: 2, marginLeft: 7 }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={7}>
                                                        <Grid container spacing={0}>
                                                            <Grid item xs={12}>
                                                                <Typography variant="h6" sx={{ fontFamily: 'serif', fontSize: 18 }}>
                                                                    <strong>Nom :</strong> {selectedObject.donateur.user.nom}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography variant="h6" sx={{ fontFamily: 'serif', fontSize: 18 }}>
                                                                    <strong>Téléphone :</strong> {selectedObject.donateur.numTelephone}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography variant="h6" sx={{ fontFamily: 'serif', fontSize: 18, marginRight: 2 }}>
                                                                    <strong>Adresse :</strong> {selectedObject.donateur.adresse}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography variant="h6" sx={{ fontFamily: 'serif', fontSize: 18 }}>
                                                                    <strong>Ville :</strong> {selectedObject.donateur.ville}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography variant="h6" sx={{ fontFamily: 'serif', fontSize: 18 }}>
                                                                    <strong>Email :</strong> {selectedObject.donateur.user.email}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Typography variant="h6" sx={{ fontFamily: 'serif', fontSize: 18 }}>
                                                                    <strong>Objets donnés :</strong> {selectedObject.donateur.nbObjetsDonnes}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </Box>
                                <div style={{ marginTop: "30px" }}>
                                    <Row>
                                        <Col >
                                            <h5 style={{ fontFamily: 'serif', fontSize: "18px" }}>Nom :</h5>
                                            <p className="mt-1 center ">{selectedObject.nom}</p>
                                        </Col>
                                        <Col>
                                            <h5 style={{ fontFamily: 'serif', fontSize: "18px" }}>Catégorie :</h5>
                                            <p className="mt-1 center ">{selectedObject.sousCategorie.nom}</p>
                                        </Col>
                                        <Col>

                                            <h5 style={{ fontFamily: 'serif', fontSize: "18px" }}> État de l'objet :</h5>
                                            {(selectedObject.etatObjet == "tresBonEtat") ? <p>Très bon état</p> : (selectedObject.etatObjet == "moyenEtat") ? <p>Moyen état</p> : <p> Bon état</p>}
                                        </Col>
                                    </Row></div>
                                <div style={{ marginTop: "10px" }}>
                                    <h5 style={{ fontFamily: 'serif', fontSize: "18px" }}>Description :</h5>
                                    <Textarea
                                        minRows={2}
                                        size="md"
                                        required
                                        value={selectedObject.description}
                                        name="description"
                                        readOnly
                                    />
                                </div>
                                {               /* <textarea value={selectedObject.description} style={{ width: "100%", height: "90px", resize: "vertical" }} readOnly />
*/}    </Col>
                        </Row>
                    </Container>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={(e) => handleCloseModal()}>Fermer</Button>
                    {(user && user.user && user.user.role === "association") && <Button style={{ backgroundColor: "rgba(72, 151, 90, 0.68)", borderColor: "rgba(72, 151, 90, 0.68)", color: 'black' }} variant="secondary" disabled={existe == true || (user && user.donateur && user.donateur.user.role == "entreprise")} onClick={(e) => { ajouterDemande(), handleCloseModal() }} >{existe == false ? "Demander" : "deja demandé"}</Button>}
                </Modal.Footer>
            </Modal>


            {/*<Footer/>*/}
        </div>
    );
}

export default HomePage;