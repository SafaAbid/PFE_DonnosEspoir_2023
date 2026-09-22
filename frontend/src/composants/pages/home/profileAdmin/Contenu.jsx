import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { updateCompte } from '../../../../features/AuthSlice';
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css';
import Swal from 'sweetalert2';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import axios from 'axios';
import { RoundedCorner } from '@mui/icons-material';
import { CardOverflow } from '@mui/joy';
import { findCompteByEmail } from '../../../../features/utilisateurSlice';
registerPlugin(FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview)
export default function Contenu() {
  const axiosUpload = axios.create()
  const { user } = useSelector((state) => state.auth);
  const [show, setShow] = React.useState(false);
  const [utilisateur, setUtilisateur] = React.useState(user);
  const [files, setFiles] = React.useState([]);
  const dispatch = useDispatch();
  React.useEffect(() => {
    console.log(user);
    setFiles([
      {
        source: (user && user.user) && user.user.image,
        options: { type: 'local' }
      }
    ]);
    setUtilisateur(user)
  }, [dispatch])
  const handlechange = (e) => {
    setUtilisateur({ ...utilisateur, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === true) {
      console.log("modif", utilisateur)
      dispatch(findCompteByEmail(utilisateur.email)).then(res => {
        console.log(res);
        if (!res.payload || (res.payload && res.payload.id == (user.user ? user.user.id : user.donateur ? user.donateur.user.id:""))) 
        {
          dispatch(updateCompte(utilisateur)).then(res => {
            console.log(res)
            if (!res.error) {
              setUtilisateur(res.payload.user)
              console.log(
                JSON.stringify({
                  source: (res.payload.user.user)
                    && res.payload.user.user.image,
                  options: {
                    type: 'local'
                  }
                })
              )
              setShow(false)
            }
          })
        }
        else {
          Swal.fire(
            {
              icon: "error",
              text: "l'email est déjà utilisé"
            })
        }
      
      })
 

    }
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
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'aziin_Ecommerce');
        data.append('cloud_name', 'dmbkofiro');
        data.append('public_id', file.name);
        axiosUpload.post('https://api.cloudinary.com/v1_1/dmbkofiro/image/upload', data)
          .then((response) => response.data)
          .then((data) => {
            console.log(data);
            setUtilisateur({ ...utilisateur, image: data.url });
            load(data);
          })
          .catch((error) => {
            console.error('Error uploading file:', error);
            error('Upload failed');
            abort();
          });
      },
    };
  };
  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        overflow: { xs: 'auto', sm: 'initial' },
        marginTop: '40px'
      }}
    >
      <Box
        sx={{
          position: 'absolute',

          display: 'block',
          bgcolor: 'warning.300',
          left: '500px',
          top: '-24px',
          bottom: '-24px',
          '&::before': {
            top: '4px',
            display: 'block',
            position: 'absolute',
            right: '0.5rem',
            color: 'text.tertiary',
            fontSize: 'sm',
            fontWeight: 'lg',
          },
          '&::after': {
            top: '4px',
            display: 'block',
            position: 'absolute',
            left: '0.5rem',
            color: 'text.tertiary',
            fontSize: 'sm',
            fontWeight: 'lg',
          },
        }}
      />
      <center>
        <Card
          orientation="vertical"
          sx={{
            width: '57%',
            flexWrap: 'wrap',
            [`& > *`]: {
              '--stack-point': '500px',
              MaxWidth:
                '00px',
              // 'clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)',
            },
            minHeight: '300px',
            overflow: 'auto',
            resize: 'horizontal',
            marginTop: -2
          }}
        >
          <center>
            <CardOverflow variant="solid" sx={{ height: "250px", marginTop: -8, backgroundColor: "rgba(200, 200, 200, 0.5)" }} >
              <center>
                <AspectRatio
                  ratio="1"
                  sx={{ flex: 1, maxWidth: 205, borderRadius: '100%', marginTop: 15, backgroundColor: 'rgba(173, 247, 114, 0.5)' }}
                >
                  <img
                    width={"100%"}
                    src={user && user.user.image}
                    loading="lazy"
                    alt=""
                  />
                </AspectRatio>
              </center>
            </CardOverflow>
            <CardContent style={{ marginTop: "220px" }}>
              <Col style={{ marginTop: "-140px" }}>
                <Col >
                  <Typography level="h3" className="mb-3">
                    {user && user.user.nom}
                  </Typography>
                </Col>
                <Row >
                  <Typography
                    className="m-2"
                    level="title-lg"
                    startDecorator={''
                    }
                  >
                    <i style={{ color: '#566368', marginRight: "5px" }} className="fa-solid fa-envelope "></i>
                    {user && user.user.email}
                  </Typography>
                </Row>
                <Row>
                  <Box sx={{ display: 'flex', gap: 0.5, '& > button': { flex: 2 } }}>
                    <Button variant="outlined" color="neutral" style={{ marginTop: "5px" }} onClick={() => { setShow(true) }}>
                      Modifier
                    </Button>
                  </Box>
                </Row>
              </Col>

            </CardContent>
          </center>
        </Card>
      </center>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title style={{fontFamily:'initial'}}>Modification du compte</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "black", fontSize: "17px" }}>Nom :</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Nom"
                    defaultValue={utilisateur.user.nom}
                    name="nom"
                    onChange={(e) => handlechange(e)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "black", fontSize: "17px" }}>Email :</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Email"
                    defaultValue={utilisateur.user.email}
                    name="email"
                    onChange={(e) => handlechange(e)}
                  />
                </Form.Group>
                <Form.Group style={{ width: "80%", margin: "auto", padding: "1%" }}>
                  <FilePond
                    files={files}
                    acceptedFileTypes="image/*"
                    onupdatefiles={setFiles}
                    allowMultiple={false}
                    server={serverOptions()}
                    name="file"

                  />
                </Form.Group>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outlined" color='danger' style={{marginRight:"20px"}} onClick={() => setShow(false)} >Annuler</Button>
            <Button variant="outlined" color='success' type="submit" >Enregistrer</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Box >
  );
}

