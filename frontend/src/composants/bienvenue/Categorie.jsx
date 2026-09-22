import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TvIcon from '@mui/icons-material/Tv';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HomeIcon from '@mui/icons-material/Home';
import KitchenIcon from '@mui/icons-material/Kitchen';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import { Link } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getCategories } from '../../features/categorieSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Image } from 'react-bootstrap';



export default function Categorie() {
  const { categories } = useSelector((state) => state.storeCategories);
  const [items, setItems] = React.useState([]);
  const dispatch = useDispatch();
  const initFetch = React.useCallback(() => {
    dispatch(getCategories()).then(res => {console.log("categories" + res)
    setItems(res.payload.map((category) => ({
      icon: category.image || "", // Fallback icon
      title: category.nom,
      //description: category.description,
    })));}
  );
  }, [dispatch])
  React.useEffect(() => {
    initFetch()
  }, [initFetch])

  return (
    <Box
      sx={{
        height: 370,
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: 'rgba(186, 186, 186, 0.8)',
      }}
    >
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 3, sm: 6 },
            marginTop:-6
          }}
        >
          <Box
            sx={{
              width: { sm: '100%', md: '100%' },
              textAlign: { sm: 'left', md: 'center' },
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'flex-end'
            }}
          >
            <h2 class="section-heading text-uppercase" style={{color:"black"}}>
             Nos Categories
              </h2>
          </Box>
          <Grid container spacing={2}
            sx={{
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center'
            }}>
            {items.map((item, index) => (
              <Grid item xs={12} sm={6} md={2} key={index}>
                <Stack
                  direction="column"
                  color="inherit"
                  component={Card}
                  spacing={1}
                  useFlexGap
                  sx={{
                    p: 3,
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'rgba(96, 119, 150, 0.8)',
                    backgroundColor: 'rgba(96, 119, 150, 0.8)'
                  }}
                >
                  <Box sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}><img style={{
                    width: '70px', // Define the size of the image
                    height: '70px', // Define the size of the image
                    borderRadius: '100%' // Make the image round
                  }} src={item.icon}></img></Box>
                  <div style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                    <Typography style={{ marginTop: "10px" ,color:"black" }} fontWeight="medium" gutterBottom >
                      {item.title}
                    </Typography>
                  </div>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
    </Box>
  );
}