const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { format } = require("date-fns");
const prisma = new PrismaClient();
const router = express.Router();

//Ajout d'une donation
router.post("/", async (req, res) => {
  const { date, idDemandeObjet } = req.body;
  try {
    await prisma.$transaction(async (prisma) => {
      const datePlus = new Date(
        new Date(date).setHours(new Date(date).getHours() + 1)
      );
      const rendezVous = await prisma.rendezVous.create({
        data: {
          date: datePlus,
        },
      });
      const donation = await prisma.donation.create({
        data: {
          idDemandeObjet: Number(idDemandeObjet),
          idRendezVous: rendezVous.id,
        },
        include: {
          rendezVous: true,
          demandeObjet: {
            include: { objet: { include: { image: true } }, association: true },
          },
        },
      });

      const demande = await prisma.demandeObjet.update({
        data: {
          etatAcceptation: "acceptee",
        },
        where: {
          id: Number(idDemandeObjet),
        },
        include: {
          objet: true,
        },
      });
      const nbObjets = await prisma.donateur.update({
        data: {
          nbObjetsDonnes: {
            increment: 1,
          },
        },
        where: {
          userIdD: demande.objet.idDonateur,
        },
      });
      const notif = await prisma.notification.create({
        data: {
          idUtilisateur: demande.associationId,
          description: ` félicitations, votre demande de l'objet ${demande.objet.nom} a été acceptée`,
        },
      });

      const demandes = await prisma.demandeObjet.updateMany({
        data: {
          etatAcceptation: "refusee",
        },
        where: {
          objet: {
            id: demande.idObjet,
          },
          NOT: [
            {
              id: demande.id,
            },
            {
              etatAcceptation: "annulee",
            },
          ],
        },
      });
      const objetNonDispo = await prisma.objet.update({
        data: {
          disponible: false,
        },
        where: {
          id: demande.objet.id,
        },
      });
      // Récupèrer les demandes mises à jour
      const updatedDemandes = await prisma.demandeObjet.findMany({
        where: {
          objet: {
            id: demande.idObjet,
          },
          NOT: {
            id: demande.id,
          },
        },
      });
      for (const dmd of updatedDemandes) {
        const notifications = await prisma.notification.create({
          data: {
            idUtilisateur: dmd.associationId,
            description: ` malheureusement, votre demande de l'objet ${demande.objet.nom} a été refusée`,
          },
        });
      }
      res.json(donation);
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// afficher la liste des donations pour une association.
router.get("/association/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const donations = await prisma.donation.findMany({
      where: {
        demandeObjet: {
          association: {
            userIdA: Number(id),
          },
        },
      },
      include: {
        demandeObjet: {
          include: {
            association: true,
            objet: {
              include: { image: true, donateur: { include: { user: true } } },
            },
          },
        },
        rendezVous: true,
      },
    });
    res.json(donations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
//afficher une donation
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const donation = await prisma.donation.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.json(donation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// afficher la liste des donations pour un donateur.
router.get("/donateur/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const donations = await prisma.donation.findMany({
      where: {
        demandeObjet: {
          objet: {
            idDonateur: Number(id),
          },
        },
      },
      include: {
        demandeObjet: {
          include: {
            association: { include: { user: true } },
            objet: {
              include: { image: true, donateur: { include: { user: true } } },
            },
          },
        },
        rendezVous: true,
      },
    });
    res.json(donations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Archiver une donation
router.put("/archive/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.$transaction(async (prisma) => {
      const donation = await prisma.donation.update({
        data: {
          etatArchive: true,
        },
        where: { id: Number(id) },
        include: {
          demandeObjet: {
            include: {
              association: true,
              objet: true,
            },
          },
          rendezVous: true,
        },
      });
      /*const rendez=await prisma.rendezVous.delete({
where: { 
    id:donation.idRendezVous
   },
})*/
      res.json(donation);
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
//marquer une donation pour réparation
router.put("/marquerReparation/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.$transaction(async (prisma) => {
      const donation = await prisma.donation.update({
        data: {
          etatReparation: true,
        },
        where: { id: Number(id) },
        include: {
          demandeObjet: {
            include: {
              association: true,
              objet: true,
            },
          },
          rendezVous: true,
        },
      });
      res.json(donation);
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
module.exports = router;
