import React,{useState,useMemo, useEffect} from 'react'
//import ReactLoading from 'react-loading';
import {useSelector} from "react-redux"
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

import {useDispatch} from "react-redux";
import { MaterialReactTable } from 'material-react-table';

import { createBenevole, delBenevole, findBenevoleByEmail, findBenevoleByNum, updateBenevole } from './../../features/benevoleSlice';
//import { } from 'react-bootstrap';
import { Row ,Form, Alert } from 'react-bootstrap';
import { Col } from 'react-bootstrap';

//import { Form } from '@mui/joy';
import { Modal } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getRendezVousByBenevole } from '../../features/rendezVousSlice';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Typography } from '@mui/material';
import { WarningAmberOutlined } from '@mui/icons-material';
const Contenu = () => {
const {id}=useParams();
const dispatch=useDispatch()
const [showModal, setShowModal] = useState(false);
const {benevoles} = useSelector((state)=>state.storeBenevoles);
const [selectedItem, setSelectedItem] = useState(null);
const [open, setOpen]=useState(false);
const [openModif, setOpenModif]=useState(false);
const [openAjout, setOpenAjout]=useState(false);
const [idBenevole,setIdBenevole]=useState();
const [benvoleModif,setBenevoleModif]=useState({});
const [benvoleAjout,setBenevoleAjout]=useState({idAssociation:Number(id) });
const {desRendezVous,isLoading,error} = useSelector((state)=>state.storeRendezVous);
const MySwal = withReactContent(Swal)
const handleClose= () => {
  setOpenModif(false)
}

const handleEdit = (item) => {
setShowModal(true);
setSelectedItem(item);
};
const handlechangeAjout=(e)=>{
  setBenevoleAjout({...benvoleAjout,[e.target.name]:e.target.value})
  }
const handlechange=(e)=>{
  setBenevoleModif({...benvoleModif,[e.target.name]:e.target.value})
  }

  const handleSubmit = (e) => {
  e.preventDefault();
  //const form = e.currentTarget;
  //if (form.checkValidity() === true) {
   console.log("modif",benvoleModif)
   const obj={
    email:benvoleModif.email
  }
  const objet={
    numTelephone:benvoleModif.numTelephone
  }
dispatch(findBenevoleByEmail(obj)).then(res=>{
  if( !res.payload || (res.payload && res.payload.id==benvoleModif.id)){
    dispatch(findBenevoleByNum(objet)).then(res=>{
      console.log("res.payload"+res.payload)
      if(!res.payload || (res.payload && res.payload.id==benvoleModif.id)){
        dispatch(updateBenevole(benvoleModif)).then(res=>res.error?console.log({"err":res.error}):console.log({"data":res}))
  setOpenModif(false)
      }else{
      Swal.fire(
      { icon:"error" ,       
      text:"Le numéro du téléphone que vous essayez d'ajouter existe déjà"
      })
      }
    })   
}else{
  Swal.fire(
{ icon:"error" ,       
text:"Le bénévole que vous essayez d'ajouter existe déjà. Veuillez vérifier l'e-mail que vous avez saisi"
}        )
  }})
  
  }
    
   // 
  //setValidated(true);
  //handleClose()
  //}
  const handleSubmitAjout = (e) => {
    e.preventDefault();
    console.log("ajout",benvoleAjout)
    const obj={
      email:benvoleAjout.email,
      idAsso:Number(id)
    }
    const objet={
      numTelephone:benvoleAjout.numTelephone,
      idAsso:Number(id)
    }
    dispatch(findBenevoleByEmail(obj)).then(res=>{
      console.log("res.payload"+res.payload)
      if(!res.payload){
        dispatch(findBenevoleByNum(objet)).then(res=>{
          console.log("res.payload"+res.payload)
          if(!res.payload){
            dispatch(createBenevole(benvoleAjout)).then(res=>res.error?console.log({"err":res.error}):console.log({"data":res}))
            setOpenAjout(false)
            setBenevoleAjout({})   
          }else{
          Swal.fire(
          { icon:"error" ,       
          text:"Le numéro du téléphone que vous essayez d'ajouter existe déjà"
          })
          }
        })          
       }else{
      Swal.fire(
     { icon:"error" ,       
       text:"Le bénévole que vous essayez d'ajouter existe déjà. Veuillez vérifier l'e-mail que vous avez saisi"
      })
      }})
     
      }
      
     // 
    //setValidated(true);
    //handleClose()
    //}
   
    const verfierSupp=(id)=>{
      dispatch(getRendezVousByBenevole(id)).then(res=>{
        console.log(res.payload.length)
        if(!res.error)
          if(res.payload.length===0){
            setOpen(true);
          }else{
          //  alert("Ce bénévole ne peut pas être supprimé car il est associé à des rendez-vous");
             Swal.fire({
              icon:"error",
              text:"Ce bénévole ne peut pas être supprimé car il est associé à des rendez-vous"});
            // window.location.reload()
          }
        console.log(res)});
    }
const columns = useMemo(
() => [
{
accessorKey: 'email',
header: 'Email',
size: 150,
},
{
accessorKey: 'nom', //access nested data with dot notation
header: 'Nom',
size: 150,
},
{
accessorKey: 'prenom',
header: 'Prénom',
size: 150,
},
{
accessorKey: 'numTelephone', 
header: 'Numéro du téléphone',
size: 150,
},
{
accessorKey: 'adresse', 
header: 'Adresse',
size: 150,
},
{
accessorKey: 'id',
header: 'Actions',
size: 150,
Cell: ({ cell, row }) => (
<div >
<Button
onClick={() =>{setOpenModif(true) , setBenevoleModif(cell.row.original)}}
size="md"
className="text-warning btn-link edit"
>
<i class="fa-solid fa-pen-to-square"></i>
</Button>
<Button
onClick={() => {verfierSupp(cell.row.original.id) ,setIdBenevole(cell.row.original.id)}}
size="md"
className="text-danger btn-link delete"
>
<i className="fa fa-trash" />
</Button>

</div>
),
},

],
[benevoles],
);

return (
<>
<Button
onClick={(e)=>{setOpenAjout(true),setBenevoleAjout({idAssociation:Number(id) })}}
size="sm"
style={{'margin':1,'marginLeft':23,fontFamily:'Arial', 'backgroundColor':'rgba(82, 131, 144)' ,borderColor:"rgba(82, 131, 144, 0.33)",marginTop:"-20px"}}
>
<i className="fa-solid fa-circle-plus"></i>
&nbsp;
Ajouter un nouveau bénévole
</Button>
<div style={{margin:"20px", height:"1000px", width:"1000px"}}>
<MaterialReactTable  columns={columns} data={benevoles} />
<Modal show={open} onHide={() => setOpen(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>
     <Typography variant='h6'> <WarningAmberOutlined></WarningAmberOutlined> Attention</Typography>
      </Modal.Title>
  </Modal.Header>
  <Modal.Body style={{marginBottom:'-10px'}}>
  <p style={{color:"black"}}> Êtes-vous sûr de vouloir supprimer ce bénévole ?</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" size='sm' onClick={() => setOpen(false)}>
      Annuler
    </Button>
    <Button variant="danger" size='sm' onClick={() => { dispatch(delBenevole(idBenevole)).then(err => console.log(err)); setOpen(false); }}>
      Supprimer
    </Button>
  </Modal.Footer>
</Modal>
     
  <Modal show={openModif} onHide={() => setOpenModif(false)} centered>
  <Form onSubmit={handleSubmit}>
    <Modal.Header closeButton>
      <Modal.Title> Modification du bénévole {benvoleModif.nom}{" "}{benvoleModif.prenom} </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Container>
        <Row>
          <Form.Group as={Col} md="6">
            <Form.Label>Email :</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Email"
              name="email"
              value={benvoleModif.email}
              onChange={(e) => handlechange(e)}
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Nom :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Nom"
              name="nom"
              value={benvoleModif.nom}
              onChange={(e) => handlechange(e)}
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Prénom :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Prénom"
              name="prenom"
              value={benvoleModif.prenom}
              onChange={(e) => handlechange(e)}
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Numéro du téléphone :</Form.Label>
            <Form.Control
              required
              type="number"
              placeholder="Numéro du téléphone"
              name="numTelephone"
              value={benvoleModif.numTelephone}
              onChange={(e) => handlechange(e)}
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Adresse :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Adresse"
              name="adresse"
              value={benvoleModif.adresse}
              onChange={(e) => handlechange(e)}
            />
          </Form.Group>
        </Row>
      </Container>
    </Modal.Body>
    <Modal.Footer>
      <Button style={{backgroundColor:"rgba(82, 131, 144)",borderColor:"rgba(82, 131, 144, 0.33)"}} onClick={() => setOpenModif(false)}>Annuler</Button>
      <Button style={{backgroundColor:"rgba(82, 131, 144)",borderColor:"rgba(82, 131, 144, 0.33)"}} type="submit">Enregistrer</Button>
    </Modal.Footer>
  </Form>
</Modal>
<Modal show={openAjout} onHide={() => setOpenAjout(false)} centered>
  <Form onSubmit={handleSubmitAjout}>
    <Modal.Header closeButton>
      <Modal.Title variant='h6'>Ajout d'un bénévole</Modal.Title>
    </Modal.Header>
    <Modal.Body>
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
    </Modal.Body>
    <Modal.Footer>
      <Button style={{backgroundColor:"rgba(82, 131, 144)",borderColor:"rgba(82, 131, 144, 0.33)"}} onClick={() => setOpenAjout(false)}>Annuler</Button>
      <Button style={{backgroundColor:"rgba(82, 131, 144)",borderColor:"rgba(82, 131, 144, 0.33)"}} type="submit">Enregistrer</Button>
    </Modal.Footer>
  </Form>
</Modal>
</div>  
{/*showModal && (
<EditArticle
show={showModal}
handleClose={handleClose}
art={selectedItem}
/>
)*/}
 {/* modal pour la suppression */}


   
</>
)
}
export default Contenu
