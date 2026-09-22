import React from 'react'
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {resetPass} from "../../services/Authservice";
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';

function ResetPassword() {
const [motDePasse,setMotDePasse] = useState()
const navigate = useNavigate()

const {id,token} = useParams()
const handleSubmit = async (e) => {
e.preventDefault()
await resetPass(id,token,motDePasse)
.then(res => {
if(res.data.Status === "Success") {
navigate('/login')
}
}).catch(err => console.log(err))
}
return(
    <Grid container justifyContent="center" alignItems="center" style={{ backgroundColor: '#CCCCCC', height: '100vh' }}>
    <Paper elevation={3} style={{ padding: '24px', width: '40%',height:"45%", margin: 'auto', marginTop: '190px' }}>
      <Typography variant="h4" gutterBottom>Changer le mot de passe</Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '25px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label>
          <Typography variant="h6" >Nouveau Mot de passe:</Typography>
          </label>
          <TextField
            type="text"
            placeholder="Mot De Passe"
            autoComplete="off"
            name="email"
            variant="outlined"
            fullWidth
            style={{ borderRadius: '0' }}
            onChange={(e) => setMotDePasse(e.target.value)}
            />
        </div>
        <Button type="submit" variant="contained" color="success" fullWidth style={{ borderRadius: '0',marginTop:"15px" }}>Envoyer</Button>
      </form>
    </Paper>
  </Grid>

)
}
export default ResetPassword;