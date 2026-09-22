import "./share.css";
import { PermMedia, Label, Room, EmojiEmotions } from "@mui/icons-material"
import axios from "axios"
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { useDispatch, useSelector } from "react-redux";
import { getScategories } from "../../features/sousCategorieSlice";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { createObjet, getObjetsByDonateur } from "../../features/objetSlice";
import { useNavigate } from "react-router-dom";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import Textarea from "@mui/joy/Textarea";
import { green, orange, pink, red } from "@mui/material/colors";
import { ToastContainer, toast } from 'react-toastify';
import { createActivite } from "../../features/activiteSlice";
import * as yup from 'yup';
import { useFormik } from 'formik';
registerPlugin(FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview)
export default function Share() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate()
  const [objet, setObjet] = useState({})
  const [activite, setActivite] = useState({})
  const [files, setFiles] = useState([]);
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [showActivite, setShowActivite] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { scategories, isLoading } = useSelector((state) => state.storeSousCategories);

  useEffect(() => {
    console.log("okiiiii");
    dispatch(getScategories());
    setObjet({ idDonateur: (user && user.user) ? user.user.id : (user && user.donateur) ? user.donateur.user.id : 0, image: [] })
    setActivite({ idAssociationA: (user && user.user) && user.user.id, image: [] })
  }, [dispatch]);

  const handleClose = () => {
    setObjet({ ...objet, nom: "", image: [], idSousCategorie: 0, description: "", etatObjet: "" })
    setFiles([])
    setShow(false)
  };
  const handleCloseActivite = () => {
    setActivite({ ...activite, titre: "", image: [], description: "" })
    setFiles([])
    setShowActivite(false)
  };
  const handleShow = () => setShow(true);
  const handleShowActivite = () => setShowActivite(true);

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

  const handleSubmit = () => {
    console.log("user:" + JSON.stringify(user));
    console.log("user:" + JSON.stringify(objet));
    dispatch(createObjet(objet))
      .then(res => {
        console.log("Insert OK", res.message);
        console.log("l'objet ajouté est :", objet);
        console.log("err", res.error)
        console.log("err", res.error)
        console.log("err", res)

        handleClose()
      })
      .catch(error => {
        console.log(error)
        alert("Erreur ! Insertion non effectuée")
      })
  }
  const handleSubmitActivite = (e) => {
    e.preventDefault();

    console.log("user:" + JSON.stringify(user));
    console.log("act:" + JSON.stringify(activite));
    if (files.length != 0)
      dispatch(createActivite(activite))
        .then(res => {
          console.log("Insert OK", res.message);
          console.log("l'objet ajouté est :", activite);
          console.log("err", res.error)
          console.log("err", res.error)
          console.log("err", res)
          handleCloseActivite()
        })
        .catch(error => {
          console.log(error)
          alert("Erreur ! Insertion non effectuée")
        })
    else
      setError(true)
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
  const filePondRef = useRef(null)
  const handleOnProcessFileAct = (error, file) => {
    if (error) {
      return;
    }

    // filePondRef.current.removeFile(file);
    console.log(file);
    console.log(files);
    let i = -1
    files.map((obj, ins) => {
      if (obj.source == file.source)
        i = ins
    })
    setFiles(files.filter(obj => obj.source != file.source))
    setActivite({ ...activite, image: (activite?.image?.filter((obj, index) => index != i)) })
  };
  const handleOnProcessFileObj = (error, file) => {
    if (error) {
      return;
    }

    // filePondRef.current.removeFile(file);
    console.log(file);
    console.log(objet.image);
    console.log(files);
    let i = -1
    files.map((obj, ins) => {
      if (obj.source == file.source)
        i = ins
    })
    setFiles(files.filter(obj => obj.source != file.source))
    setObjet({ ...objet, image: (objet?.image?.filter((obj, index) => index != i)) })
  };
  const validationSchema = (user?.user?.role == "donateur" || user?.donateur?.user.role == "entreprise") ? yup.object({
    nom: yup
      .string('Entrez le titre')
      .required("Le titre est obligatoire"),
    description: yup
      .string('Entrer la description')
      .required('la description est obligatoire'),
    idSousCategorie: yup
      .string('Sélectionner une catégorie')
      .required('la catégorie est obligatoire'),
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
    initialValues: (user?.user?.role == "donateur" || user?.donateur?.user.role == "entreprise") == "donateur" ? {
      nom: '',
      description: '',
      idSousCategorie: '',
    } : {
      image: '',
      description: '',
      titre: '',
    },
    validationSchema,
    onSubmit: () => { (user?.user?.role == "donateur" || user?.donateur?.user.role == "entreprise") ? handleSubmit() : handleSubmitActivite() },
  });



  const handleChange = (e) => {
    formik.handleChange(e)
  }

  const handleChange2 = (e) => {
    formik.handleChange(e)
  }

  return (
    <div className="share1">
      <div className="share shadow p-2 mb-4 bg-body-tertiary rounded">
        <div className="shareWrapper">
          <div className="shareTop">
            <img className="shareProfileImg" src={(user && user.user) ? user.user.image : (user && user.donateur) ? user.donateur.user.image : ""} alt="" />
            {((user && user.user?.role !== "association")) ? (<p className="shareInput">
              Un petit geste peut changer des vies. Merci pour votre générosité!</p>) :
              <p className="shareInput"> Partager vos activités</p>}
          </div>
          <hr className="shareHr" />
          <div className="shareBottom">
            <div className="shareOptions">
            </div>
            {((user && user.user?.role !== "association")) ? (
              <button onClick={handleShow} className="shareButton" style={{ backgroundColor: "rgba(82, 131, 144, 0.33)", borderColor: "rgba(82, 131, 144, 0.33)", transition: "background-color 0.3s", ":hover": { backgroundColor: "red" }, marginRight: "280px" }}>Ajouter un objet</button>
            ) : <button onClick={handleShowActivite} className="shareButton" style={{ backgroundColor: "rgba(82, 131, 144, 0.33)", borderColor: "rgba(82, 131, 144, 0.33)", transition: "background-color 0.3s", ":hover": { backgroundColor: "red" }, marginRight: "250px" }}>Ajouter une activité</button>
            }
          </div>
        </div>
      </div>
      {/** modal d'ajout d'un objet */}
      <Modal show={show} onHide={handleClose} size="lg" centered >
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title> <h2 style={{ fontFamily: 'serif' }} align="center">Ajout d'un Objet</h2></Modal.Title>
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
                        value={objet.nom}
                        name="nom"
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
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "black", fontSize: "17px" }}>Catégorie :</Form.Label>
                      <Form.Control
                        required
                        as="select"
                        type="select"
                        value={Number(objet.idSousCategorie)}
                        name="idSousCategorie"
                        onChange={(e) => {
                          handlechange(e); // Vous pouvez toujours appeler votre propre logique de gestion des changements ici
                          formik.handleChange(e); // Utilisez la méthode handleChange de Formik pour mettre à jour les valeurs du formulaire
                        }}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.idSousCategorie && Boolean(formik.errors.idSousCategorie)} // Utilisez isInvalid pour indiquer l'état invalide
                      >
                        <option value={""}>Choissisez une catégorie</option>
                        {!isLoading
                          ? scategories.map((scat) => (
                            <option key={Number(scat.id)} value={Number(scat.id)}>
                              {scat.nom}
                            </option>
                          ))
                          : null}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.idSousCategorie}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "black", fontSize: "17px" }}>Etat :</Form.Label>

                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        //defaultValue="tresBonEtat"
                        value={objet.etatObjet}
                        name="etatObjet"
                        onChange={(e) => {
                          handlechange(e); // Vous pouvez toujours appeler votre propre logique de gestion des changements ici
                        }}
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
                    <Form.Label style={{ color: "black", fontSize: "17px" }}>Description :</Form.Label>

                    <Textarea
                      minRows={2}
                      size="md"
                      value={objet.description}
                      name="description"
                      onChange={(e) => {
                        handlechange(e); // Vous pouvez toujours appeler votre propre logique de gestion des changements ici
                        formik.handleChange(e); // Utilisez la méthode handleChange de Formik pour mettre à jour les valeurs du formulaire
                      }}
                      onBlur={formik.handleBlur}
                    //isInvalid={formik.touched.description && Boolean(formik.errors.description)} // Utilisez isInvalid pour indiquer l'état invalide
                    />
                    {formik.touched.description && formik.errors.description && (
                      <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        {formik.errors.description}
                      </div>
                    )}
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.description}
                    </Form.Control.Feedback>

                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: "black", fontSize: "17px" }} >Images :</Form.Label>

                    <FilePond
                      ref={filePondRef}
                      required
                      files={files}
                      allowMultiple={true}
                      onupdatefiles={setFiles}
                      onremovefile={handleOnProcessFileObj}
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
            <Button variant="secondary" onClick={handleClose}>
              Fermer
            </Button>
            <Button type="submit" disabled={loading} style={{ backgroundColor: "rgba(72, 151, 90, 0.68)", borderColor: "rgba(72, 151, 90, 0.68)" }} >Enregistrer</Button>
          </Modal.Footer>
        </Form>
      </Modal>


      <Modal show={showActivite} onHide={handleCloseActivite} size="lg" centered>
        <Form onSubmit={handleSubmitActivite}>
          <Modal.Header closeButton>
            <Modal.Title>
              <h2 style={{ fontFamily: 'serif' }} align="center">Ajout d'une Activité</h2>
            </Modal.Title>
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
                        value={activite.titre}
                        name="titre"
                        onChange={(e) => {
                          handlechangeActivite(e); // Vous pouvez toujours appeler votre propre logique de gestion des changements ici
                          //formik.handleChange(e); // Utilisez la méthode handleChange de Formik pour mettre à jour les valeurs du formulaire
                        }}
                      // onBlur={formik.handleBlur}
                      //isInvalid={formik.touched.titre && Boolean(formik.errors.titre)} // Utilisez isInvalid pour indiquer l'état invalide
                      />
                      {/* { <Form.Control.Feedback type="invalid">
                        {formik.errors.titre}
                      </Form.Control.Feedback>} */}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: "black", fontSize: "17px" }}>Description :</Form.Label>
                      <Textarea
                        minRows={2}
                        size="md"
                        required
                        value={activite.description}
                        name="description"
                        onChange={(e) => {
                          handlechangeActivite(e);
                          //formik.handleChange(e);
                        }}
                      //onBlur={formik.handleBlur}
                      //isInvalid={formik.touched.description && Boolean(formik.errors.description)}
                      />
                      {/* {formik.touched.description && formik.errors.description && (
                        <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                          {formik.errors.description}
                        </div>
                      )} */}
                    </Form.Group>
                  </div>
                </Col>

                {/* Deuxième colonne */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: "black", fontSize: "17px" }}>Images :</Form.Label>
                    <FilePond
                      required
                      ref={filePondRef}
                      files={files}
                      allowMultiple={true}
                      onupdatefiles={setFiles}
                      onremovefile={handleOnProcessFileAct}
                      name="image"
                      //value={activite.image}
                      server={serverOptionsActivite()}
                      labelIdle='<span className="filepond--label-action">parcourir</span>'
                    // onChange={(e) => {
                    //   //handlechangeActivite(e);
                    //   formik.handleChange(e);
                    // }}
                    // onBlur={formik.handleBlur}
                    // isInvalid={formik.touched.image && Boolean(formik.errors.image)}
                    />
                    {/* {error && (
                      <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        Image est required
                      </div>
                    )} */}

                  </Form.Group>
                </Col>
              </Row>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseActivite}>
              Fermer
            </Button>
            <Button type="submit" disabled={loading} style={{ backgroundColor: "rgba(72, 151, 90, 0.68)", borderColor: "rgba(72, 151, 90, 0.68)" }}>
              Enregistrer
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}