const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
//Ajout d'une demande
router.post('/', async (req, res, )=> {
  const  associationId=req.body.associationId
   const idObjet=req.body.idObjet
try {
    await prisma.$transaction(async (prisma) => {
const demandeObjet = await prisma.demandeObjet.create({
data: {
    associationId:Number(associationId),
    idObjet:Number(idObjet)
},
include:{
    objet:{include:{donateur:true,image:true}},
    association:{include:{user:true}}
}
})
const notif= await prisma.notification.create({
    data:{
        idUtilisateur:demandeObjet.objet.idDonateur,
        description :` L'association ${demandeObjet.association.user.nom} a demandé votre objet intitulé ${demandeObjet.objet.nom}`
    }
})
res.json(demandeObjet)
})} catch (error) {
res.status(500).json({
message: error.message,
})
}
});
// afficher la liste des demandes d'un donateur.
router.get('/donateur/:id', async (req, res, )=> {
    const id=req.params.id
try {

const demandes = await prisma.demandeObjet.findMany({
    where:{
       objet:{idDonateur:Number(id)}
    },
    orderBy:{
        dateDeDemande : 'asc'
    },

include:{
        objet:{include:{donateur:{include:{user:true}},image:true}},
        association:{include:{user:true}}
    }  
})
res.json(demandes)
} catch (error) {
res.status(500).json({
message: error.message,
})
}
});
// afficher la liste des demandes d'une association.
router.get('/association/:id', async (req, res, )=> {
    const id=req.params.id
try {

const demandes = await prisma.demandeObjet.findMany({
    where:{
       associationId:Number(id),
    //    NOT:{
    //     etatAcceptation:"annulee"
    //    }
    },
    orderBy:{
        dateDeDemande : 'asc'
    },
    include:{
        objet:{include:{donateur:{include:{user:true}},image:true}},
        association:{include:{user:true}}
    }
    
})
res.json(demandes)
} catch (error) {
res.status(500).json({
message: error.message,
})
}
});
// afficher la liste des demandes enCours d'une association.
router.get('/associationEnCours/:id', async (req, res, )=> {
    const id=req.params.id
try {

const demandes = await prisma.demandeObjet.findMany({
    where:{
       associationId:Number(id),
       etatAcceptation:"enCours"
    //    NOT:{
    //     etatAcceptation:"annulee"
    //    }
    },
    orderBy:{
        dateDeDemande : 'asc'
    },
    include:{
        objet:{include:{donateur:{include:{user:true}},image:true}},
        association:{include:{user:true}}
    }
    
})
res.json(demandes)
} catch (error) {
res.status(500).json({
message: error.message,
})
}
});
// afficher la liste des demandes pour un objet.
router.get('/objet/:id', async (req, res, )=> {
    const id=req.params.id
try {

const demandes = await prisma.demandeObjet.findMany({
    where:{
        AND:[
      {objet:{id:Number(id)}},
      {etatAcceptation:"enCours"}
    ]
    },
    orderBy:{
        dateDeDemande : 'asc'
    },
    include:{
        objet:{include:{donateur:true,image:true}},
        association:{include:{user:true}}
    } 
})
res.json(demandes)
} catch (error) {
res.status(500).json({
message: error.message,
})
}
});
// afficher une demande.
router.get('/:id', async (req, res, )=> {
const { id } = req.params
try {
const demande = await prisma.demandeObjet.findUnique({
where: {
id: Number(id),
}
})
res.json(demande)
} catch (error) {
res.status(500).json({
message:error.message,
})

}
});

// Supprimer une demande 
router.delete('/supprimer/:id', async (req, res)=> {
const id = req.params.id;
try {
    await prisma.$transaction(async (prisma) => {
    const donation=await prisma.donation.findMany({
        where:{
            idDemandeObjet:Number(id)
        }
    });
    if(donation.length===0){

 const dmd=await prisma.demandeObjet.delete({
where: { id: Number(id) },
})
res.json(dmd);
} else {
    res.status(400).json({ message: "Il existe des donations liés à cette demande. Supprimez d'abord les donations." });
}

})} catch (error) {
res.status(404).json({ message: error.message });
}
});
// refuser une demande 
router.put('/refus/:id', async (req, res)=> {
    const id = req.params.id;
    try {
        await prisma.$transaction(async (prisma) => {
    const demande = await prisma.demandeObjet.update({
    data: {
        etatAcceptation:"refusee"
    },
    where: { id: Number(id)},
    include:{
        objet:{include:{donateur:true,image:true}},
        association:{include:{user:true}}
    }
    })
    
    const notif= await prisma.notification.create({
        data:{
            idUtilisateur:demande.associationId,
            description :` malheureusement,votre demande de l'objet ${demande.objet.nom} a été refusée`
        }
    })
    res.json(demande);
    })} catch (error) {
    res.status(404).json({ message: error.message });
    }
    });

module.exports = router;