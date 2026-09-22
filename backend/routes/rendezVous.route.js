const { format } = require("date-fns");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

const cron = require("node-cron");
const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "safabid95@gmail.com",
    pass: "bvaq ycow ejhx vbom",
  },
  tls: {
    rejectUnauthorized: false,
  },
});
// Fonction pour envoyer un e-mail
function sendEmail(destinataire, sujet, texte) {
  const mailOptions = {
    from: "safabid95@gmail.com",
    to: destinataire,
    subject: sujet,
    text: texte,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Erreur lors de l'envoi de l'e-mail :", error);
    } else {
      console.log("E-mail envoyé avec succès :", info.response);
    }
  });
}

// afficher la liste des rendezVoud d'un donateur.
router.get("/rendezVousDonateur/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const rendezVous = await prisma.rendezVous.findMany({
      where: {
        donation: {
          demandeObjet: {
            objet: {
              idDonateur: Number(id),
            },
          },
        },
      },
      orderBy: {
        date: "asc",
      },
      include: {
        donation: {
          include: {
            demandeObjet: {
              include: {
                objet: { include: { donateur: true } },
                association: { include: { user: true } },
              },
            },
          },
        },
        benevolee: true,
      },
    });
    res.json(rendezVous);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// afficher la liste des rendezVoud d'une association.
router.get("/rendezVousAssociation/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const rendezVous = await prisma.rendezVous.findMany({
      where: {
        donation: {
          demandeObjet: {
            association: {
              userIdA: Number(id),
            },
          },
        },
      },
      orderBy: {
        date: "asc",
      },
      include: {
        donation: {
          include: {
            demandeObjet: {
              include: {
                objet: { include: { donateur: { include: { user: true } } } },
                association: true,
              },
            },
          },
        },
        benevolee: true,
      },
    });
    res.json(rendezVous);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// afficher la liste des rendezVous des donations d'une entreprise.
router.get("/rendezVousEntreprise/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const rendezVous = await prisma.rendezVous.findMany({
      where: {
        donation: {
          demandeObjet: {
            objet: {
              idDonateur: Number(id),
            },
          },
        },
      },
      orderBy: {
        date: "asc",
      },
      include: {
        benevolee: true,
        donation: {
          include: {
            demandeReparation: {
              include: {
                reparation: {
                  include: {
                    entreprise: {
                      include: { donateur: { include: { user: true } } },
                    },
                    //demandeReparation:{include:{donation:{include:{}}}}
                  },
                },
              },
            },
            demandeObjet: {
              include: {
                objet: { include: { donateur: { include: { user: true } } } },
                association: { include: { user: true } },
              },
            },
          },
        },
      },
    });
    res.json(rendezVous);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// afficher la liste des rendezVous des reparations d'une entreprise.
router.get("/rendezVousEntrepriseReparation/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const rendezVous = await prisma.rendezVous.findMany({
      where: {
        OR: [
          {
            reparationDebut: {
              some: {
                entreprise: {
                  donateurId: Number(id),
                },
              },
            },
          },
          {
            reparationFin: {
              some: {
                entreprise: {
                  donateurId: Number(id),
                },
              },
            },
          },
        ],
      },
      orderBy: {
        date: "asc",
      },
      include: {
        reparationDebut: {
          include: {
            entreprise: {
              include: {
                donateur: { include: { user: true } },
              },
            },
            demandeReparation: {
              include: {
                donation: {
                  include: {
                    demandeObjet: {
                      include: {
                        association: {
                          include: {
                            user: true,
                          },
                        },
                        objet: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        reparationFin: {
          include: {
            entreprise: {
              include: {
                donateur: { include: { user: true } },
              },
            },
            demandeReparation: {
              include: {
                donation: {
                  include: {
                    demandeObjet: {
                      include: {
                        association: {
                          include: {
                            user: true,
                          },
                        },
                        objet: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        benevolee: true,
      },
    });
    res.json(rendezVous);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// afficher la liste des rendezVous des reparations d'une association.
router.get("/rendezVousAssociationReparation/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const rendezVous = await prisma.rendezVous.findMany({
      where: {
        OR: [
          {
            reparationDebut: {
              some: {
                demandeReparation: {
                  donation: { demandeObjet: { associationId: Number(id) } },
                },
              },
            },
          },
          {
            reparationFin: {
              some: {
                demandeReparation: {
                  donation: { demandeObjet: { associationId: Number(id) } },
                },
              },
            },
          },
        ],
      },
      orderBy: { date: "asc" },
      include: {
        reparationDebut: {
          include: {
            entreprise: {
              include: {
                donateur: { include: { user: true } },
              },
            },
            demandeReparation: {
              include: {
                donation: {
                  include: {
                    demandeObjet: {
                      include: {
                        association: { include: { user: true } },
                        objet: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        reparationFin: {
          include: {
            entreprise: {
              include: {
                donateur: { include: { user: true } },
              },
            },
            demandeReparation: {
              include: {
                donation: {
                  include: {
                    demandeObjet: {
                      include: {
                        association: { include: { user: true } },
                        objet: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        benevolee: true,
      },
    });
    res.json(rendezVous);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// afficher la liste des rendezVoud d'un benevole.
router.get("/rendezVousBenevole/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const rendezVous = await prisma.rendezVous.findMany({
      where: {
        AND: [{ idBenevole: Number(id) }, { etatRealisation: "enCours" }],
      },
      orderBy: {
        date: "asc",
      },
      include: {
        benevolee: true,
      },
    });
    res.json(rendezVous);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// afficher un rendez vous
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const rendezVous = await prisma.rendezVous.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.json(rendezVous);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
//affecter un benevole a un rendez-vous
router.put("/benevole/:id", async (req, res) => {
  const { idBenevole } = req.body;
  const id = req.params.id;
  try {
    const rendezVous = await prisma.rendezVous.update({
      data: {
        idBenevole,
      },
      where: { id: Number(id) },
      include: {
        donation: {
          include: {
            demandeObjet: {
              include: {
                objet: { include: { donateur: { include: { user: true } } } },
                association: { include: { user: true } },
              },
            },
          },
        },
        reparationDebut: {
          include: {
            entreprise: {
              include: {
                donateur: { include: { user: true } },
              },
            },
            demandeReparation: {
              include: {
                donation: {
                  include: {
                    demandeObjet: {
                      include: {
                        association: { include: { user: true } },
                        objet: {
                          include: {
                            donateur: {
                              include: { user: true },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        reparationFin: {
          include: {
            entreprise: {
              include: {
                donateur: { include: { user: true } },
              },
            },
            demandeReparation: {
              include: {
                donation: {
                  include: {
                    demandeObjet: {
                      include: {
                        association: { include: { user: true } },
                        objet: {
                          include: {
                            donateur: {
                              include: { user: true },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        benevolee: true,
      },
    });
    sendEmail(
      rendezVous.benevolee.email,
      "Affectation pour une rencontre",
      `Nous espérons que vous allez bien. Nous vous informons que vous avez été affecté(e) par l'association ${
        rendezVous.donation
          ? rendezVous.donation.demandeObjet.association.user.nom
          : rendezVous.reparationDebut
          ? rendezVous.reparationDebut[0].demandeReparation.donation
              .demandeObjet.association.user.nom
          : rendezVous.reparationFin
          ? rendezVous.reparationFin[0].demandeReparation.donation.demandeObjet
              .association.user.nom
          : ""
      } pour une rencontre.La rencontre est prévue pour le ${format(
        new Date(rendezVous.date),
        "dd/MM/yyyy à HH:mm"
      )}.Adresse de la rencontre : ${
        rendezVous.donation
          ? rendezVous.donation.demandeObjet.objet.donateur.adresse
          : rendezVous.reparationDebut
          ? rendezVous.reparationDebut[0].demandeReparation.donation
              .demandeObjet.objet.donateur.adresse
          : rendezVous.reparationFin
          ? rendezVous.reparationFin[0].demandeReparation.donation.demandeObjet
              .objet.donateur.adresse
          : ""
      }.Votre participation est essentielle pour assurer le bon déroulement de cette mission. Nous comptons sur votre présence et votre engagement.`
    );
    res.json(rendezVous);
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
});
//modifier l'affectation  du benevole a un rendez-vous
router.put("/modifbenevole/:id", async (req, res) => {
  const { idBenevole } = req.body;
  const id = req.params.id;
  try {
    const rendezVousAvant = await prisma.rendezVous.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        benevolee: true,
      },
    });
    if (rendezVousAvant && rendezVousAvant.benevolee) {
      sendEmail(
        rendezVousAvant.benevolee.email,
        "Annulation du rendez-vous",
        `Nous tenons à vous informer que le rendez-vous prévu pour le ${format(
          new Date(rendezVousAvant.date),
          "dd/MM/yyyy à HH:mm"
        )} a malheureusement été annulé`
      );
    }
    const rendezVous = await prisma.rendezVous.update({
      data: {
        idBenevole,
      },
      where: { id: Number(id) },
      include: {
        donation: {
          include: {
            demandeObjet: {
              include: {
                objet: { include: { donateur: { include: { user: true } } } },
                association: { include: { user: true } },
              },
            },
          },
        },
        reparationDebut: {
          include: {
            entreprise: {
              include: {
                donateur: { include: { user: true } },
              },
            },
            demandeReparation: {
              include: {
                donation: {
                  include: {
                    demandeObjet: {
                      include: {
                        association: { include: { user: true } },
                        objet: {
                          include: {
                            donateur: {
                              include: { user: true },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        reparationFin: {
          include: {
            entreprise: {
              include: {
                donateur: { include: { user: true } },
              },
            },
            demandeReparation: {
              include: {
                donation: {
                  include: {
                    demandeObjet: {
                      include: {
                        association: { include: { user: true } },
                        objet: {
                          include: {
                            donateur: {
                              include: { user: true },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        benevolee: true,
      },
    });
    if (rendezVous && rendezVous.benevolee) {
      sendEmail(
        rendezVous.benevolee.email,
        "Affectation pour une rencontre",
        `Nous espérons que vous allez bien. Nous vous informons que vous avez été affecté(e) par l'association ${
          rendezVous.donation
            ? rendezVous.donation.demandeObjet.association.user.nom
            : rendezVous.reparationDebut
            ? rendezVous.reparationDebut[0].demandeReparation.donation
                .demandeObjet.association.user.nom
            : rendezVous.reparationFin
            ? rendezVous.reparationFin[0].demandeReparation.donation
                .demandeObjet.association.user.nom
            : ""
        } pour une rencontre.La rencontre est prévue pour le ${format(
          new Date(rendezVous.date),
          "dd/MM/yyyy à HH:mm"
        )}.Adresse de la rencontre : ${
          rendezVous.donation
            ? rendezVous.donation.demandeObjet.objet.donateur.adresse
            : rendezVous.reparationDebut
            ? rendezVous.reparationDebut[0].demandeReparation.donation
                .demandeObjet.objet.donateur.adresse
            : rendezVous.reparationFin
            ? rendezVous.reparationFin[0].demandeReparation.donation
                .demandeObjet.objet.donateur.adresse
            : ""
        }.Votre participation est essentielle pour assurer le bon déroulement de cette mission. Nous comptons sur votre présence et votre engagement.`
      );
    }
    res.json(rendezVous);
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
});

// modifier un rendezVous
router.put("/:id", async (req, res) => {
  const { date } = req.body;
  const id = req.params.id;
  try {
    await prisma.$transaction(async (prisma) => {
      const rendezVousAvantModif = await prisma.rendezVous.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          benevolee: true,
        },
      }); // pour envoyer l'email au benevole déja affecté
      if (rendezVousAvantModif && rendezVousAvantModif.benevolee) {
        sendEmail(
          rendezVousAvantModif.benevolee.email,
          "Annulation du rendez-vous",
          `Nous tenons à vous informer que le rendez-vous prévu pour le ${format(
            new Date(rendezVousAvantModif.date),
            "dd/MM/yyyy à HH:mm"
          )} a malheureusement été annulé`
        );
      }
      const rendezVousApres = await prisma.rendezVous.update({
        data: {
          date: new Date(
            new Date(date).setHours(new Date(date).getHours() + 1)
          ),
          etatRealisation: "enCours",
          idBenevole: null,
        },
        where: { id: Number(id) },
        include: {
          donation: {
            include: {
              demandeObjet: {
                include: {
                  objet: {
                    include: { donateur: { include: { user: true } } },
                  },
                  association: { include: { user: true } },
                },
              },
            },
          },
          reparationDebut: {
            include: {
              entreprise: {
                include: {
                  donateur: { include: { user: true } },
                },
              },
              demandeReparation: {
                include: {
                  donation: {
                    include: {
                      demandeObjet: {
                        include: {
                          association: { include: { user: true } },
                          objet: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          reparationFin: {
            include: {
              entreprise: {
                include: {
                  donateur: { include: { user: true } },
                },
              },
              demandeReparation: {
                include: {
                  donation: {
                    include: {
                      demandeObjet: {
                        include: {
                          association: { include: { user: true } },
                          objet: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          benevolee: true,
        },
      });
      const notif = await prisma.notification.create({
        data: {
          idUtilisateur:
            (rendezVousApres?.donation &&
              rendezVousApres?.donation?.demandeObjet?.association?.userIdA) ||
            (rendezVousApres?.reparationDebut &&
              rendezVousApres?.reparationDebut[0]?.demandeReparation?.donation
                ?.demandeObjet?.associationId) ||
            (rendezVousApres?.reparationFin &&
              rendezVousApres.reparationFin[0]?.demandeReparation?.donation
                ?.demandeObjet?.associationId),
          description: `Nous vous informons que le rendez-vous de ${
            rendezVousApres.donation
              ? "donation"
              : rendezVousApres.reparationDebut
              ? "réparation"
              : rendezVousApres.reparationFin
              ? "réparation"
              : ""
          } prévu initialement pour le ${format(
            new Date(rendezVousAvantModif.date),
            "dd/MM/yyyy à HH:mm"
          )} a été modifié pour le ${format(
            new Date(rendezVousApres.date),
            "dd/MM/yyyy à HH:mm"
          )} .Nous vous invitons à affecter à nouveau un bénévole pour ce rendez-vous modifié`,
        },
      });
      res.json(rendezVousApres);
    });
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
});
//realiser un rendezVous
router.put("/realise/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const rendezVous = await prisma.rendezVous.update({
      data: {
        etatRealisation: "realise",
      },
      where: { id: Number(id) },
      include: {
        donation: {
          include: {
            demandeObjet: {
              include: {
                objet: { include: { donateur: { include: { user: true } } } },
                association: true,
              },
            },
          },
        },
        reparationDebut: {
          include: {
            entreprise: {
              include: {
                donateur: { include: { user: true } },
              },
            },
            demandeReparation: {
              include: {
                donation: {
                  include: {
                    demandeObjet: {
                      include: {
                        association: {
                          include: {
                            user: true,
                          },
                        },
                        objet: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        reparationFin: {
          include: {
            entreprise: {
              include: {
                donateur: { include: { user: true } },
              },
            },
            demandeReparation: {
              include: {
                donation: {
                  include: {
                    demandeObjet: {
                      include: {
                        association: {
                          include: {
                            user: true,
                          },
                        },
                        objet: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        benevolee: true,
      },
    });
    res.json(rendezVous);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
//marquer  un rendezVous comme non realisé
router.put("/nonRealise/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const rendezVous = await prisma.rendezVous.update({
      data: {
        etatRealisation: "nonRealise",
      },
      where: { id: Number(id) },
      include: {
        donation: {
          include: {
            demandeObjet: {
              include: {
                objet: { include: { donateur: { include: { user: true } } } },
                association: true,
              },
            },
          },
        },
        reparationDebut: {
          include: {
            entreprise: {
              include: {
                donateur: { include: { user: true } },
              },
            },
            demandeReparation: {
              include: {
                donation: {
                  include: {
                    demandeObjet: {
                      include: {
                        association: {
                          include: {
                            user: true,
                          },
                        },
                        objet: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        reparationFin: {
          include: {
            entreprise: {
              include: {
                donateur: { include: { user: true } },
              },
            },
            demandeReparation: {
              include: {
                donation: {
                  include: {
                    demandeObjet: {
                      include: {
                        association: {
                          include: {
                            user: true,
                          },
                        },
                        objet: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        benevolee: true,
      },
    });
    res.json(rendezVous);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
// Tâche planifiée pour envoyer des e-mails deux jours avant les rendez-vous
cron.schedule("26 14 * * *", async () => {
  // Recherche des rendez-vous deux jours à partir de maintenant
  const deuxJoursPlusTard = new Date();
  deuxJoursPlusTard.setDate(deuxJoursPlusTard.getDate() + 1);
  console.log(deuxJoursPlusTard);
  //  récupérer les rendez-vous à venir
  const rendezVous = await prisma.rendezVous.findMany({
    where: {
      date: {
        gte: new Date(
          deuxJoursPlusTard.getFullYear(),
          deuxJoursPlusTard.getMonth(),
          deuxJoursPlusTard.getDate()
        ), // date de début de la journée
        lt: new Date(
          deuxJoursPlusTard.getFullYear(),
          deuxJoursPlusTard.getMonth(),
          deuxJoursPlusTard.getDate() + 1
        ), // date de fin de la journée
      },
    },
    include: {
      donation: {
        include: {
          demandeObjet: {
            include: {
              objet: {
                include: {
                  donateur: { include: { user: { select: { email: true } } } },
                },
              },
              association: { include: { user: { select: { email: true } } } },
            },
          },
          demandeReparation: {
            include: {
              reparation: {
                include: {
                  entreprise: {
                    include: {
                      donateur: {
                        include: { user: { select: { email: true } } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      benevolee: true,
    },
  });

  console.log("Rendez-vous récupérés :", rendezVous);

  // Envoi d'un e-mail pour chaque rendez-vous trouvé
  rendezVous.forEach((rendezVous) => {
    console.log("Rendez-vous :", rendezVous);

    const donateurEmail =
      rendezVous?.donation?.demandeObjet?.objet?.donateur?.user?.email;
    const associationEmail =
      rendezVous?.donation?.demandeObjet?.association?.user?.email;
    const entrepriseEmail =
      rendezVous?.donation?.demandeReparation?.reparation?.entreprise?.donateur
        ?.user?.email;
    const benevoleEmail = rendezVous.benevolee.email;
    console.log("Email du donateur :", donateurEmail);
    console.log("Email de l'association :", associationEmail);
    console.log("Email de l'entreprise :", entrepriseEmail);
    console.log("Email du bénévole :", benevoleEmail);

    if (donateurEmail) {
      console.log("Envoi d'email au donateur...", donateurEmail);
      sendEmail(
        donateurEmail,
        "Rappel de rendez-vous",
        `Vous avez un rendez-vous prévu pour le ${rendezVous.date}. N'oubliez pas de vous y rendre !`
      );
    }

    if (associationEmail) {
      console.log("Envoi d'email à l'association...", associationEmail);
      sendEmail(
        associationEmail,
        "Rappel de rendez-vous",
        `Vous avez un rendez-vous prévu pour le ${rendezVous.date}. N'oubliez pas de vous y rendre !`
      );
    }

    if (entrepriseEmail) {
      console.log("Envoi d'email à l'entreprise...", entrepriseEmail);
      sendEmail(
        entrepriseEmail,
        "Rappel de rendez-vous",
        `Vous avez un rendez-vous prévu pour le ${rendezVous.date}. N'oubliez pas de vous y rendre !`
      );
    }
    if (benevoleEmail) {
      console.log("Envoi d'email à l'entreprise...", benevoleEmail);
      sendEmail(
        benevoleEmail,
        "Rappel de rendez-vous",
        `Vous avez un rendez-vous prévu pour le ${rendezVous.date}. N'oubliez pas de vous y rendre !`
      );
    }
  });
});

module.exports = router;
