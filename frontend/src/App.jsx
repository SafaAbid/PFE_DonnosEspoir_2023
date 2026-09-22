import { useState } from 'react'
import { ToastContainer } from 'react-toastify';
import HomeAdmin from './composants/pages/home/HomeAdmin'
//import Home from './composants/Home/Home.html'
import Profile from './composants/pages/profile/Profile'

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'react-bootstrap'
import "@fortawesome/fontawesome-free/css/all.css";
import Inscription from './composants/inscription/Inscription'
import Login from './composants/login/Login'

import Bienvenue from './composants/bienvenue/Bienvenue';
import HomePage from './composants/Accueil/HomePage';
import ForgotPassword from './composants/password/ForgotPassword';
import ResetPassword from './composants/password/ResetPassword';
import ListeDesDemandes from './composants/listeDesDemandeObjets/ListeDesDemandes';
import ListeDesDonations from './composants/listeDesDonations/ListeDesDonations';
import RendezVousPage from './composants/rendezVous/RendezVousPage';
import ListeDesAssociations from './composants/listeDesAssociations/ListeDesAssociations';
import ListeDesBenevoles from './composants/listeDesBenevoles/ListeDesBenevoles';
import ListeDemandesReparation from './composants/listeDesDemandesDeReparation/ListeDemandesReparation';
import ListeDesReparation from './composants/listeDesReparations/ListeDesReparation';
import ListeDesComptes from './composants/pages/home/listeDesComptes/ListeDesComptes';
import ListeDesPublications from './composants/pages/home/listeDesPublications/ListeDesPublications';
import ListeDesCategories from './composants/pages/home/listeDesCategories/ListeDesCategories';
import RendezVousReparation from './composants/rendezVousReparation/RendezVousReparation';
import Profil from './composants/pages/home/profileAdmin/Profil';
import AssociationProfil from './composants/pages/profile/AssociationProfil';
import Dashboard from './composants/pages/home/Dashboard';
import ProtectedRouteAdmin from './protectedRoutes/ProtectedRouteAdmin';
import ProtectedRouteAsso from './protectedRoutes/ProtectedRouteAsso';
import ProtectedRouteDon from './protectedRoutes/ProtectedRouteDon';
import ProtectedRouteEntreprise from './protectedRoutes/ProtectedRouteEntreprise';
import ProtectedRoute from './protectedRoutes/ProtectedRoute';
import ProtectedRouteInscri from './protectedRoutes/ProtectedRouteInscri';
//import Home2 from './composants/Home/Home2';

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <ToastContainer />
      <Router>

        <Routes>
          <Route path='/' element={<Bienvenue />} />
         
          <Route path='/accueil' element={<HomePage />} />
          <Route path='/login' element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
          <Route path="/reset_password/:id/:token" element={<ResetPassword />}></Route>
<Route element={<ProtectedRouteInscri/>}>
          <Route path='/inscription' element={<Inscription />} />
          </Route>
          <Route element={<ProtectedRoute/>}>
          
            <Route element={<ProtectedRouteAdmin />}>
              <Route path='/admin' element={<HomeAdmin />} />
              <Route path='/profilAdmin' element={<Profil />} />
              <Route path='/listeDesComptes' element={<ListeDesComptes />} />
              <Route path='/listeDesPublications' element={<ListeDesPublications />} />
              <Route path='/listeDesCategories' element={<ListeDesCategories />} />
            </Route>
            <Route element={<ProtectedRouteAsso />}>
              <Route path='/listebenevoles/:id' element={<ListeDesBenevoles />} />
            </Route>
            <Route path='/listeDesDonations/:id' element={<ListeDesDonations />} />
            <Route path='/listeDesDemandes/:id' element={<ListeDesDemandes />} />
            <Route path='/rendezVous/:id' element={<RendezVousPage />} />
            <Route path='/profil/:id' element={<Profile />} />
            <Route element={<ProtectedRouteDon />}>
              <Route path='/listeassociations' element={<ListeDesAssociations />} />
              <Route path='/associationProfil/:id' element={<AssociationProfil />} />""
            </Route>
            <Route element={<ProtectedRouteEntreprise />}>
              <Route path='/rendezVousReparation/:id' element={<RendezVousReparation />} />
              <Route path='/listeDemandesReparations/:id' element={<ListeDemandesReparation />} />
              <Route path='/listeDesReparations/:id' element={<ListeDesReparation />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>

  )
}

export default App
