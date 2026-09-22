import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout, reset } from '../../../features/AuthSlice';
import { Logout } from '@mui/icons-material';
const NavBarAdmin = () => {
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
  return (
    <Navbar style={{backgroundColor:"rgba(106, 170, 75, 0.4)",height:"60px"}}>
    <Container>
      <Navbar.Brand href="#home"></Navbar.Brand>
      <Nav className="me-auto">
        
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', width: 52, height: 52,marginLeft:110  }}>
        
        <Tooltip title={user && user.user &&  user.user.nom}>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
          {user &&  <Avatar  src={ user.user && user.user.image} sx={{ width: 52, height: 52 }}></Avatar>}
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
        <Link style={{color:"black"}} to={`/profilAdmin`}>
        <MenuItem onClick={handleClose}>
          <Avatar src={user.user && user.user.image} /> Profil
        </MenuItem></Link>
        <Divider />
        <MenuItem  onClick={LogOutFunction} style={{color:"black"}}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      </Nav>
    </Container>
  </Navbar>)
}

export default NavBarAdmin
