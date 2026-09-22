import React from 'react'
import { blue } from '@mui/material/colors';
import { AspectRatio, Card, CardContent, CardOverflow, Typography } from '@mui/joy';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Footer from '../Footer';
import Categorie from './Categorie';

const Bienvenue = () => {
    const { user } = useSelector((state) => state.auth);
    return (
        <div>

            <Nav class="navbar navbar-expand-lg navbar-dark fixed-top" style={{ backgroundColor: "rgba(167, 216, 137, 0.5)", height: "70px" }} id="mainNav">
                <div class="container ">
                    <img src="https://res.cloudinary.com/dmbkofiro/image/upload/v1715097579/svg_20240506_141607_0000_q8baqp.svg" style={{ width: "120px",marginTop:10,marginLeft:-50 }} alt="..." />
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                        Menu
                        <i class="fas fa-bars ms-1"></i>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarResponsive">
                        <ul class="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
                            <li class="nav-item"><a class="nav-link" href="#services">Services</a></li>
                            <li class="nav-item"><a class="nav-link" href="#about">A Propos</a></li>
                            { /*<li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>*/}
                            <li class="nav-item"><Nav.Link class="nav-link" as={Link} to='/accueil'>Accueil</Nav.Link></li>
                            <li class="nav-item"><Nav.Link class="nav-link" as={Link} to='/inscription'>Inscription</Nav.Link></li>
                            <li class="nav-item"><Nav.Link class="nav-link" as={Link} to='/login'>Connexion</Nav.Link></li>
                        </ul>
                    </div>
                </div>
            </Nav>

            <header class="masthead">
                <div class="container">
                    <div className='container2'>
                        <div class="masthead-subheading">Bienvenue ! </div>
                        <div class="masthead-heading text-uppercase">" Rejoignez-nous dans notre mission de changer des vies grâce à votre générosité"</div>
                        <Link to={(user && user.user && user.user.role === "administrateur") ? "admin" : "accueil"} style={{ color: 'white' }}>
                            <a class="btn  btn-md text-uppercase" style={{ backgroundColor: 'rgba(139, 178, 114, 1)', marginTop: "-60px", padding: "11px" }} href="#services">Commencer &nbsp; <i class="fa-solid fa-arrow-right"></i></a>
                        </Link> </div>
                </div>
            </header>

            <section class="page-section" id="services">
                <div class="container">
                    <div class="text-center">
                        <h2 class="section-heading text-uppercase"> Nos Services</h2>
                        <h3 class="section-subheading text-muted"></h3>
                    </div>
                    <div class="row text-center">
                        <div class="col-md-4">
                            <span class="fa-stack fa-4x">
                                <i class="fas fa-circle fa-stack-2x " style={{ "color": "rgba(96, 119, 150, 0.8)" }}></i>
                                <i class="fas fa-user fa-stack-1x fa-inverse"></i>
                            </span>
                            <h4 class="my-3">Donateur</h4>
                            <p class="text-muted">Vous avez des objets dont vous n'avez plus besoin? Transformez-les en sources de bienfaits en les donnant à ceux qui en ont le plus besoin.</p>
                        </div>
                        <div class="col-md-4">
                            <span class="fa-stack fa-4x">
                                <i class="fas fa-circle fa-stack-2x " style={{ "color": "rgba(96, 119, 150, 0.8)" }}></i>
                                <i class="fas fa-hands-helping fa-stack-1x fa-inverse"></i>
                            </span>
                            <h4 class="my-3">Association</h4>
                            <p class="text-muted">Grâce à notre plateforme de dons, les associations peuvent accéder à une large gamme d'objets donnés par des personnes généreuses comme vous.</p>
                        </div>
                        <div class="col-md-4">
                            <span class="fa-stack fa-4x">
                                <i class="fas fa-circle fa-stack-2x " style={{ "color": "rgba(96, 119, 150, 0.8)" }}></i>
                                <i class="fas fa-building fa-stack-1x fa-inverse"></i>
                            </span>
                            <h4 class="my-3">Entreprise Éco-Responsable</h4>
                            <p class="text-muted">Les entreprises partenaires offrent des services de réparation gratuits pour les objets endommagés avant qu'ils ne soient donnés aux personnes dans le besoin.</p>
                        </div>
                    </div>
                </div>
            </section>

                <section class="page-section" id="contact" /*style={{backgroundColor:"rgba(214, 199, 171, 1)"}}*/ >
                    <Categorie></Categorie>
                </section>
            <section class="page-section" id="about">
                <div class="text-center">
                    <h2 class="section-heading text-uppercase">A propos de nous</h2>
                    <h3 class="section-subheading text-muted"></h3>
                </div>
                <div class="container px-4 text-center">
                    <div class="row ">
                        <div class="col mt-4 "  >
                            <div class="   mt-1 text-muted" style={{
                                fontSize: "1rem",
                                fontWeight: "600",
                                lineHeight: "1.5rem",
                                //marginBottom: "4rem",
                                color: "#000",

                            }}>
                                <div style={{ marginTop: "140px" }}>
                                    Chez Donnos Espoir, nous croyons en la puissance de la générosité et de la solidarité pour créer un impact positif dans le monde. Notre mission est de faciliter le processus de don d'objets inutilisés, tout en favorisant la réparation et la réutilisation pour réduire le gaspillage et soutenir les personnes dans le besoin.
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="p-3 shadow-lg" ><img width={"500px"} height={"450px"} src='https://res.cloudinary.com/dmbkofiro/image/upload/v1710201665/images/dvvmrskuteztpruyoerw.jpg'></img></div>
                        </div>
                    </div>
                </div>
            </section>



            {/*<section class="page-section" id="contact" style={{backgroundColor:"rgba(214, 199, 171, 1)"}} >
            <div class="container"  >
                <div class="text-center">
                    <h2 class="section-heading text-uppercase" style={{color:"black"}} >Contacter Nous</h2>
                    <h3 class="section-subheading text-muted"></h3>
                </div>
               
                <form id="contactForm" data-sb-form-api-token="API_TOKEN">
                    <div class="row align-items-stretch mb-5">
                        <div class="col-md-6">
                            <div class="form-group">
                              
                                <input class="form-control" id="name" type="text" placeholder="Nom *" data-sb-validations="required" />
                                <div class="invalid-feedback" data-sb-feedback="name:required">A name is required.</div>
                            </div>
                            <div class="form-group">
                      
                                <input class="form-control" id="email" type="email" placeholder="Email *" data-sb-validations="required,email" />
                                <div class="invalid-feedback" data-sb-feedback="email:required">An email is required.</div>
                                <div class="invalid-feedback" data-sb-feedback="email:email">Email is not valid.</div>
                            </div>
                            <div class="form-group mb-md-0">
                              
                                <input class="form-control" id="phone" type="tel" placeholder="Téléphone *" data-sb-validations="required" />
                                <div class="invalid-feedback" data-sb-feedback="phone:required">A phone number is required.</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group form-group-textarea mb-md-0">
                             
                                <textarea class="form-control" id="message" placeholder="Message *" data-sb-validations="required"></textarea>
                                <div class="invalid-feedback" data-sb-feedback="message:required">A message is required.</div>
                            </div>
                        </div>
                    </div>
                   
                    <div class="d-none" id="submitSuccessMessage">
                        <div class="text-center text-white mb-3">
                            <div class="fw-bolder">Form submission successful!</div>
                            To activate this form, sign up at
                            <br />
                            <a href="https://startbootstrap.com/solution/contact-forms">https://startbootstrap.com/solution/contact-forms</a>
                        </div>
                    </div>
                 
                    <div class="d-none" id="submitErrorMessage"><div class="text-center text-danger mb-3">Error sending message!</div></div>
                   
                    <div class="text-center"><button class="btn  btn-xl text-uppercase " style={{backgroundColor:"rgba(185, 137, 92, 0.47)" , color:"black"}} id="submitButton" type="submit">Send Message</button></div>
                </form>
            </div>
</section>*/}
            <Footer></Footer>
        </div>

    )
}

export default Bienvenue
