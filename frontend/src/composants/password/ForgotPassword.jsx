import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgot } from "../../services/Authservice";
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const [email, setEmail] = useState()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await forgot(email)
      .then(res => {
        if (res.data.Status === "Success") {
          toast.success("Un email vous a été envoyé pour la modification du mot de passe.", {
            position: "top",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
              width: "500px", 
              fontSize: "16px",
              marginRight: "200px"
            }
          });
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          toast.error("Vérifier votre email.", {
            position: "top",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
              width: "500px",
              fontSize: "16px",
              
            }
          });
        }
      }).catch(err => console.log(err))
  }
  return (

    <Grid container justifyContent="center" alignItems="center" style={{ backgroundColor: '#CCCCCC', height: '100vh' }}>
      <Paper elevation={5} style={{ padding: '24px', width: '40%', height: "45%", margin: 'auto', marginTop: '190px' }}>
        <Typography variant="h4" gutterBottom>Mot de passe oublié</Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '25px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="email">
              <Typography variant="h6" >Email :</Typography>
            </label>
            <TextField
              required
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              variant="outlined"
              fullWidth
              style={{ borderRadius: '0' }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" variant="contained" color="success" fullWidth style={{ borderRadius: '0', marginTop: "15px" }}>Envoyer</Button>
        </form>
      </Paper>
    </Grid>
  )
}
export default ForgotPassword;