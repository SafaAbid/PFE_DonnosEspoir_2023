const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
//Ajout d'une demande
router.post('/', async (req, res, )=> {
  const  idDonation=req.body.idDonation
  const description=req.body.description
   const dateDemande=req.query.dateDemande
try {
    await prisma.$transaction(async (prisma) => {
const demandeReparation = await prisma.demandeReparation.create({
data: {
    idDonation:Number(idDonation),
    description:description
}, include: {
    donation:{include:{
        demandeObjet:{include:{
        objet:
        {include:{image:true}}
        , association:{include:{user:true}}}
        }
    }}
    ,reparation:true
}
})
//modifier etat de donation 
const don=await prisma.donation.update({
    where:{
        id:Number(idDonation)
      },
  data:{
    etatReparation:true
  },
  include: {
 demandeObjet:{
    include:{
            objet:{include:{image:true}},
    association:{
        include:{
        user: true}}
        }
        }}
})
const entreprises= await prisma.entreprise.findMany();
for (const ent of entreprises) {
    await prisma.notification.create({
      data: {
        idUtilisateur: ent.donateurId,
        description: `Nous tenons à vous informer qu'une association ${don.demandeObjet.association.user.nom} a récemment publié une demande de réparation pour un objet intitulé ${don.demandeObjet.objet.nom}.`
      }
    });
  }
console.log(demandeReparation)
res.json(demandeReparation)
})} catch (error) {
res.status(500).json({
message: error.message,
})
}
});
// afficher les demandes 
router.get('/allDemandes', async (req, res, )=> {
try {

const demandes = await prisma.demandeReparation.findMany({
    include: {
    donation:{include:{
    demandeObjet:{include:{association:{include:{user:true}},
    objet:{include:{image:true,donateur:{include:{user:true}}}}}}
    }},reparation:true
    }
})
res.json(demandes)
} catch (error) {
res.status(500).json({
message: error.message,
})
}
});
// afficher les demandes acceptées par une entreprise
router.get('/allDemandesAccepteesByEntreprise/:id', async (req, res, )=> {
    const id=req.params.id
    try {
    
        const demandesAcceptees = await prisma.demandeReparation.findMany({
            where: {
              etatAcceptation: true, 
              reparation: { 
                idEntreprise: Number(id),
              },
            },
          });
    res.json(demandesAcceptees)
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

const demandes = await prisma.demandeReparation.findMany({
    where:{
       donation:{
demandeObjet:{
    associationId:Number(id)
}
       }
    },
    include: {
        donation:{include:{
            demandeObjet:{include:{
                association:true,
                objet:{include:{donateur:{include:{user:true}}}}
            }
            }
        }}
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
const demande = await prisma.demandeReparation.findUnique({
where: {
id: Number(id),
},include:{
    donation:{include:{
        demandeObjet:{
            include:{
                objet:{
                    include:{donateur:true}
                },
                association:true
            }
        }
    }},reparation:{
        include:{
            entreprise:{include:{donateur:{
                include:{user:{
                    select:{nom:true}
                }}
            }}}
        }
    }
    
}
})
res.json(demande)
} catch (error) {
res.status(500).json({
message:error.message,
})
}
});
//modifier description 
router.put('/:id', async (req, res)=> {
    const {id }= req.params;
    const {description} =req.body
    try {
        await prisma.$transaction(async (prisma) => {
    const dmdRep=await prisma.demandeReparation.update({
        data:{
            description:description
        },
        where:{
            id:Number(id)
        },
        include: {
            donation:{include:{
                demandeObjet:{include:{
                    association:{include:{user:true}}, objet:{include:{image:true}}}
                }
            }}
            ,reparation:true
        }
    })
    console.log(dmdRep)
    res.status(200).json(dmdRep)
    })} catch (error) {
    res.status(200).json({ message: error.message });
    }
    });
// Supprimer une demande 
router.delete('/:id', async (req, res)=> {
const {id }= req.params;
try {
    await prisma.$transaction(async (prisma) => {
const dmdRep=await prisma.demandeReparation.delete({
    where:{
        id:Number(id)
    }
})
const don=await prisma.donation.update({
   data:{
    etatReparation:false
   },
    where:{
        id:dmdRep.idDonation
    }
})
console.log(dmdRep)
res.status(200).json(dmdRep)
})} catch (error) {
res.status(200).json({ message: error.message });
}
});

module.exports = router;