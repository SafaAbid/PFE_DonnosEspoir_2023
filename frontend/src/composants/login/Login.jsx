import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { login } from '../../features/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Alert, Snackbar } from '@mui/material';
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Login() {
  const {isLoggedIn,user,errorMessage} = useSelector((state) => state.auth);
  const [errors, setErrors] = React.useState({});
  const navigate = useNavigate()
 
  const[utilisateur,setUtilisateur]=React.useState({});
  //const {user} = useSelector((state) =>state.auth);
const [message,setMessage]=React.useState("")
  const dispatch = useDispatch();
  const handlechange=(e)=>{
    setUtilisateur({...utilisateur,[e.target.name]:e.target.value})
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!utilisateur.email || !utilisateur.motDePasse) {
      setErrors({ email: !utilisateur.email ? "L'adresse e-mail est requise" : '', password: !utilisateur.motDePasse ? 'Le mot de passe est requis' : '' });
    } else {
      dispatch(login(utilisateur)).then(res=>{
        console.log(res)
        if (res.payload && res.payload.response && res.payload.response.data && res.payload.response.data.message) {
          setMessage(res.payload.response.data.message);
        } else if (res.payload && res.payload.message) {
          setMessage(res.payload.message);
        } else {
          setMessage("Une erreur s'est produite lors de la connexion.");
        }
        });
    }
  };
  React.useEffect(() => {
  if (isLoggedIn  && !user?.donateur &&  user?.user?.role === "administrateur") {
    navigate("/admin");
  } else if ((isLoggedIn && !user?.donateur && user?.user?.role !== "administrateur")  ) {
    navigate("/accueil");
  } else if(isLoggedIn && user?.donateur && user?.donateur.user.role==="entreprise"){
    navigate("/accueil");
  }
}, [navigate, isLoggedIn])

  
  return (
   <div >
    <div className="container" style={{height: "100%",
      //backgroundImage: "url('https://res.cloudinary.com/dmbkofiro/image/upload/v1710953016/images/vq6zx2s0mqm48xxkvhrj.png')",
      //backgroundSize: "cover",
      //display: "flex",
      //justifyContent: "center",
      marginTop:"50px",
      alignItems: "center"}}>
        {message && (
  <Snackbar open={true} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
    <Alert severity="error">{message}{"   "}
    
</Alert>
  </Snackbar>
)}
    <ThemeProvider theme={defaultTheme}  >
      <Container component="main" maxWidth="xs" style={{border:"solid rgba(201, 162, 72, 0.8)" ,marginTop:"20px" ,backgroundImage:'src="https://res.cloudinary.com/dmbkofiro/image/upload/v1710953016/images/vq6zx2s0mqm48xxkvhrj.png"'}}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        <Link to={'/'}><img src="https://res.cloudinary.com/dmbkofiro/image/upload/v1715098661/svg_20240507_171632_0000_lnuhvs.svg" alt="" style={{width:250,marginTop:-100,marginBottom:-50}} /></Link> 
          <Typography style={{color:'black'}} component="h1" variant="h5">
              Connexion
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus

           onChange={(e) => {
                handlechange(e);
                setErrors({ ...errors, email: '' });
              }}
              error={errors.email}
              helperText={errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="motDePasse"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e)=>{ handlechange(e);
                setErrors({ ...errors, password: '' });
              }}
              error={errors.password}
              helperText={errors.password}
            />
             <Grid item xs>
                <Link style={{color:'black',fontSize:'13px'}} to={'/forgot-password'}>
              Mot de passe oublié ?
                </Link>
              </Grid>
            <Button
              type="submit"
              fullWidth
             // variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{backgroundColor:'rgba(59, 120, 60, 0.8)',color:"black"}}
            >
              Connecter
            </Button>
            <Grid container>
              <Row>
              <Col>
              <Grid item >
                <Link to={'/inscription'}  >
                <Typography style={{textAlign:"center" ,marginLeft:"45px",color:'black',fontSize:'14px',padding:"10px"}} > Vous n'avez pas de compte ? Inscrivez-vous</Typography>
                </Link>
              </Grid>
              </Col>
              </Row>
            </Grid>
            
          </Box>
        </Box>
        <Box sx={{ mt: 9, mb: 3 }} />
      </Container>
    </ThemeProvider>
    </div>
    </div>
  );
}