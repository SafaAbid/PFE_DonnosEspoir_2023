const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
// afficher la liste des notifications pour un donateur.
router.get('/donateur/:id', async (req, res, )=> {
    const id=req.params.id
try {
const notifications = await prisma.notification.findMany({
    where:{
       idUtilisateur:Number(id)
    },
    orderBy:{
        date:'desc'
    }
})
res.json(notifications)
} catch (error) {
res.status(500).json({
message: error.message,
})
}
});
//modifier l'etat de notification (etatVu) 
router.put('/:id', async (req, res)=> {
    const id = req.params.id;
    try {
    const notif = await prisma.notification.update({
    data: {
      etat:true
    },
    where: { id: Number(id)},
    })
    res.json(notif);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });
module.exports = router;