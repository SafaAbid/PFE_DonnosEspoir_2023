/*import React from 'react'
import Table from 'react-bootstrap/Table';
const Contenu = () => {
  return (
    
    <Table striped bordered hover >
    <thead>
      <tr>
        <th>N°:</th>
        <th>CIN</th>
        <th>Nom </th>
        <th>Prénom</th>
        <th>Adresse</th>
        <th>Association</th>
        <th>Action</th>
        
        
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Jacob</td>
        <td>Thornton</td>
        <td>@fat</td>
      </tr>
      <tr>
        <td>3</td>
        <td colSpan={2}>Larry the Bird</td>
        <td>@twitter</td>
      </tr>
    </tbody>
  </Table>

  )
}

export default Contenu*/
/*import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
  {
    id: 'population',
    label: 'Population',
    minWidth: 150,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'size',
    label: 'Size\u00a0(km\u00b2)',
    minWidth: 150,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'density',
    label: 'Density',
    minWidth: 150,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

const rows = [
  createData('India', 'IN', 1324171354, 3287263),
  createData('China', 'CN', 1403500365, 9596961),
  createData('Italy', 'IT', 60483973, 301340),
  createData('United States', 'US', 327167434, 9833520),
  createData('Canada', 'CA', 37602103, 9984670),
  createData('Australia', 'AU', 25475400, 7692024),
  createData('Germany', 'DE', 83019150, 357578),
  createData('Ireland', 'IE', 4857000, 70273),
  createData('Mexico', 'MX', 126577691, 1972550),
  createData('Japan', 'JP', 126315000, 377973),
  createData('France', 'FR', 67021500, 640679),
  createData('United Kingdom', 'GB', 67545757, 242495),
  createData('Russia', 'RU', 146793744, 15098246),
  createData('Nigeria', 'NG', 150962417, 923768),
  createData('Brazil', 'BR', 210147125, 8515767),
];

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}*/
import React,{useState,useMemo} from 'react'
//import ReactLoading from 'react-loading';
import {useSelector} from "react-redux"
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

import {useDispatch} from "react-redux";
import { MaterialReactTable } from 'material-react-table';

import { Row ,Form } from 'react-bootstrap';
import { Col } from 'react-bootstrap';

//import { Form } from '@mui/joy';
import { Modal } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { getComptes, updateActive, updateDesactive } from '../../../../features/utilisateurSlice';
const Contenu = () => {
const {id}=useParams();
const dispatch=useDispatch()
const [showModal, setShowModal] = useState(false);
const [utilisateur,setUtilisateur]=useState({})
const {utilisateurs} = useSelector((state) =>state.storeUtilisateurs);
const [role,setRole]=useState("")
const [selectedItem, setSelectedItem] = useState(null);
const [open, setOpen]=useState(false);
const [openModif, setOpenModif]=useState(false);
const [openAjout, setOpenAjout]=useState(false);
const [idBenevole,setIdBenevole]=useState();
const [benvoleModif,setBenevoleModif]=useState({});
const [benvoleAjout,setBenevoleAjout]=useState({idAssociation:Number(id) });
const [openRaisonRefus,setOpenRaisonRefus]=useState(false)
const [email,setEmail]=useState("")
const [refusRaison, setRefusRaison] = useState('');
const handleRaisonChange = (e) => {
  setRefusRaison(e.target.value);
};
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
   dispatch(updateBenevole(benvoleModif)).then(res=>res.error?console.log({"err":res.error}):console.log({"data":res}))
    }
   // 
  //setValidated(true);
  //handleClose()
  //}
  const handleSubmitAjout = (e) => {
    e.preventDefault();
    //const form = e.currentTarget;
    //if (form.checkValidity() === true) {
      console.log("ajout",benvoleAjout)
     dispatch(createBenevole(benvoleAjout)).then(res=>res.error?console.log({"err":res.error}):console.log({"data":res}))
      }
     // 
    //setValidated(true);
    //handleClose()
    //}
const columns = useMemo(
() => [
  {
    accessorKey: 'image', //access nested data with dot notation
    header: 'Image',
    size: 150,
    Cell: ({ cell}) => (
    <Box
    sx={{
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    }}
    >
    <img
    alt=""
    height={70}
    width={100}
    src={cell.getValue()}
    loading="lazy"
    style={{ borderRadius: '20%' }}
    />
    </Box>),
    },
{
accessorKey: 'nom',
header: 'Nom',
size: 150,
},
{
accessorKey: 'email', //access nested data with dot notation
header: 'Email',
size: 150,
},
{
accessorKey: 'role',
header: 'Role',
size: 150,
},

  {
    accessorKey: 'id',
    header: 'Etat',
    size: 150,
    Cell: ({ cell, row }) => (
    <div >
    <Button
    //onClick={() =>{setShowModal(true) , setUtilisateur(cell.row.original),console.log("cell",cell.row.original)}}
    size="md"
    disabled="true"
    variant="light"
    >
 {cell.row.original.role === "donateur" && cell.row.original.donateur?.isActive ? "active" : ""}
            {cell.row.original.role === "association" && cell.row.original.association?.isActive ? "active" : ""}
            {cell.row.original.role === "entreprise" && cell.row.original.donateur?.isActive ? "active" : ""}
            {!cell.row.original.donateur?.isActive && !cell.row.original.association?.isActive  ? "inactive" : ""}

               </Button>
    </div>
    ),
  },
{
accessorKey: 'id',
header: 'Actions',
size: 150,
Cell: ({ cell, row }) => (
<div >
<Button
onClick={() =>{setShowModal(true) , setUtilisateur(cell.row.original),console.log("cell",cell.row.original)}}
size="md"
style={{whiteSpace: 'nowrap'}}
variant="secondary"
>
plus de détails
</Button>
</div>
),
},

],
[utilisateurs],
);

return (
<>

<div>

<MaterialReactTable  columns={columns} data={utilisateurs} options={{
        tableLayout: 'auto', // Choisissez 'fixed' ou 'auto' selon vos besoins
        headerStyle: {
          backgroundColor: '#f2f2f2',
          fontSize: '16px',
          fontWeight: 'bold',
        },
       // pagination:true,
        //pageSize: 5,
       
        maxBodyHeight: '150px',
        rowStyle: {
          fontSize: '14px',
        },
      }}/>

<Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Les Détails :</Modal.Title>
  </Modal.Header>
  {(utilisateur.role=="donateur") && <> <Modal.Body>
      <Container>
        <Row>
          <Form.Group as={Col} md="6">
            <Form.Label>Adresse :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Adresse"
              name="adresse"
              value={utilisateur.donateur.adresse}
              readOnly
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Numero du téléphone :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Numero du téléphone"
              name="numTelephone"
              value={utilisateur.donateur.numTelephone}
              readOnly
            />
          </Form.Group>
       
          <Form.Group as={Col} md="6">
            <Form.Label>Nombre d'objets Donnés :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Nombre d'objets Donnés"
              name="nbObjetsDonnes"
              value={utilisateur.donateur.nbObjetsDonnes}
              readOnly
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Etat du Compte :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder=""
              //name="nbObjetsDonnes"
              value={utilisateur.donateur.isActive==true ? "activé" : "désactivé"}
              readOnly
            />
          </Form.Group>
        </Row>
      </Container>
    </Modal.Body>
    <Modal.Footer>
   { utilisateur.donateur.isActive==false && <Button variant="outline-success"  onClick={()=>{dispatch(updateActive(utilisateur.email));dispatch(getComptes()).then(res=>console.log(res));setShowModal(false);}}>Activer</Button>}
   { utilisateur.donateur.isActive==true  &&  <Button variant="outline-danger"  onClick={()=>{setEmail(utilisateur.email),setOpenRaisonRefus(true),setShowModal(false)}}>Désactiver</Button>}
    </Modal.Footer></>}
    {(utilisateur.role=="association") &&  <> <Modal.Body>
      <Container>
        <Row>
        <Form.Group as={Col} md="6">
            <Form.Label> Identifiant :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Nombre d'objets"
              name="nbObjets"
              value={utilisateur.association.identifiant}
              readOnly
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Nom du Responsable :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Nombre d'objets Donnés"
              name="nbObjetsDonnes"
              value={utilisateur.association.nomResponsable}
              readOnly
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Adresse :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Adresse"
              name="adresse"
              value={utilisateur.association.adresse}
              readOnly
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Numero du téléphone :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Numero du téléphone"
              name="numTelephone"
              value={utilisateur.association.numTelephone}
              readOnly
            />
          </Form.Group>
          
          <Form.Group as={Col} md="6">
            <Form.Label>Etat du Compte :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder=""
              //name="nbObjetsDonnes"
              value={utilisateur.association.isActive==true ? "activé" : "désactivé"}
              readOnly
            />
          </Form.Group>
        </Row>
      </Container>
    </Modal.Body>
    <Modal.Footer>
{   utilisateur.association.isActive==false &&  <Button variant="outline-success" type="submit"onClick={()=>{dispatch(updateActive(utilisateur.email)).then(er=>{console.log(er)}),setShowModal(false)}} >Activer</Button>}
{     utilisateur.association.isActive==true &&<Button variant="outline-danger" onClick={()=>{setEmail(utilisateur.email),setOpenRaisonRefus(true),setShowModal(false)}}>Désactiver</Button>
} </Modal.Footer></>}
    {(utilisateur.role=="entreprise") && <>  <Modal.Body>
      <Container>
        <Row>
        <Form.Group as={Col} md="6">
            <Form.Label>Identifiant :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Nombre d'objets Donnés"
              name="identifiant"
              value={utilisateur.donateur.entreprise.identifiant}
              readOnly
            />
          </Form.Group>
        <Form.Group as={Col} md="6">
            <Form.Label>Nom du Responsable :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Nombre d'objets Donnés"
              name="nbObjetsDonnes"
              value={utilisateur.donateur.entreprise.nomResponsable}
              readOnly
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Adresse :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Adresse"
              name="adresse"
              value={utilisateur.donateur.adresse}
              readOnly
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Numero du téléphone :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Numero du téléphone"
              name="numTelephone"
              value={utilisateur.donateur.numTelephone}
              readOnly
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Nombre d'objets Donnés :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Nombre d'objets Donnés"
              name="nbObjetsDonnes"
              value={utilisateur.donateur.nbObjetsDonnes}
              readOnly
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Nombre d'objets réparés :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Nombre d'objets Donnés"
              name="nbObjetsDonnes"
              value={utilisateur.donateur.entreprise.nbObjetsRepares}
              readOnly
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Etat du Compte :</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder=""
              //name="nbObjetsDonnes"
              value={utilisateur.donateur.isActive==true ? "activé" : "désactivé"}
              readOnly
            />
          </Form.Group>
        </Row>
      </Container>
    </Modal.Body>
    <Modal.Footer>
{utilisateur.donateur.isActive==false && <Button variant="outline-success" type="submit" onClick={()=>{dispatch(updateActive( utilisateur.email)).then(er=>{console.log(er)}),setShowModal(false)}}>Activer</Button>}
{utilisateur.donateur.isActive==true && <Button variant="outline-danger" onClick={()=>{setEmail(utilisateur.email),setOpenRaisonRefus(true),setShowModal(false)}}>Désactiver</Button>}
</Modal.Footer></>
    }
</Modal>

</div>  
<Modal show={openRaisonRefus} onHide={() => setOpenRaisonRefus(false)} centered>
    <Form  onSubmit={(e) => {
        e.preventDefault();
        dispatch(updateDesactive({ email: email, raison: refusRaison }))
            .then(er => {
                console.log(er + " rrr " + refusRaison);
            });
        setShowModal(false);
        setOpenRaisonRefus(false);
        setRefusRaison("");
        }} > 
    <Modal.Header closeButton>
        <Modal.Title style={{ color: "rgba(200, 16, 6, 0.84)" }}>Raison de désactivation</Modal.Title>
    </Modal.Header>
    <Modal.Body>
   
            <Form.Group controlId="formRaisonRefus">
                
                <Form.Control 
                    as="textarea"
                    required
                    style={{ width: '100%', minHeight: '100px', padding: '10px' }}
                    name="raison"
                    placeholder="Saisissez la raison "
                    value={refusRaison}
                    onChange={(e) => handleRaisonChange(e)}
                />
            </Form.Group>
        
    </Modal.Body>
    <Modal.Footer>
        <Button style={{ backgroundColor: "rgba(22, 35, 39, 0.71)",borderColor:"rgba(22, 35, 39, 0.71)", marginRight: "20px" }} size='sm' onClick={() => setOpenRaisonRefus(false)}>
            Annuler
        </Button>
        <Button style={{ backgroundColor: "rgba(200, 16, 6, 0.84)",borderColor:"rgba(200, 16, 6, 0.84)" }} size='sm' type='submit' /*onClick={(e)=>{e.preventDefault(),dispatch(updateDesactive({email:email,raison:refusRaison})).then(er=>{console.log(er +"rrr"+refusRaison)}),setShowModal(false),setOpenRaisonRefus(false)}}*/>
            Confirmer 
        </Button>
    </Modal.Footer>
    </Form>
</Modal>
</>
)
}
export default Contenu
