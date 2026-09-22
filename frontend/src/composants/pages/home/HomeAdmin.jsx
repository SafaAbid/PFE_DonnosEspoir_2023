import React from 'react'

//import SidebarAdmin from './SidebarAdmin'
import Feed from '../../feed/Feed'
import Rightbar from '../../rightbar/Rightbar'
import './home.css'

//import TopbarAdmin from './TopbarAdmin';
import DemandesAdmin from './DemandesAdmin'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { blue } from '@mui/material/colors'

import { Drawer } from '@mui/material'
import SidebarAdmin from './SideBarAdmin'
import NavBarAdmin from './NavBarAdmin'
import Dashboard from './Dashboard'
const HomeAdmin = () => {
  return (
    <>
      <div class="wrapper" style={{ backgroundColor: "white"}}>
          <SidebarAdmin />
        <div class="main" style={{ backgroundColor: "white"}}>
        <NavBarAdmin />
          <main style={{ backgroundColor: "white" ,marginLeft:"20px",marginTop:'0 px'}} class="content">
            <Dashboard />
          </main>


        </div>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js"></script>
      <script src="js/script.js"></script>
    </>
  )
}

export default HomeAdmin
