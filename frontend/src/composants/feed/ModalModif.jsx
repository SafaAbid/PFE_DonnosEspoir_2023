/*import React, { useEffect, useState } from 'react'
import { FilePond,registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css';

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'

import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { Textarea } from '@mui/joy';
import { green, orange, red } from '@mui/material/colors';
registerPlugin(FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview)
const ModalModif = ({objet}) => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        objet && setFiles( [...files,
          {
          source: objet.image,
          options: { type: 'local' }
          }
          ])
          
      },[]); 
      
  return (
  <>
 
<Modal  size="lg"  centered>
<Form noValidate  >
<Modal.Header closeButton>
<Modal.Title> <h2 align="center"> Modification d'un Objet</h2></Modal.Title>
</Modal.Header>
<Modal.Body>
  <div className="container-fluid">
    <Row>
   
      <Col md={6}>
        <div className="container">
          <Form.Group className="mb-3">
            <Form.Label style={{color:"black",fontSize:"17px"}}>Nom :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Nom"
              value="{objet.nom}"
              name="nom"
              onChange={(e) => handlechange(e)}
            />
            <Form.Control.Feedback type="invalid">
              Saisir Nom Objet
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label  style={{color:"black",fontSize:"17px"}}>Etat :</Form.Label>
       
            <RadioGroup
            required
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              value="{objet.etatObjet}"
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
                }}/>}
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
                }}/>}
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
                }}/>}
                label="Moyen état"
                sx={{
                  color: red[900],
                }}
              />
            </RadioGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label  style={{color:"black",fontSize:"17px"}}>S/Catégorie :</Form.Label>
            <Form.Control
              as="select"
              type="select"
              value="{Number(objet.idSousCategorie)}"
              name="idSousCategorie"
              onChange={(e) => handlechange(e)}
            >
             <option>Choissisez une sous catégorie</option> 
              {/*!isLoading
                ? scategories.map((scat) => (
                    <option key={Number(scat.id)} value={Number(scat.id)}>
                      {scat.nom}
                    </option>
                  ))
                : null*
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Saisir Nom Objet
            </Form.Control.Feedback>
          </Form.Group>
        </div>
      </Col>

    
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label  style={{color:"black",fontSize:"17px"}}>Description :</Form.Label>
         
          <Textarea
            minRows={2}
            size="md"
            required
            value="{objet.description}"
            name="description"
            onChange={(e) => handlechange(e)}
          />
          
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label  style={{color:"black",fontSize:"17px"}} >Images :</Form.Label>
       
          <FilePond
            required
            files={files}
            allowMultiple={true}
            onupdatefiles={setFiles}
            name="image"
            //server={serverOptions()}
            labelIdle='<span className="filepond--label-action">BrowseOne</span>'
          />
           
        </Form.Group>
      </Col>
    </Row>
  </div>
</Modal.Body>


<Modal.Footer>
<Button variant="secondary">
Fermer
</Button>
<Button type="submit" >Enregistrer</Button>
</Modal.Footer>
</Form>
</Modal>
  </>
  )
}

export default ModalModif*/
