const express=require('express');
require('dotenv').config();
const cors=require('cors')
const app = express()
//BodyParser Middleware
app.use(express.json());
app.use(cors())
// Appel de routes
const utilisateurRouter =require("./routes/utilisateur.route")
app.use('/api/utilisateurs', utilisateurRouter);
const categoriesRouter =require("./routes/categorie.route")
app.use('/api/categories', categoriesRouter);
const sousCategoriesRouter =require("./routes/sousCategorie.route")
app.use('/api/sousCategories', sousCategoriesRouter);
const objetRouter =require("./routes/objet.route")
app.use('/api/objets', objetRouter);
const demandeObjetRouter =require("./routes/demandeObjet.route")
app.use('/api/demandesObjets', demandeObjetRouter);
const donationRouter =require("./routes/donation.route")
app.use('/api/donations', donationRouter);
const rendezVousRouter =require("./routes/rendezVous.route")
app.use('/api/rendezVous', rendezVousRouter);
const activiteRouter =require("./routes/activite.route")
app.use('/api/activites', activiteRouter);
const besoinRouter =require("./routes/besoin.route")
app.use('/api/besoins', besoinRouter);
const demandeReparationRouter = require("./routes/demandeReparation.route")
app.use('/api/demandesReparation', demandeReparationRouter);
const reparationRouter = require("./routes/reparation.route")
app.use('/api/reparations', reparationRouter);
const benevoleRouter = require("./routes/benevole.route")
app.use('/api/benevoles', benevoleRouter);
const notificationRouter = require("./routes/notification.route")
app.use('/api/notifications', notificationRouter);
const PORT = process.env.PORT || 3002
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))