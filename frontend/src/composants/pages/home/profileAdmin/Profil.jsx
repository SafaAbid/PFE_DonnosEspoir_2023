import React from 'react'
import Contenu from './Contenu'
import SidebarAdmin from '../SideBarAdmin'
import NavBarAdmin from '../NavBarAdmin'

const Profil = () => {
  return (
    <>
    <div class="wrapper">
        <SidebarAdmin/>
        <div class="main" style={{ backgroundColor: "white"}}>
  <NavBarAdmin/>
            <main  style={{backgroundColor:"white"}} class="content px-3 py-2">
             <Contenu/>
            </main>
        
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/script.js"></script>
    </>
  )
}

export default Profil
