import { Logout,  PersonAdd, Settings } from '@mui/icons-material';
import { Avatar, Badge, Box, CardContent, Divider, Fade, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Col, Container, Modal, Nav, Navbar, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../../features/AuthSlice';
import { Link, useNavigate } from 'react-router-dom';
import NotificationsMenu  from 'react-notifications-menu';
import './notification-menu.css';
import { getNotificationByDonateur } from '../../features/notificationSlice';
import { format } from 'date-fns';
//import { Notifications } from '@mui/icons-material';

const NavBarA = () => {
  const dispatch = useDispatch();
 const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const {user} = useSelector((state) =>state.auth);
  const LogOutFunction=()=>{
    dispatch(reset());
    dispatch(logout())
    .then(() => {
    navigate("/login");
    });
    }
    const [anchorElNotif, setAnchorElNotif] = React.useState(null);
    const openNotif = Boolean(anchorElNotif);
    const handleClickNotif = (event) => {
      setAnchorElNotif(event.currentTarget);
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
    <div>
      <Navbar className='top ' bg="" variant="" expand="lg"  style={{backgroundColor:"rgba(224, 189, 155, 1)",height:"80px"}}>
            <Container>

           <Link to={"/accueil"}>   <Navbar.Brand >Donnons Espoir</Navbar.Brand></Link>  
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Accueil</Nav.Link>
                        <Nav.Link href="#link">A propos</Nav.Link>
                        {/* Ajoutez d'autres liens de navigation au besoin */}
                    </Nav>
                </Navbar.Collapse>
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
{           /*     <div style={{marginTop:"320px",marginLeft:"650px"}}>
      <NotificationsMenu
  data={[
    {
      image: "logo",
      message: 'Kameshwaran S had shared a feedback with you.',
      detailPage: '/',
    },
    {
      image: "logo",
      message: (
        <p>
          Kameshwaran S had shared a{' '}
          <span style={{ color: '#7ac2fa' }}>feedback</span> with you.
        </p>
      ),
      detailPage: '/',
    },
  ]}
  header={{
    title: 'Notifications',
    option: { text: 'View All', onClick: () => console.log('Clicked') },
  }}
  classNamePrefix="notification-menu"
  headerBackgroundColor="white"
/>
</div>*/}  
    <div>
   

      <IconButton
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClickNotif}
      >
 <Badge badgeContent={notifications.length} badgeInset="-80%" color="error" >
       <i class="fa-regular fa-bell"></i></Badge>
      </IconButton>
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
    <MenuItem key={notification.id} onClick={handleCloseNotif} >
     
     { /*<Card sx={{ width: 375, height: 100,backgroundColor:'white'}}>
        <CardContent sx={{ width: 375, height: 100 }}>*/}
        <Row >
        <Col>
        <Typography variant="body1" component="div" style={{ whiteSpace: 'pre-wrap' }}>
              {notification.description}
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
  
  <div style={{marginTop:"30px"}}>
  <div  style={{marginLeft:"150px" , height:"5px"}}>
  <Link onClick={()=> {setShow(true),handleCloseNotif()}} level="title-md" style={{color:"black"}}>
  Voir Plus
      </Link>
  </div></div>
      </Menu>
    </div>
        <Tooltip title={(user &&  user.user )? user.user.nom :(user &&  user.donateur) ? user.donateur.user.nom:"" }>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
          {user &&  <Avatar  src={(user &&  user.user )? user.user.image :(user &&  user.donateur) ? user.donateur.user.image :""} sx={{ width: 52, height: 52 }}></Avatar>}
          </IconButton>
        </Tooltip>
      </Box>
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
           <Link style={{color:"black"}} to={`/profil/${(user &&  user.user )? user.user.id :(user &&  user.donateur) ? user.donateur.userIdD :""}`}  >Profil</Link>
        </MenuItem>
        <Divider />
        <MenuItem  onClick={LogOutFunction} style={{color:"black"}}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

            </Container>
        </Navbar>
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
    </div>
  )
}

export default NavBarA
