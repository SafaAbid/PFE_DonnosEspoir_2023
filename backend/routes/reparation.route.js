const { format } =require('date-fns');
const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const nodemailer = require('nodemailer');
var transporter =nodemailer.createTransport({
    service:'gmail',
    auth:{
    user:'safabid95@gmail.com',
    pass:'bvaq ycow ejhx vbom'
    },
    tls:{
    rejectUnauthorized:false
    }   
    })
    // Fonction pour envoyer un e-mail
function sendEmail(destinataire, sujet, texte) {
    const mailOptions = {
        from: 'safabid95@gmail.com',
        to: destinataire,
        subject: sujet,
        text: texte
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Erreur lors de l\'envoi de l\'e-mail :', error);
        } else {
            console.log('E-mail envoyé avec succès :', info.response);
        }
    });
}
//Ajout d'une reparation
router.post('/', async (req, res, )=> {
const {dateDebut,dateFin,idDemandeReparation,idEntreprise}=req.body
try {
    await prisma.$transaction(async (prisma) => {
const rendezVousAccquisition = await prisma.rendezVous.create({
data: {
    date: new Date(
        new Date(dateDebut).setHours(new Date(dateDebut).getHours() + 1)
      )
}
})
const reparation = await prisma.reparation.create({
    data: {
        demandeReparationId: Number(idDemandeReparation),
        debutDeReparationId:rendezVousAccquisition.id,
        finDeReparationId:null,
        idEntreprise:Number(idEntreprise)
    },
    include: {
        debutDeReparation: true,
        finDeReparation: true,
        demandeReparation: {
            include: {
                donation: {
                    include: {
                        demandeObjet: {
                            include: {
                                association:{include:{user:true}},
                                objet:true
                            },
                           // include:{
                                
                            //}
                        }
                    }
                }
            }
        },
        entreprise: {
            include: {
                donateur: {
                    include: {
                        user: true
                    }
                }
            }
        }
    }
    })
    const nbObjetsRepares= await prisma.entreprise.update({
        data:{
         nbObjetsRepares: {
             increment: 1
           }
        }
        ,where:{
         donateurId:reparation.entreprise.donateurId
        } 
     })
    const notif= await prisma.notification.create({
        data:{
            idUtilisateur:reparation.demandeReparation.donation.demandeObjet.associationId,
            description :` félicitations, votre demande de réparation de l'objet ${reparation.demandeReparation.donation.demandeObjet.objet.nom} a été acceptée par ${reparation.entreprise.donateur.user.nom} La date d'acquisition de l'objet  est prévue le ${format(new Date(dateDebut), 'dd/MM/yyyy à HH:mm')}`
        }
    })
    const demande=await prisma.demandeReparation.update({
        data:{
            etatAcceptation:true
        },
        where:{
            id:Number(idDemandeReparation)
        }
    })
res.json(reparation)
    })
} catch (error) {
res.status(404).json({message:error})
}
});
// afficher une reparation.
router.get('/:id', async (req, res, )=> {
    const { id } = req.params
    try {
    const reparation = await prisma.reparation.findUnique({
    where: {
    id: Number(id),
    },
    include:{
        debutDeReparation:true,
        finDeReparation:true
    }
    })
    res.json(reparation)
    } catch (error) {
    res.status(500).json({
    message:error.message,
    })
    
    }
    });
// afficher la liste des reparation pour une entreprise.
router.get('/entreprise/:id', async (req, res, )=> {
    const id=req.params.id
try {
const reparations = await prisma.reparation.findMany({
    where:{
        idEntreprise:Number(id)
       // etatArchive:false
    },
    include: {
        debutDeReparation:{include:{benevolee:true}},
        finDeReparation:true,
        entreprise:{include:{donateur:{include:{user:true}}}},
        demandeReparation:{include:{
            donation:{include:{demandeObjet:{include:{objet:{include:{image:{select:{url:true}},donateur:{include:{user:true}}}},association:{include:{user:true}}}}}}
        }}
    }
})
res.json(reparations)
} catch (error) {
res.status(500).json({
message: error.message,
})
}
});
// afficher la liste des reparation pour une association.
router.get('/association/:id', async (req, res, )=> {
    const id=req.params.id
try {
const reparations = await prisma.reparation.findMany({
    where:{
        demandeReparation:{donation:{demandeObjet:{association:{userIdA:Number(id)}}}}
    },
    include: {
        debutDeReparation:{include:{benevolee:true}},
        finDeReparation:true,
        entreprise:{include:{donateur:{include:{user:true}}}},
        demandeReparation:{include:{
        donation:{include:{demandeObjet:{include:{objet:{include:{image:{select:{url:true}},donateur:{include:{user:true}}}},association:{include:{user:true}}}}}}
        }}
    }
})
res.json(reparations)
} catch (error) {
res.status(500).json({
message: error.message,
})
}
});
// modifier la date de remise
router.put('/:id', async (req, res)=> {
    const {id} = req.params;
    const dateFin=req.body.dateFin
    try {
        await prisma.$transaction(async (prisma) => {
            const reparation = await prisma.reparation.findUnique({
                where: {
                  id: Number(id)
                }, include:{
                    debutDeReparation:true,
                    finDeReparation:true
                }
              });
        
              if (!reparation) {
                throw new Error('Réparation non trouvée.');
              }
              const rendezVousRemise = await prisma.rendezVous.create({
                data: {
                    date: 
                    new Date(
                        new Date(dateFin).setHours(new Date(dateFin).getHours() + 1)
                      ),
                }
                })
              // Mettre à jour le rendez-vous de fin de réparation
             /* const rendezVous = await prisma.rendezVous.update({
                where: {
                  id: reparation.finDeReparationId
                 },
                data: {
                  date: dateFin
                },
              });*/
              const reparationTerminee = await prisma.reparation.update({
               data:{
                finDeReparationId:rendezVousRemise.id,
                etat:"repare"
               },
               
                where: {
                  id: Number(id)
                }
              });
              const reparationmodif = await prisma.reparation.findUnique({
                where: {
                  id: Number(id)
                }, include:{
                    debutDeReparation:true,
                    finDeReparation:true,
                    entreprise:true,
                    demandeReparation:{include:{
                    donation:{
                    include:{
                    demandeObjet:
                    {include:
                        {
                        objet:{include:{image:true}},
                        association:
                        {include:{user:true}}}}}}
        }}
                }
              });
              const notif= await prisma.notification.create({
                data:{
                    idUtilisateur:reparationmodif.demandeReparation.donation.demandeObjet.associationId,
                    description :`Nous sommes heureux de vous informer que la réparation de l'objet ${reparationmodif.demandeReparation.donation.demandeObjet.objet.nom} a été achevée.L'entreprise a fixé la date de restitution pour le ${format(new Date(reparationmodif.finDeReparation.date), 'dd/MM/yyyy à HH:mm')}.Nous vous invitons cordialement a affecter un bénévole a ce rendez-vous.`
                }
            })
    res.json(reparationmodif);})
    } catch (error) {
    res.status(200).json({ message: error.message });
    }
    });

// enCours une reparation
router.put('/enCours/:id', async (req, res)=> {
const id = req.params.id;
try {
    await prisma.$transaction(async (prisma) => {
const reparation=await prisma.reparation.update({
    data:{
etat:"enCours"
    },
where: { id: Number(id) },
include: {
    debutDeReparation:true,
    finDeReparation:true,
    entreprise:true,
    demandeReparation:{include:{
        donation:{include:{demandeObjet:{include:{objet:{include:{image:{select:{url:true}}}},association:{include:{user:true}}}}}}
    }}
}
})
res.json(reparation);})
} catch (error) {
res.status(404).json({ message: error.message });
}
});
// une reparation n'a pas été réalisé
router.put('/nonValide/:id', async (req, res)=> {
const id = req.params.id;
try {
    await prisma.$transaction(async (prisma) => {
const reparation=await prisma.reparation.update({
    data:{
        etat:"nonValide"
    },
where: { id: Number(id) },
include: {
    debutDeReparation:true,
    finDeReparation:true,
    entreprise:true,
    demandeReparation:{include:{
        donation:{include:{demandeObjet:{include:{
            objet:{include:{image:{select:{url:true}}}},
            association:{
                include:{
                    user:true
                       }
                    }
             }
            }}}
    }}
}
})
const dmdRep=await prisma.demandeReparation.update({
    data:{
        etatAcceptation:false
    },
    where:{
        id:reparation.demandeReparationId
    }
})
const rendezVousDebut=await prisma.rendezVous.update({
    data:{
        etatRealisation:"nonRealise"
    },
    where:{
        id:reparation.debutDeReparationId
    },
    include:{benevolee:true}
})
const notif= await prisma.notification.create({
    data:{
        idUtilisateur:reparation.demandeReparation.donation.demandeObjet.associationId,
        description :`Votre demande de réparation de l'objet ${reparation.demandeReparation.donation.demandeObjet.objet.nom} est de nouveau en cours.`
    }
})
if(rendezVousDebut.benevolee)
sendEmail(rendezVousDebut.benevolee.email, 'Annulation du rendez-vous', `Nous tenons à vous informer que le rendez-vous prévu pour le ${format(new Date(rendezVousDebut.date), 'dd/MM/yyyy à HH:mm')} a malheureusement été annulé`);
res.json(reparation);})
} catch (error) {
res.status(404).json({ message: error.message });
}
});
/*router.delete('/:id', async (req, res)=> {
    const id = req.params.id;
    try {
    await prisma.reparation.delete({
    where: { id: Number(id) },
    })
    res.json({ message: "category "+ id +" deleted successfully." });
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });*/
module.exports = router;