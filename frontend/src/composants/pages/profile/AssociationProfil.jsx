import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import NavBarA from '../../navbar/NavBarA';
import { Button,Col, Container, Modal, Row } from 'react-bootstrap';
import SideBar from '../../sideBar2/SideBar';
import Feed from '../../feed/Feed';
import { findCompteById } from '../../../features/utilisateurSlice';
import DrawerExa from '../../exemple/DrawerExe';
import { getBesoinsByAssociation } from '../../../features/besoinSlice';
import { CardContent, Card,  ListItem, Textarea, Typography } from '@mui/joy';

const AssociationProfil = () => {
  const { utilisateur } = useSelector((state) => state.storeUtilisateurs);
  const { besoins } = useSelector((state) => state.storeBesoins);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [showBesoin, setShowBesoin] = useState(false);
  const initFetch = useCallback(() => {
    dispatch(findCompteById(Number(id))).then(res => { console.log(res) })
    dispatch(getBesoinsByAssociation(Number(id))).then(res => console.log(res))
  }, [id])
  useEffect(() => {
    initFetch()
    // console.log("uuffgtghgfhg",id+id+"54")
  }, [initFetch])
  return (
    <>
      <div>
        <DrawerExa />
        <div style={{ marginLeft: "270px", padding: 20, marginTop: "10px" }}>
          <div className="profileRight">
            <div className="profileRightBottom " style={{ marginTop: "30px" }}>
              <Col xs={10} className="content">
                <div className="profileRight">
                  <div className="profileRightTop">
                    <div className="profileCover">
                      <div className='row'>
                        <div className='col-5'>
                          <img style={{ borderRadius: '50%', width: '200px', height: '200px', marginLeft: "80px", marginTop: "30px" }} className="circular-image" src={utilisateur.user?.image} alt="Votre Image" />
                        </div>
                        <div className='col-6'>
                          <table class="table">
                            <tbody>
                              <tr>
                                <td> <i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} className="fa-solid fa-user"></i> Nom :</td> <td> {utilisateur.user?.nom}</td>
                              </tr>
                              <tr><td> <i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} className="fa-solid fa-user"></i> Nom du responsable :</td> <td> {utilisateur.nomResponsable}</td></tr>
                              <tr><td><i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} class="fa-solid fa-location-dot" ></i> Ville :</td><td> {utilisateur.ville}</td></tr>
                              <tr><td><i class="fa-solid fa-location-dot" style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} ></i> Adresse :</td> <td>{utilisateur.adresse} </td></tr>
                              <tr><td><i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} className="fa-solid fa-envelope"></i> Email :</td><td> {utilisateur.user?.email}</td></tr>
                              <tr><td><i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} className="fa-solid fa-phone"></i> Téléphone :</td> <td>{utilisateur.numTelephone}</td></tr>
                              <tr><td><i style={{ margin: '0px', paddingRight: '10px', color: '#566368' }} className="fa-solid fa-calendar-days"></i> Membre depuis le :</td><td>{utilisateur.user?.createdAt ? new Date(utilisateur.user?.createdAt).toISOString().split('T')[0] : ""}</td></tr>
                            </tbody>
                          </table>
                        </div>
                        <div style={{ margin: "10px" }} >
                          <Typography variant="h7" gutterBottom style={{ textAlign: "center", marginLeft: "600px", marginTop: "10px" }}>
                            <p><a style={{ color: "rgba(85, 139, 160, 1)", textDecorationLine: 'underline' }} onClick={() => setShowBesoin(true)}>Consulter les besoins </a></p>
                          </Typography>
                        </div>
                      </div>
                      <hr class="MuiDivider-root">
                      </hr>
                    </div></div>
                  <div className="profileRightBottom" style={{ marginTop: "80px" }}>
                    <Feed />
                  </div>
                </div>
              </Col>

            </div>
          </div>
        </div>
      </div>
      {/* modal des besoins */}
      <Modal show={showBesoin} onHide={() => setShowBesoin(false)} className="modal-with-scroll" size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title> Les Besoins : </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ marginTop: "20px" }}>
          {
            besoins?.length > 0 ? (besoins.map(besoin => (
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
                          <Typography variant='h6' style={{ marginTop: "15px" }}>  <span style={{ color: "black" }}>Description:</span>  </Typography>
                          <Textarea style={{ width: '300px', height: '80px', backgroundColor: "white" }} value={besoin.description} readOnly />
                        </div>
                      </Col>
                      <Col>
                      </Col>
                    </Row>
                  </CardContent>
                </Card>
              </ListItem>

            ))) : <Typography style={{ marginLeft: "290px", marginTop: "10px", marginBottom: "10px" }}> Aucun Besoin </Typography>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ backgroundColor:"rgba(72, 151, 90, 0.68)" ,borderColor:"rgba(72, 151, 90, 0.68)"}} onClick={() => setShowBesoin(false)} >
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AssociationProfil
