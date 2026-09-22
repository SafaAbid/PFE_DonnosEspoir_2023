import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react'
import { Col } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';




const SideBar = () => {
    const {user} = useSelector((state) =>state.auth);
    return (
        <Col xs={2} bg="light" className="sidebar"  style={{textAlign: "left", margin:"0px"}}>
                    
        <ul className="list-unstyled sidebar-nav  mt-4 m-0" style={{textAlign: "left",}}>
            <li className="sidebar-item ">
            <Link to={`/accueil`} className="sidebar-link text-dark">
                <i className="fa-solid fa-house-user pe-2"></i>
                    Accueil
                    </Link>      
            </li>
           { user &&   !user.donateur && <li className="sidebar-item">
                <Link to={`/profil/${user.user && user.user.id}`} className="sidebar-link text-dark">
                <i className="fa-solid fa-user pe-2"></i>
                    Profil 
                </Link>      
    </li>}
            { user && user.donateur && <li className="sidebar-item">
                <Link to={`/profil/${user.donateur.user.id}`} className="sidebar-link text-dark">
                <i className="fa-solid fa-user pe-2"></i>
                    Profil 
                </Link>      
            </li>}
            { user && !user.donateur  && ( user.user &&  user.user.role=="donateur" || user.user && user.user.role=="association") && <li className="sidebar-item">
                <Link to={`/listeDesDemandes/${user.user.id}`} className="sidebar-link text-dark">
                <i className="fa-solid fa-envelope pe-2"></i>
                    Liste des Demandes d'objets
                </Link>      
            </li>}
            
            {user && user.donateur &&<li className="sidebar-item">
                <Link to={`/listeDesDemandes/${user.donateur.user.id}`} className="sidebar-link text-dark">
                <i className="fa-solid fa-envelope pe-2"></i>
                    Liste des Demandes d'objets
                </Link>      
            </li>}
            { (user && user.donateur) && <li className="sidebar-item">
                <Link to={`/listeDemandesReparations/${user.donateur.user.id}`}  className="sidebar-link text-dark">
                <i className="fa-solid fa-user pe-2"></i>
                    liste des demandes de réparation
                </Link>      
            </li>}
            {  (user && user.user?.role=="association")  && <li className="sidebar-item">
                <Link to={`/listeDemandesReparations/${user.user.id}`}  className="sidebar-link text-dark">
                <i className="fa-solid fa-user pe-2"></i>
                    liste des demandes de réparation
                </Link>      
            </li>}
            { user && !user.donateur  &&  <li className="sidebar-item">
                <Link to={`/listeDesDonations/${user.user &&  user.user.id}`} className="sidebar-link text-dark">
                <i className="fa-solid fa-envelope pe-2"></i>
                    Liste des Donations
                </Link>      
            </li>}
            {(user && user.donateur) &&<li className="sidebar-item">
                <Link to={`/listeDesDonations/${user.donateur.user.id}`} className="sidebar-link text-dark">
                <i className="fa-solid fa-envelope pe-2"></i>
                Liste des Donations
                </Link>      
            </li>}
            {(user && user.donateur) &&<li className="sidebar-item">
                <Link to={`/listeDesReparations/${user.donateur.user.id}`} className="sidebar-link text-dark">
                <i className="fa-solid fa-envelope pe-2"></i>
                Liste des réparations
                </Link>      
            </li>}
            {(user && !user.donateur && user.user.role==="association") && <li className="sidebar-item">
                <Link to={`/listeDesReparations/${user.user &&  user.user.id}`} className="sidebar-link text-dark">
                <i className="fa-solid fa-envelope pe-2"></i>
                Liste des réparations
                </Link>      
            </li>}
           { (user && !user.donateur)   && <li className="sidebar-item">
                <Link to={`/rendezVous/${ user.user &&  user.user.id}`} className="sidebar-link text-dark">
                <i className="fa-solid fa-calendar-alt pe-2"></i>
                Liste des rendez-vous
                </Link>      
            </li>}
            
            {user && user.donateur &&<li className="sidebar-item">
                <Link to={`/rendezVous/${user.donateur.user.id}`} className="sidebar-link text-dark">
                <i className="fa-solid fa-envelope pe-2"></i>
                Liste des rendez-vous des donations
                </Link>      
            </li>}
            {user && user.donateur &&<li className="sidebar-item">
                <Link to={`/rendezVousReparation/${user.donateur.user.id}`} className="sidebar-link text-dark">
                <i className="fa-solid fa-envelope pe-2"></i>
                Liste des rendez-vous des réparations
                </Link>      
            </li>}
            {user && !user.donateur && user.user.role==="association" &&<li className="sidebar-item">
                <Link to={`/rendezVousReparation/${user.user.id}`} className="sidebar-link text-dark">
                <i className="fa-solid fa-envelope pe-2"></i>
                Liste des rendez-vous des réparations
                </Link>      
            </li>}
            { user  && !user.donateur  && user.user &&  user.user.role=="donateur" && <li className="sidebar-item">
                <Link to={`/listeassociations`} className="sidebar-link text-dark">
                <i className="fa-solid fa-users pe-2"></i>
                Liste des associations
                </Link>      
            </li>}
            {user && user.donateur && <li className="sidebar-item">
                <Link to={`/listeassociations`} className="sidebar-link text-dark">
                <i className="fa-solid fa-users pe-2"></i>
                Liste des associations
                </Link>      
            </li>}
            { user   && user.user && user.user.role=="association" && <li className="sidebar-item">
                <Link to={`/listebenevoles/${user.user && user.user.id}`} className="sidebar-link text-dark">
                <i className="fa-solid fa-users pe-2"></i>
                Liste des bénévoles
                </Link>      
            </li>}
        </ul>
    </Col>
    );
}

export default SideBar
