const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();

//Ajout d'un objet
router.post('/', async (req, res, )=> {
    const {nom,etatObjet,idDonateur,description,idSousCategorie,image}=req.body
    try {
        await prisma.$transaction(async (prisma) => {
    const objet = await prisma.objet.create({
    data: {
    nom: nom,
    //image: image,
    idDonateur:Number(idDonateur),
    description:description,
    etatObjet,
    idSousCategorie:Number(idSousCategorie)
    },
    })
    if(image){
    for (const img of image) {
       // console.log(objet.id)
        await prisma.imageObjet.create({
            data: {
                url: img,
                objetId: objet.id
            }
        });
    }}
    const objets = await prisma.objet.findUnique({
       where:{
        id:objet.id
       },
        include:{
            image:true, donateur:{include:{user:true}},
            sousCategorie:true
        },
    })
    res.json(objets)
    })} catch (error) {
    res.status(500).json({
    message:error.message,
    })
    }
    });
// afficher la liste des objets 
router.get('/', async (req, res, )=> {
    try {
    
    const objets = await prisma.objet.findMany({
       
        include:{
            image:true, donateur:{include:{user:true}},
            sousCategorie:true
        }, orderBy: {
            id: 'asc' },
      
    })
    
    res.json(objets)
    } catch (error) {
    res.status(500).json({
    message: error.message,
    })
    }
    });
// afficher la liste des objets disponibles et publies(valider de la part de l'administrateur)
router.get('/disponibles', async (req, res, )=> {
try {
const objets = await prisma.objet.findMany({
    where:{
        disponible:true,
        etatPublication:"publie",
        etatArchive:false
    },
    include:{
        image:true,
        sousCategorie:true,
        donateur:{include:{user:true}}
    }, orderBy: {
        id: 'desc' },
})

res.json(objets)
} catch (error) {
res.status(500).json({
message: error.message,
})
}
});
// afficher la liste des objets disponibles et publiee(valider de la part de l'administrateur) et  demandé par une association
router.get('/disponiblesDemandesAssociation/:id', async (req, res, )=> {
    const id=req.params.id
    try {
    const objets = await prisma.objet.findMany({
        where:{
            disponible:true,
            etatPublication:"publie",
            etatArchive:false,
            demandesObjet: {
                some: { associationId: Number(id) } // Au moins une demande par l'association spécifiée
            }
        },
        include:{
            image:true, donateur:{include:{user:true}}
        }, orderBy: {
            id: 'desc' }
    })
    
    res.json(objets)
    } catch (error) {
    res.status(500).json({
    message: error.message,
    })
    }
    });
// afficher la liste des objets disponibles et publiee(valider de la part de l'administrateur) et non demandé par une association
router.get('/disponiblesAssociation/:id', async (req, res, )=> {
    const id=req.params.id
    try {
    const objets = await prisma.objet.findMany({
        where:{
            disponible:true,
            etatPublication:"publie",
            etatArchive:false,
            demandesObjet: {
                none: { associationId: Number(id) } // Aucune demande par l'association spécifiée
            }
        },
        include:{
            image:true, donateur:{include:{user:true}}
        }, orderBy: {
            id: 'desc' }
    })
    
    res.json(objets)
    } catch (error) {
    res.status(500).json({
    message: error.message,
    })
    }
    });
// afficher les objets réparés pour une association 
router.get('/repareAssociation/:id', async (req, res, )=> {
    const id=req.params.id
    try {
    const donation = await prisma.donation.findMany({
        where:{
            etatReparation:true,          
            demandeObjet: {
                associationId: Number(id) 
            }
        },
        include:{
            demandeObjet:{include:{
                objet:true}}
        }, orderBy: {
            id: 'desc' }
    })
    
    res.json(donation)
    } catch (error) {
    res.status(500).json({
    message: error.message,
    })
    }
    });
// afficher les objets d'un donateur.
router.get('/donateur/:id', async (req, res, )=> {
const { id } = req.params
try {
const objetsDonateur = await prisma.objet.findMany({
where: {
    idDonateur: Number(id),
    etatArchive:false
},
orderBy: {
    id: 'desc' },
include:{
    image:true, donateur:{include:{user:true}},sousCategorie:true
}
})
res.json(objetsDonateur)
} catch (error) {
res.status(500).json({
message: error.message,
})

}
});
//liste des objets pour une catégorie donnée
router.get('/cat/:id', async (req, res) => {
    const  id = req.params.id;
    try {
    const objets = await prisma.objet.findMany({
    where: {
    sousCategorie: {
    idCategorie: Number(id)
    } 
    },
    include: {
    sousCategorie: true,
    },
    });
    res.json(objets);
    } catch (error) {
    res.status(500).json({
    message: "Something went wrong",
    error: error.message,
    });
    }
    });
    //liste des objets pour une sousCatégorie donnée
router.get('/sCat/:id', async (req, res) => {
    const  id = req.params.id;
    try {
    const objets = await prisma.objet.findMany({
    where: {
    idSousCategorie: Number(id)
    
    },
    include: {
    sousCategorie: true,
    },
    });
    res.json(objets);
    } catch (error) {
    res.status(500).json({
    message: "Something went wrong",
    error: error.message,
    });
    }
    });
//afficher un ojbet
router.get('/:id', async (req, res, )=> {
    const { id } = req.params
    try {
    const objet = await prisma.objet.findUnique({
    where: {
    id: Number(id),
    },include:{
        image:true
    }
    })
    res.json(objet)
    } catch (error) {
    res.status(500).json({
    message: error.message,
    })
    
    }
    });
//rendre l'objet non disponible
router.put('/nondisponible/:id', async (req, res)=> {
    const id = req.params.id;
    try {
    const objet = await prisma.objet.update({
    data: {
    disponible: false,

    },
    where: { id: Number(id)},
    include:{
        image:true
    }
    })
    res.json(objet);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
 
//rendre l'objet disponible
router.put('/disponible/:id', async (req, res)=> {
    const id = req.params.id;
    try {
        await prisma.$transaction(async (prisma) => {
            const objet = await prisma.objet.update({
                data: {
                    disponible: true,
                    
                },
                where: { id: Number(id)},
                include:{
                    image:true
                }
            })
            const don =await prisma.donation.findMany({
                where:{
                    demandeObjet:{
                        objet:{id:objet.id}
                    }
                }
            })
            const donation=await prisma.donation.updateMany({
                data:{
                    etatValidation:false
                },
                where:{
                    demandeObjet:{
                        objet:{id:objet.id}
                    }
                }
            })
            const demande=await prisma.demandeObjet.findMany({
                where:{
                    objet:{
                        id:objet.id
                    },
                    etatAcceptation:"acceptee"
                }
            })
            const demandeModif=await prisma.demandeObjet.updateMany({
                data:{ etatAcceptation:"annulee"},
                where:{
                    objet:{
                        id:objet.id
                    },
                    etatAcceptation:"acceptee"
                }
            })
            const rendezVous = await prisma.rendezVous.updateMany({
                data: {
                    etatRealisation: "nonRealise", 
                },
                where: {
                    donation:{
                        demandeObjet:{
                            idObjet:Number(id)
                        },
                    }
                }
            }).catch(err=>{console.log(err);})
            const demandes=await prisma.demandeObjet.updateMany({
                data:{
                    etatAcceptation:"enCours"
                },
                where:{
                    NOT:[ 
                        {
                            etatAcceptation:"annulee"
                        },
                    ],
                    idObjet:objet.id
                }
            }).catch(err=>console.log(err))
            console.log("oki");
            // Récupèrer les demandes mises à jour
const updatedDemandes = await prisma.demandeObjet.findMany({
    where: {
        objet: {
            id: objet.id
        },
    }
});
      for (const dmd of updatedDemandes) {
        if(dmd.id!=demande.id) //hedhi ili zetha 
        {const notifications= await prisma.notification.create({
            data:{
                idUtilisateur:dmd.associationId,
                description :`"L'objet ${objet.nom} a été rendu disponible, et votre demande a été renouvelée et est en cours d'acceptation par le donateur."`
            }
        })}
        }
        const nbObjets= await prisma.donateur.update({
            data:{
             nbObjetsDonnes: {
                decrement: 1
               }
            }
            ,where:{
             userIdD:objet.idDonateur
            }
         })
    res.json(objet);
    })} catch (error) {
    res.status(404).json({ message: error.message } );
    }
    });
//valider un objet 
router.put('/validation/:id', async (req, res)=> {
    const id = req.params.id;
    try {
        await prisma.$transaction(async (prisma) => {
    const objet = await prisma.objet.update({
    data: {
        etatPublication: "publie",

    },
    where: { id: Number(id)},
    include:{
        image:true,
        sousCategorie:{include:{categorie:true}}
    }
    })
    const notif= await prisma.notification.create({
        data:{
            idUtilisateur:objet.idDonateur,
            description :`  Votre objet ${objet.nom} a été publié`
        }
    })
    const besoins = await prisma.besoin.findMany({});
    for (const besoin of besoins) {
        if (besoin.idCategorie == objet.sousCategorie.idCategorie) {
            const notifAssociation = await prisma.notification.create({
                data: {
                    idUtilisateur: besoin.associationId,
                    description: `Nous sommes heureux de vous informer qu'un objet "${objet.nom}" correspondant à votre besoin a été récemment publié sur notre plateforme`
                }
            });
        }
    }
    
    res.json(objet);
    })} catch (error) {
    res.status(404).json({ message: error.message });
    }
    });
//refuser un objet 
     router.put('/refus/:id', async (req, res)=> {
        const id = req.params.id;
        const {raison}=req.body
        try {
            await prisma.$transaction(async (prisma) => {
        const objet = await prisma.objet.update({
        data: {
            etatPublication: "refuse",
        },
        where: { id: Number(id)},
        include:{
            image:true,
            sousCategorie:{include:{categorie:true}}
        }
        })
        const notif= await prisma.notification.create({
            data:{
                idUtilisateur:objet.idDonateur,
                description :`Votre demande de publication de l'objet ${objet.nom} a été réfusée .la raison : ${raison}`
            }
        })
        console.log("raison",raison)
        res.json(objet);
        })} catch (error) {
        res.status(404).json({ message: error.message });
        }
        });

// modifier un objet
router.put('/modification/:id', async (req, res)=> {
const {nom,image,description,etatObjet,idSousCategorie}=req.body
const id = req.params.id;
try {
    console.log(image);
    await prisma.$transaction(async (prisma) => {
        if(image)
   {// Supprimer les images précédentes associées à l'activite
    await prisma.imageObjet.deleteMany({
     where:{objetId: Number(id)}
    });
   // Créer de nouvelles images pour l'activite
   
for (const img of image) {
    console.log(img)
     await prisma.imageObjet.create({
         data: {
             url: img.url || img,
             objetId: Number(id)
         }
     });
 }}
 const objet = await prisma.objet.update({
    data: {
        nom,
        description,
        etatObjet,
        etatPublication:"enCoursDeValidation",
        idSousCategorie
    },
    where: { id: Number(id)},
    include:{
        image:true, donateur:{include:{user:true}},
        sousCategorie:true
    },
    })
res.json(objet);
})} catch (error) {
res.status(500).json({ message: error.message });
console.log(error.message);
}
});
// Supprimer un objet
router.put('/archive/:id', async (req, res)=> {
const id = req.params.id;
try {
const obj=await prisma.objet.update({
    data:{etatArchive:true},
where: { id: Number(id) },
include:{
    demandesObjet:true
}
})
const objet=await prisma.objet.findUnique({
where:{
    id:obj.id
}
})
if (obj.demandesObjet && obj.demandesObjet.length > 0) {
  obj.demandesObjet.forEach(async (demande) => {
    if (demande.etatAcceptation === 'enCours') {
      // Envoyer une notification à l'association associée à cette demande
      const notification = await prisma.notification.create({
        data:{
            idUtilisateur:demande.associationId,
            description :`Nous tenons à vous informer que l'objet ${obj.nom} pour lequel vous avez fait une demande a été supprimé d'aprés le donateur. Par conséquent, votre demande pour cet objet a été refusée`
        }
      });
      // Supprimer la demande
      await prisma.demandeObjet.update({
        data:{
            etatAcceptation:"refusee"
        },
        where: { id: demande.id }
      });
    }
});}
console.log(objet)
res.json(objet);
} catch (error) {
res.status(404).json({ message: error.message });
}
});
// router.delete('/:id', async (req, res)=> {
// const id = req.params.id;
// try {
// await prisma.objet.delete({
// where: { id: Number(id) },
// })
// res.json({ message: "category "+ id +" deleted successfully." });
// } catch (error) {
// res.status(404).json({ message: error.message });
// }
// });
module.exports = router;