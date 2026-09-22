const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
//Ajout d'un bénévole
router.post('/', async (req, res, )=> {
 //   const id=req.params.id
    
const {nom,prenom,numTelephone,email,idAssociation,adresse}=req.body
try {
  console.log(req.body);
const benevole = await prisma.benevole.create({
data: {
nom: nom,
prenom,
numTelephone,
email,
idAssociation:Number(idAssociation),
adresse:adresse
}
})
console.log(benevole)
res.json(benevole)
} catch (error) {
res.status(200).json({
message:error.message,
})
console.log(error.message);
}
});
// afficher la liste des benevoles d'une association.
router.get('/association/:id', async (req, res, )=> {
    const id=req.params.id
try {
const benevoles = await prisma.benevole.findMany({
where:{
    idAssociation:Number(id),
    etatArchive:false
},include:{
    association:true
},
orderBy:{
  id:'desc'
}
})
res.json(benevoles)
} catch (error) {
res.status(500).json({
message:error.message,
})
}

});
//afficher les bénévoles qui seront disponibles avant une heure et aprés une heure d'une date donnée et pour une association donnée
router.post('/disponible/:id', async (req, res, )=> {
    const dateDonnee=new Date(req.body.dateDonnee)
    const id=req.params.id
try {
  console.log(dateDonnee);
    const uneHeureAvant = new Date(dateDonnee.getTime() - (60 * 60 * 1000)); // 1 heure avant
    console.log(uneHeureAvant);
    const uneHeureApres = new Date(dateDonnee.getTime() + (60 * 60 * 1000)); // 1 heure après
    console.log(uneHeureApres);
    const benevoles = await prisma.benevole.findMany({
      where: {
           OR: [{NOT:{rendezVous: {
                some:{date: { 
                  lt: new Date(uneHeureApres), 
                  gt: new Date(uneHeureAvant) 
                },
                etatRealisation:"enCours" }
            },}},],
            etatArchive:false,
          idAssociation:Number(id) 
      },
    })
    res.json(benevoles)
 } catch (error) {
res.status(200).json({
message:error.message,
})
}
})
// chercher un benevole par email.
router.put('/emailBenevole', async (req, res, )=> {
  const { email,idAsso } = req.body
  try {
  const benevole = await prisma.benevole.findFirst({
  where: {
  email,
  idAssociation:idAsso,
  etatArchive:false
  }
  })
  res.json(benevole)
  } catch (error) {
  res.status(500).json({
  message:error.message,
  })
  }
  });
// chercher un benevole par numTéléphone.
router.put('/numBenevole', async (req, res, )=> {
  const { numTelephone ,idAsso} = req.body
  try {
  const benevole = await prisma.benevole.findFirst({
  where: {
    numTelephone,
    idAssociation:idAsso,
    etatArchive:false
  }
  })
  res.json(benevole)
  } catch (error) {
  res.status(500).json({
  message:error.message,
  })
  }
  });
  
// afficher un benevole.
router.get('/:id', async (req, res, )=> {
const { id } = req.params
try {
const benevole = await prisma.benevole.findUnique({
where: {
id: Number(id),
}
})
res.json(benevole)
} catch (error) {
res.status(500).json({
message:error.message,
})
}
});

// modifier un bénévole
router.put('/:id', async (req, res)=> {
const {nom,prenom,numTelephone,email,adresse}=req.body
const id = req.params.id;
try {
const benevole = await prisma.benevole.update({
data: {
  nom,prenom,numTelephone,email,adresse
},
where: { id: Number(id)},
})
res.json(benevole);
} catch (error) {
res.status(404).json({ message: error.message });
}
});
// Archiver un bénévole si il n'existe pas dans un rendez-vous
router.put('/archiveBenevole/:id', async (req, res)=> {
const id = req.params.id;
try {
  await prisma.$transaction(async (prisma) => {
 /* const rendezVous = await prisma.rendezVous.findMany({
    where: {
      AND:[
        { NOT :{idBenevole:null}},
    {idBenevole : Number(id)}
      ],      
  }});
  if (rendezVous.length === 0) {*/
   const bnv= await prisma.benevole.update({
    data:{
      etatArchive:true
    },
      where: {
        id: Number(id),
      },
    });
    const benevole= await prisma.benevole.findUnique({
        where: {
          id: Number(id),
        },
      });
      console.log(bnv)
res.json(bnv)
  /*} else {
    console.log(`Le bénévole avec l'ID ${id} ne peut pas être supprimé car il est associé à des rendez-vous.`);
  }*/
})} catch (error) {
res.status(500).json({ message: error.message });
}
});
module.exports = router;