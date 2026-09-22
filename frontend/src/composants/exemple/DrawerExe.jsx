import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import FormatListBulletedSharpIcon from '@mui/icons-material/FormatListBulletedSharp';
import VolunteerActivismSharpIcon from '@mui/icons-material/VolunteerActivismSharp';
import { Avatar, Badge, CardContent, Divider,Fade, IconButton, ListItem, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { logout, reset } from '../../features/AuthSlice';
import React, { useCallback, useEffect, useState } from 'react'
import { getNotificationByDonateur, updateEtatNotif } from '../../features/notificationSlice';
import { format } from 'date-fns';
import { Card, Modal } from 'react-bootstrap';
import { Logout } from '@mui/icons-material';
function DrawerExa(props) {
    const {user} = useSelector((state) =>state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
     const [anchorEl, setAnchorEl] = React.useState(null);
     const open = Boolean(anchorEl);
     const location = useLocation();
     
     const handleClick = (event) => {
       setAnchorEl(event.currentTarget);
     };
     const handleClose = () => {
       setAnchorEl(null);
     };
     const LogOutFunction=()=>{
       dispatch(reset());
       dispatch(logout())
       .then(() => {
       navigate("/login");
       });
       }
       const ajusterChaine = (str, maxLength) => {
        if ( str && (str.length > maxLength)) {
            return str.substring(0, maxLength) + '...'; 
        } else {
            return str;
        }
    };
       const [anchorElNotif, setAnchorElNotif] = React.useState(null);
       const openNotif = Boolean(anchorElNotif);
       const handleClickNotif = (event) => {
         setAnchorElNotif(event.currentTarget);
         notifications.slice(0, 5).map((notif)=>{dispatch(updateEtatNotif(notif.id)).then(res=>console.log(res))})
       };
       const handleCloseNotif = () => {
         setAnchorElNotif(null);
       };
       const {isLoggedIn,notifications} = useSelector((state) => state.storeNotifications);
       const [show,setShow]=useState(false)
       const initFetch = useCallback(() => {
         if(user && user.donateur) {
             dispatch(getNotificationByDonateur(user && user.donateur.user.id)).then(er=>console.log(er));
        console.log("les reparations de cette entreprise :",notifications)
       }
        else  if(user && user.user){
         dispatch(getNotificationByDonateur(user && user.user.id)).then(er=>console.log(er));
         console.log("les reparations de cette entreprise :",notifications)
   
        }
         }, [dispatch])
     
         useEffect(() => {
         initFetch()
         }, [initFetch])
    return (
        <>
            <Container fluid>
                <Navbar style={{ height: "70px", marginLeft: user ? "270px" : "0", padding: 20,backgroundColor:"rgba(72, 151, 90, 0.68)" }} expand="lg" className=" mb-3"  fixed="top">
                    <Navbar.Brand href="#">
                    {/* <img
            src="https://res.cloudinary.com/dmbkofiro/image/upload/v1715097579/svg_20240506_141607_0000_q8baqp.svg"
            width="180"
            height="135"
            style={{marginRight:"0px",marginLeft: user ? "0px":"20px",marginTop:"8px"}}
            alt="Logo Donnons Espoir"
        /> */}
        <Link to={'/'}>
        <Typography  variant='h6' color={'white'} style={{fontFamily:'initial',fontSize:23}}><span className='fw-bold'>D</span>onnons<span className='fw-bold'>E</span>spoir </Typography>
           </Link>           
                         </Navbar.Brand>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        <div className='m-2' >
                          {!user && <> 
                          
                          <Link to={"/inscription"} style={{color:"white",fontSize:'17px'}}> S'inscrire  </Link> 
                          <span style={{marginRight: "25px"}}></span>
                          <Link to={"/login"} style={{color:"white",fontSize:'17px', }}> Se connecter </Link></>}
   { user && <Button
     id="fade-button"
     aria-controls={open ? 'fade-menu' : undefined}
     aria-haspopup="true"
     aria-expanded={open ? 'true' : undefined}
     onClick={handleClickNotif}
     variant="outline-dark"
     style={{ justifyContent: "center", display: "grid", alignContent: "center", borderRadius: "100%", width: 40, height: 40 ,color:'white',borderColor:'white'}}
   
   >
<Badge badgeContent={(notifications.filter((notif)=>notif.etat===false)).length} badgeInset="-80%" color="error" >
<NotificationsIcon  /></Badge>
   </Button>
   }
   <Menu
     id="fade-menu"
     MenuListProps={{
       'aria-labelledby': 'fade-button',
     }}
     anchorEl={anchorElNotif}
     open={openNotif}
     onClose={handleCloseNotif}
     TransitionComponent={Fade}
     PaperProps={{
       elevation: 0,
       sx: {
         overflow: 'visible',
         filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
         mt: 1.5,
         height:450,
         width:360,
         '& .MuiAvatar-root': {
           width: 32,
           height: 32,
           ml: -0.5,
           mr: 1,
         },
         '&::before': {
           content: '""',
           display: 'block',
           position: 'absolute',
           top: 0,
           right: 14,
           width: 10,
           height: 10,
           bgcolor: 'background.paper',
           transform: 'translateY(-50%) rotate(45deg)',
           zIndex: 0,
         },
       },
     }}
     transformOrigin={{ horizontal: 'right', vertical: 'top' }}
     anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}

   >

     <MenuItem disabled={true}><h4>Notifications</h4></MenuItem>
     <Divider sx={{border:1}}></Divider>
     <div style={{ maxHeight: '300px', overflowX: 'hidden', overflowY: 'auto' }}>
     {notifications.slice(0, 4).map(notification => (
<div>
 <MenuItem key={notification.id} onClick={ ()=>{setShow(true),notifications.map((notif) => { dispatch(updateEtatNotif(notif.id)).then(res => console.log(res)) }),handleCloseNotif()}} >
  
  { /*<Card sx={{ width: 375, height: 100,backgroundColor:'white'}}>
     <CardContent sx={{ width: 375, height: 100 }}>*/}
     <Row >
     <Col>
     <Typography variant="body1" component="div" style={{ whiteSpace: 'pre-wrap' }}>
           {ajusterChaine(notification.description,70)}
      </Typography>
       </Col>
        <Col style={{marginLeft:"220px"}}>
       <Typography variant="caption" color="textSecondary" align="right">
         {format(new Date(notification.date), 'dd/MM/yyyy  à HH:mm')}
       </Typography>
      </Col>
      <Divider sx={{border:1}}></Divider>
       </Row>
     {/*</CardContent>
   </Card>*/}

 </MenuItem> 

 </div>
))} 

</div>

<div style={{ position: "relative", marginTop: "30px",maxHeight:"10px" }}>
  <div style={{ position: "absolute", bottom: 0, left: "150px", zIndex: 1 }}>
    <Link onClick={() => { setShow(true), notifications.map((notif) => { dispatch(updateEtatNotif(notif.id)).then(res => console.log(res)) }), handleCloseNotif() }} level="title-md" style={{ color: "black" }}>
      Voir Plus
    </Link>
  </div>
</div>
   </Menu>
 </div>
 <Tooltip title={(user &&  user.user )? user.user.nom :(user &&  user.donateur) ? user.donateur.user.nom:"" }>
          <IconButton
            onClick={handleClick}
           
            sx={{ ml: 2 ,width:"40px"}}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
          {user && 
           <Avatar  src={(user &&  user.user )? user.user.image :(user &&  user.donateur) ? user.donateur.user.image :""} sx={{ width: 40, height: 40 }}></Avatar>}
          </IconButton>
        </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            height:120,
            width:160,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar src={(user &&  user.user )? user.user.image :(user &&  user.donateur) ? user.donateur.user.image :""} />
           <Link style={{color:"black"}} to={`/profil/${(user && user.user )? user.user.id :(user &&  user.donateur) ? user.donateur.userIdD :""}`}  >Profil</Link>
        </MenuItem>
        <Divider />
        <MenuItem  onClick={LogOutFunction} style={{color:"black"}}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    {/* <Image src={props.img} roundedCircle width={40} className='m-2' />*/}
                    </Nav>
                </Navbar>
               { user &&  <Offcanvas
                    id={`offcanvasNavbar-expand-sm`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
                    placement="start"
                    show={true}
                    scroll={true}
                    backdrop={false}
                    style={{ width: "270px" , zIndex: "1000"}}
                >
                    {<Offcanvas.Header style={{ justifyContent: "center", display: "flex", alignContent: "center", padding: "10px" }}>
                        <Col md={7.5} style={{ justifyContent: "center", display: "flow", alignContent: "center" }}>
                            <Image src={(user &&  user.user )? user.user.image :(user &&  user.donateur) ? user.donateur.user.image :"https://res.cloudinary.com/dmbkofiro/image/upload/v1714512869/images/fu9t3b1q06x7rdiklh2h.png"} roundedCircle width={110} className='mt-2'/>
                            <h5 style={{ justifyContent: "center", display: "flex", alignContent: "center", marginTop: "3px" }}>{(user &&  user.user )? user.user.nom :(user &&  user.donateur) ? user.donateur.user.nom :"Donnons Espoir"}</h5>
                        </Col>
    </Offcanvas.Header>}
                {  /*  <Offcanvas.Header style={{ justifyContent: "start"}} >
                <Image src="https://res.cloudinary.com/dmbkofiro/image/upload/v1714512869/images/fu9t3b1q06x7rdiklh2h.png" roundedCircle width={110} style={{ width: "100%", height: "auto" }}/>
</Offcanvas.Header>*/}

                    <Offcanvas.Body fluid>
                        <ListGroup variant="flush">
                            <ListGroup.Item variant={location.pathname===`/accueil`?'success':''} as={Link} to={`/accueil`} action href="#link1" style={{ justifyContent: "start", display: "flex", alignContent: "center" , borderColor:"rgba(163, 211, 175, 0.65)"}}  >
               <div> <i className="fas fa-heart" style={{color: "#356232"}}></i></div> 
                <Link to={`/accueil`} className="text-dark" style={{marginLeft:"10px"}}>
                    Accueil
                    </Link>    
                            </ListGroup.Item>
                            { user && !user.donateur && user.user.role!=="administrateur" &&
            <ListGroup.Item variant={location.pathname===`/profil/${user.user && user.user.id}`?'success':''} action as={Link} to={`/profil/${user.user && user.user.id}`} style={{ justifyContent: "start", display: "flex", alignContent: "center",borderColor:"rgba(163, 211, 175, 0.65" }}>
<i class="fas fa-user"  style={{color: "#356232"}}></i>
                <Link to={`/profil/${user.user && user.user.id}`} className="text-dark" style={{marginLeft:"10px"}}>
                    Profil 
                </Link>  
                            </ListGroup.Item>}

                            { user && user.donateur &&           
                            <ListGroup.Item variant={location.pathname===`/profil/${user.donateur.user.id}`?'success':''} action as={Link} to={`/profil/${user.donateur.user.id}`} style={{ justifyContent: "start", display: "flex", alignContent: "center" ,borderColor:"rgba(163, 211, 175, 0.65"}}>
                {/*<PersonSharpIcon/>*/}
                <i class="fas fa-user" style={{color: "#356232"}}></i>
                <Link to={`/profil/${user.donateur.user.id}`} className="text-dark" style={{marginLeft:"10px"}}>
                    Profil 
                </Link>      
                </ListGroup.Item>}
                { user && !user.donateur  && ( user.user &&  user.user.role=="donateur" || user.user && user.user.role=="association") && 
               <ListGroup.Item variant={location.pathname===`/listeDesDemandes/${user.user.id}`?'success':''} action as={Link} to={`/listeDesDemandes/${user.user.id}`} style={{ justifyContent: "start", display: "flex", alignContent: "center" ,borderColor:"rgba(163, 211, 175, 0.65"}}>
               {/*<FormatListBulletedSharpIcon/>*/}
               <div style={{marginTop:"6px"}}>    <i class="fa-solid fa-hand-holding-heart"  style={{color: "#356232"}}></i></div>
                <Link to={`/listeDesDemandes/${user.user.id}`} className="text-dark" style={{marginLeft:"10px"}}>
             
                    Liste des Demandes d'objets
                </Link>      
            
            </ListGroup.Item>}
            {user && user.donateur &&
                        <ListGroup.Item variant={location.pathname===`/listeDesDemandes/${user.donateur.user.id}`?'success':''} action as={Link} to={`/listeDesDemandes/${user.donateur.user.id}`} style={{ justifyContent: "start", display: "flex", alignContent: "center" ,borderColor:"rgba(163, 211, 175, 0.65"}}>
               <div style={{marginTop:"6px"}}><i class="fa-solid fa-hand-holding-heart"  style={{color: "#356232"}}></i></div>
                           {  /* <FormatListBulletedSharpIcon/>*/}
                <Link to={`/listeDesDemandes/${user.donateur.user.id}`} className="text-dark" style={{marginLeft:"10px"}}>
                    Liste des Demandes d'objets
                </Link>      
            </ListGroup.Item>}

            { user && !user.donateur  &&
                        <ListGroup.Item variant={location.pathname===`/listeDesDonations/${user.user &&  user.user.id}`?'success':''} action as={Link} to={`/listeDesDonations/${user.user &&  user.user.id}`} style={{ justifyContent: "start", display: "flex", alignContent: "center",borderColor:"rgba(163, 211, 175, 0.65" }}>
               <div ><i class="fa-solid fa-hand-holding-heart"  style={{color: "#356232"}}></i></div>
                <Link to={`/listeDesDonations/${user.user &&  user.user.id}`} className=" text-dark" style={{marginLeft:"10px"}}>
                    Liste des Donations
                </Link>      
           
            </ListGroup.Item>}
            {(user && user.donateur) &&
                <ListGroup.Item variant={location.pathname===`/listeDesDonations/${user.donateur.user.id}`?'success':''} action as={Link} to={`/listeDesDonations/${user.donateur.user.id}`} style={{ justifyContent: "start", display: "flex", alignContent: "center" ,borderColor:"rgba(163, 211, 175, 0.65" }}>
               <div><i class="fa-solid fa-hand-holding-heart"  style={{color: "#356232"}}></i></div>
                <Link to={`/listeDesDonations/${user.donateur.user.id}`} className="text-dark" style={{marginLeft:"10px"}}>
                Liste des Donations
                </Link>      
              </ListGroup.Item>}
                  { (user && user.donateur) && 
                      <ListGroup.Item variant={location.pathname===`/listeDemandesReparations/${user.donateur.user.id}`?'success':''} action as={Link} to={`/listeDemandesReparations/${user.donateur.user.id}`} style={{ justifyContent: "start", display: "flex", alignContent: "center" ,borderColor:"rgba(163, 211, 175, 0.65"}}>
               <div style={{marginTop:"6px"}}> <i class="fa-solid fa-hammer"  style={{color: "#356232"}}></i></div>
                      <Link to={`/listeDemandesReparations/${user.donateur.user.id}`}  className="text-dark" style={{marginLeft:"10px"}}>
                          liste des demandes de réparation
                      </Link>      
                 
                  </ListGroup.Item> }
      
                  {  (user && user.user?.role=="association")  &&
                      <ListGroup.Item variant={location.pathname===`/listeDemandesReparations/${user.user.id}`?'success':''} action as={Link} to={`/listeDemandesReparations/${user.user.id}`}  style={{ justifyContent: "start", display: "flex", alignContent: "center" ,borderColor:"rgba(163, 211, 175, 0.65"}}>
                        <div style={{marginTop:"6px"}}> <i class="fa-solid fa-hammer"  style={{color: "#356232"}}></i></div>
                      <Link to={`/listeDemandesReparations/${user.user.id}`}  className="text-dark" style={{marginLeft:"10px"}}>
                          liste des demandes de réparation
                      </Link>      
                  </ListGroup.Item>}

            {(user && user.donateur) &&
                          <ListGroup.Item variant={location.pathname===`/listeDesReparations/${user.donateur.user.id}`?'success':''} action as={Link} to={`/listeDesReparations/${user.donateur.user.id}`}style={{ justifyContent: "start", display: "flex", alignContent: "center" ,borderColor:"rgba(163, 211, 175, 0.65"}}>
                           { /*<FormatListBulletedSharpIcon/>*/}
            <div ><i class="fa-solid fa-hammer"  style={{color: "#356232"}}></i></div>
                <Link to={`/listeDesReparations/${user.donateur.user.id}`} className="text-dark" style={{marginLeft:"10px"}}>
                Liste des réparations
                </Link>      
            </ListGroup.Item>}

            {(user && !user.donateur && user.user.role==="association") && 
             <ListGroup.Item variant={location.pathname===`/listeDesReparations/${user.user &&  user.user.id}`?'success':''} action as={Link} to={`/listeDesReparations/${user.user &&  user.user.id}`} style={{ justifyContent: "start", display: "flex", alignContent: "center" ,borderColor:"rgba(163, 211, 175, 0.65"}}>
            <div><i class="fa-solid fa-hammer"  style={{color: "#356232"}}></i></div>
                <Link to={`/listeDesReparations/${user.user &&  user.user.id}`} className="text-dark" style={{marginLeft:"10px"}}>
                Liste des réparations
                </Link>      
            </ListGroup.Item>}
           { (user && !user.donateur)   && 
                       <ListGroup.Item variant={location.pathname===`/rendezVous/${ user.user &&  user.user.id}`?'success':''} action as={Link} to={`/rendezVous/${ user.user &&  user.user.id}`} style={{ justifyContent: "start", display: "flex", alignContent: "center" ,borderColor:"rgba(163, 211, 175, 0.65"}}>
            <div ><i class="fa-solid fa-calendar-days"  style={{color: "#356232"}}></i></div>
                <Link to={`/rendezVous/${ user.user &&  user.user.id}`} className="text-dark" style={{marginLeft:"10px"}}>
                Liste des rendez-vous
                </Link>      
            </ListGroup.Item>}
            {user && user.donateur &&
                <ListGroup.Item variant={location.pathname===`/rendezVous/${user.donateur.user.id}`?'success':''} action as={Link} to={`/rendezVous/${user.donateur.user.id}`} style={{ justifyContent: "start", display: "flex", alignContent: "center" ,borderColor:"rgba(163, 211, 175, 0.65"}}>
            <div style={{marginTop:"6px"}}><i class="fa-solid fa-calendar-days"  style={{color: "#356232"}}></i></div>
                <Link to={`/rendezVous/${user.donateur.user.id}`} className="text-dark" style={{marginLeft:"10px"}} >
                Liste des rendez-vous des donations
                </Link>       
            </ListGroup.Item>}
            {user && user.donateur &&
                <ListGroup.Item variant={location.pathname===`/rendezVousReparation/${user.donateur.user.id}`?'success':''} action as={Link} to={`/rendezVousReparation/${user.donateur.user.id}`} style={{ justifyContent: "start", display: "flex", alignContent: "center" ,borderColor:"rgba(163, 211, 175, 0.65" }}>
            <div style={{marginTop:"6px"}}><i class="fa-solid fa-calendar-days"  style={{color: "#356232"}}></i></div>
                <Link to={`/rendezVousReparation/${user.donateur.user.id}`} className="text-dark" style={{marginLeft:"10px"}}>
                Liste des rendez-vous des réparations
                </Link>      
             </ListGroup.Item>}
            {user && !user.donateur && user.user.role==="association" &&
                         <ListGroup.Item  variant={location.pathname===`/rendezVousReparation/${user.user.id}`?'success':''} action as={Link} to={`/rendezVousReparation/${user.user.id}`} style={{ justifyContent: "start", display: "flex", alignContent: "center",borderColor:"rgba(163, 211, 175, 0.65" }}>
            <div style={{marginTop:"6px"}}><i class="fa-solid fa-calendar-days"  style={{color: "#356232"}}></i></div>
                <Link to={`/rendezVousReparation/${user.user.id}`} className="text-dark" style={{marginLeft:"10px"}}>
                Liste des rendez-vous des réparations
                </Link>       
            </ListGroup.Item>
            }
            { user  && !user.donateur  && user.user &&  user.user.role=="donateur" && 
                        <ListGroup.Item  variant={location.pathname===`/listeassociations`?'success':''} action as={Link} to={`/listeassociations`} style={{ justifyContent: "start", display: "flex", alignContent: "center" ,borderColor:"rgba(163, 211, 175, 0.65"}}>
            <div ><i class="fa-solid fa-calendar-days"  style={{color: "#356232"}}></i></div>
                <Link to={`/listeassociations`} className="text-dark" style={{marginLeft:"10px"}} >
                Liste des associations
                </Link>      
              </ListGroup.Item>}

            {user && user.donateur &&
                <ListGroup.Item action  variant={location.pathname===`/listeassociations`?'success':''} as={Link} to={`/listeassociations`} style={{ justifyContent: "start", display: "flex", alignContent: "center" ,borderColor:"rgba(163, 211, 175, 0.65"}}>
            <div><i class="fa-solid fa-users"  style={{color: "#356232"}}></i></div>
                <Link to={`/listeassociations`} className="text-dark" style={{marginLeft:"10px"}} >
                Liste des associations
                </Link>      
            </ListGroup.Item>}
            { user   && user.user && user.user.role=="association" && 
            <ListGroup.Item action  variant={location.pathname===`/listebenevoles/${user.user && user.user.id}`?'success':''} as={Link} to={`/listebenevoles/${user.user && user.user.id}`} style={{ justifyContent: "start", display: "flex", alignContent: "center" ,borderColor:"rgba(163, 211, 175, 0.65" }}>
            <div><i class="fa-solid fa-users"  style={{color: "#356232"}}></i></div>
                <Link to={`/listebenevoles/${user.user && user.user.id}`} className="text-dark" style={{marginLeft:"20px"}}>
                Liste des bénévoles
                </Link>      
            
            </ListGroup.Item>}
                        </ListGroup>
                    </Offcanvas.Body>
                </Offcanvas>}
            </Container>
                 {/* modal pour toutes les notifications */}
           <Modal show={show} onHide={()=>setShow(false)} className="modal-with-scroll" centered>
        <Modal.Header closeButton>
          <Modal.Title>Notifications :</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {notifications && notifications.length > 0 && notifications.map(notif => (
                          
                             <ListItem  style={{ marginBottom: '-20px' }} >
                               
                                    <Card style={{ width: '100%' }}>
                                        <CardContent>
                                        <Row >
        <Col>
        <Typography variant="body1" component="div" style={{ whiteSpace: 'pre-wrap' }}>
              {notif.description}
            </Typography>
          </Col>
                    <Col style={{marginLeft:"260px" ,marginBottom:"-20px"}}>
          <Typography variant="caption" color="textSecondary" align="right">
            
            {format(new Date(notif.date), 'dd/MM/yyyy  à HH:mm')}

          </Typography>
         </Col>
          </Row>
                                    </CardContent>
                                    </Card>  
                                   
                                </ListItem>
                             
                        ))}        
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShow(false)} >
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
        </>
    );
}

export default DrawerExa;