const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
//Ajout d'une activité
router.post('/', async (req, res, )=> {
    const {idAssociationA,description,image,titre}=req.body
    try {
        await prisma.$transaction(async (prisma) => {
    const activite = await prisma.activite.create({
    data: {
    idAssociationA:idAssociationA,
    description:description,
    titre:titre
    }
    })
    for (const img of image) {
      
        await prisma.imageActivite.create({
            data: {
                url: img,
                activiteId: activite.id
            }
        });
    }
    const activiteAjoutee = await prisma.activite.findUnique({
        where:{
         id:activite.id
        },
         include:{
             image:true
         },
     })
    res.json(activiteAjoutee)
})
    } catch (error) {
    res.status(500).json({
    message:error.message,
    })
    }
    });
    //afficher une activite
router.get('/:id', async (req, res, )=> {
    const { id } = req.params
    try {
    const activite = await prisma.activite.findUnique({
    where: {
    id: Number(id),
    },include:{
        image:true
    }
    })
    res.json(activite)
    } catch (error) {
    res.status(500).json({
    message: error.message,
    })
    
    }
    });
    // afficher les activites d'une association.
router.get('/association/:id', async (req, res, )=> {
    const { id } = req.params
    try {
    const activites = await prisma.activite.findMany({
    where: {
        idAssociationA: Number(id),
    },include:{
        image:true
    }, orderBy: {
        id: 'desc' },
    })
    res.json(activites)
    } catch (error) {
    res.status(500).json({
    message: error.message,
    })
    
    }
    });
// modifier une activite
router.put('/modification/:id', async (req, res)=> {
    const {image,description,titre}=req.body
    const id = req.params.id;
    try {
        await prisma.$transaction(async (prisma) => {
        if(image){
       // Supprimer les images précédentes associées à l'objet
        await prisma.imageActivite.deleteMany({
         where:{activiteId: Number(id)}
        });
       // Créer de nouvelles images pour l'objet
    for (const img of image) {
        // console.log(objet.id)
         await prisma.imageActivite.create({
             data: {
                 url: img.url || img,
                 activiteId: Number(id)
             }
         });
     }}
     const activite = await prisma.activite.update({
        data: {
            titre,
            description,
            
        },
        where: { id: Number(id)},
        include:{
            image:true
        }
        })
    res.json(activite);
    })} catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
    }
    });
    // Supprimer une activite
    router.delete('/:id', async (req, res)=> {
    const id = req.params.id;
    try {
    await prisma.activite.delete({
    where: { id: Number(id) },
    })
    res.json({ message: "activite "+ id +" deleted successfully." });
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });
    module.exports = router;