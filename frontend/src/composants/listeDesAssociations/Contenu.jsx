import { Avatar, Card, CardContent, Grid, Typography } from '@mui/joy';
import { CardMedia, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Contenu = () => {
    const {user} = useSelector((state) =>state.auth);
    const {utilisateurs, isLoading, error } = useSelector((state) => state.storeUtilisateurs);
    const [filterValue, setFilterValue] = useState('');
    const handleFilterChange = (event) => {
        setFilterValue(event.target.value);
    };
    const filteredUtilisateurs = utilisateurs && utilisateurs.length!==0 && utilisateurs.filter(uti=>
        uti.user?.nom.toLowerCase().includes(filterValue.toLowerCase())
    );
    return (
        <>
        <h2 style={{margin:"20px"}}> Liste Des Associations :</h2>
      <div style={{marginTop:"90px",marginBottom:"20px"}}>
     <TextField id="outlined-basic" label="chercher par nom" variant="outlined" size="small"  value={filterValue}
                    onChange={handleFilterChange}  />
                    </div> 
{filterValue.length>0 && filteredUtilisateurs.length > 0 ? (
                filteredUtilisateurs.map((utilisateur, ind) => (
                    <Grid item xs={10} key={utilisateur.id} style={{ marginLeft: "90px" }}>
                        <Card sx={{ display: 'flex', flexDirection: 'row' }} variant="outlined">
                            <Avatar
                                sx={{ width: 150, height: 150, objectFit: 'cover', margin: '20px' }}
                                alt={utilisateur.user.nom}
                                src={utilisateur.user.image}
                            />
                            <CardContent style={{ marginLeft: "70px" }}>
                                <Typography variant="body2" className="mb-1 mt-2">
                                    <strong>Nom de l'association:</strong>{" "}
                                    {utilisateur.user.nom}
                                </Typography>
                                <Typography variant="body2" className="mb-1 ">
                                    <strong>Nom du Responsable :</strong>{" "}
                                    {utilisateur.nomResponsable}
                                </Typography>
                                <Typography variant="body2" className="mb-1" >
                                    <strong>Email:</strong> {utilisateur.user.email}
                                </Typography>
                                <Typography variant="body2" className="mb-1" >
                                    <strong>Téléphone:</strong> {utilisateur.numTelephone}
                                </Typography>
                                <Typography variant="body2" className="mb-1 ">
                                    <strong>Adresse:</strong>{" "}
                                    {utilisateur.adresse}
                                </Typography>
                                {/* Ajoutez d'autres informations de l'utilisateur ici selon votre modèle de données */}
                            </CardContent>
                            <div style={{ marginTop: '80px', marginRight: '70px' }}>
                                <Link to={`/associationProfil/${utilisateur.id}`} style={{ color: "black" }}>Voir les Activités </Link>
                            </div>
                        </Card>
                    </Grid>
                ))
            ) :  filteredUtilisateurs.length == 0 && (
                <Grid item xs={10}  style={{marginLeft:"400px" , marginTop:"150px"}}>
                <Typography variant="h1" style={{ marginLeft: "20px" }}> Aucun résultat trouvé.</Typography></Grid>
            )}
            {filterValue.length==0 && utilisateurs ? (
                utilisateurs.map((u, ind) => (
                    <Grid item xs={10} key={u.id} style={{marginLeft:"90px"}}>
                        <Card sx={{ display: 'flex', flexDirection: 'row' }} variant="outlined">
                            <Avatar 
                                sx={{ width: 150, height: 150, objectFit: 'cover', margin: '20px' }}
                                alt={u.user?.nom}
                                src={u.user?.image}
                            />         
                            <CardContent style={{ marginLeft: "70px" }}>
                                <Typography variant="body2" className="mb-1 mt-2">
                                    <strong>Nom de l'association:</strong>{" "}
                                    {u.user?.nom}
                                </Typography>
                                <Typography variant="body2" className="mb-1 ">
                                    <strong>Nom du Responsable :</strong>{" "}
                                    {u.nomResponsable}
                                </Typography>
                                <Typography variant="body2" className="mb-1" >
                                    <strong>Email:</strong> {u.user?.email}
                                </Typography>
                                <Typography variant="body2" className="mb-1" >
                                    <strong>Téléphone:</strong> {u.numTelephone}
                                </Typography>
                                <Typography variant="body2" className="mb-1 ">
                                    <strong>Adresse:</strong>{" "}
                                    {u.adresse}
                                </Typography>
                                {/* Ajoutez d'autres informations de l'utilisateur ici selon votre modèle de données */}
                            </CardContent>
                            <div style={{ marginTop: '80px', marginRight: '70px' }}>
                            <Link to={`/associationProfil/${u.user?.id}`} style={{ color: "black" }}>Voir les Activités</Link>
                            </div>
                        </Card>
                    </Grid>
                ))
            ) : <></>}
        </>
    )
}

export default Contenu
