const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
//Ajout d'un besoin
router.post('/', async (req, res, )=> {
const {idCategorie,description,associationId}=req.body

try {
const verifBesoin= await prisma.besoin.findFirst({
where:
{
    AND:[
    {idCategorie:Number(idCategorie)},
    {associationId:Number(associationId)}
    ]
}
})
if(verifBesoin){
res.status(400).json({msg:"un besoin avec la même catégorie existe déjà. Veuillez modifier uniquement la description du besoin existant "})}
else{
const besoin = await prisma.besoin.create({
data: {
associationId,
idCategorie:Number(idCategorie),
description:description
},include:{
    categorie:true
}
})
res.json(besoin)
}
} catch (error) {
res.status(500).json({
message:error.message,
})
}
});
// afficher la liste des besoins pour une association.
router.get('/association/:id', async (req, res)=> {
    const { id } = req.params
try {
const besoins = await prisma.besoin.findMany({
    where:{
            associationId:Number(id)
    },
    include:{
        categorie:true
    }
})
res.json(besoins)
} catch (error) {
res.status(500).json({
message:error.message,
})
}

});
// afficher un besoin.
router.get('/:id', async (req, res, )=> {
const { id } = req.params
try {
const besoin = await prisma.besoin.findUnique({
where: {
id: Number(id),
}
})
res.json(besoin)
} catch (error) {
res.status(500).json({
message:error.message,
})
}
});
// modifier un besoin
router.put('/:id', async (req, res)=> {
const {idCategorie,description}=req.body
const id = req.params.id;
try {
const besoin = await prisma.besoin.update({
data: {
idCategorie:Number(idCategorie),
description:description
},
where: { id: Number(id)},
include:{
    categorie:true
}
})
res.json(besoin);
} catch (error) {
res.status(404).json({ message: error.message });
}
});
// chercher un besoin par cat.
router.put('/besoin/Cat/', async (req, res, )=> {
    const { idCategorie,id } = req.body
    
    try {
    const besoin = await prisma.besoin.findFirst({
    where: {
        AND:[
    {idCategorie:Number(idCategorie)},
    {associationId:Number(id)}] 
    }
    })
    res.json(besoin)
    } catch (error) {
    res.status(400).json({
    message:error.message,
    })
    }
    });
// Supprimer un besoin
router.delete('/:id', async (req, res)=> {
const id = req.params.id;
try {
await prisma.besoin.delete({

where: { id: Number(id) },
})
res.json({ message: "besoin "+ id +" a été supprimé avec succees." });
} catch (error) {
res.status(404).json({ message: error.message });
}
});
module.exports = router;