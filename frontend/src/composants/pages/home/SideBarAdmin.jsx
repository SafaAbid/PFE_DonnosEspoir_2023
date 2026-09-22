import { Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const SidebarAdmin = () => {
    return (
        <aside id="sidebar" style={{ backgroundColor: "white", marginTop: "-100" ,}} class="js-sidebar">

            <div style={{ backgroundColor: "rgba(106, 170, 75, 0.4)", color: "black", marginTop: "-100" }} class="h-100" >
                <div class="sidebar-logo" style={{ backgroundColor: "rgba(44, 88, 22, 0.5)", color: "white", height: 60 }}>
                    <Typography variant='h6' color={'black'} style={{ fontFamily: 'serif', fontSize: 25, marginTop: -7 }} className='fw-bold'><span className='fw-bold'>D</span>onnons<span className='fw-bold'>E</span>spoir </Typography>
                </div>
                <ul class="sidebar-nav">

                    <li class="sidebar-item" style={{ color: "black",marginTop:"10px",marginBottom:"10px" }}>
                        <Link to={"/admin"} class="sidebar-link" style={{ color: "black" ,fontStyle:'oblique', fontSize:'15px' }}>
                            <i class="fa-solid fa-list pe-2"></i>
                            Tableau de bord
                        </Link>

                    </li>
                    <li class="sidebar-item" style={{marginBottom:"10px"}}>
                        <Link to={"/listeDesComptes"} class="sidebar-link collapsed" data-bs-target="#pages"
                            aria-expanded="false" style={{ color: "black" ,fontStyle:'oblique', fontSize:'15px' }}><i class="fa-solid fa-file-lines pe-2"></i>
                            Liste Des Comptes
                        </Link>
                    </li>
                    <li class="sidebar-item" style={{marginBottom:"10px"}}>
                        <Link to={"/listeDesPublications"} class="sidebar-link collapsed" data-bs-target="#posts"
                            aria-expanded="false" style={{ color: "black" ,fontStyle:'oblique', fontSize:'15px' }}><i class="fa-solid fa-sliders pe-2"></i>
                            Liste Des publications d'objets
                        </Link>

                    </li>
                    <li class="sidebar-item">
                        <Link to={"/listeDesCategories"} class="sidebar-link collapsed" data-bs-target="#auth"
                            aria-expanded="false" style={{ color: "black",fontStyle:'oblique', fontSize:'15px'  }}><i class="fa-regular fa-user pe-2"></i>
                            Liste Des Catégories
                        </Link>

                    </li>

                </ul>
            </div>
        </aside>
    )
}

export default SidebarAdmin
