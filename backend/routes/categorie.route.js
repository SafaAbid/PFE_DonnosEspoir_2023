const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

//Ajout d'une categorie
router.post("/", async (req, res) => {
  const { nom, image, description } = req.body;
  try {
    const categorie = await prisma.categorie.create({
      data: {
        nom: nom,
        image: image,
      },
    });
    res.json(categorie);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// afficher la liste des catégories.
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.categorie.findMany({
      where: {
        etatArchive: false,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        sousCategories: true,
        //{select : {nom :true}}
      },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// afficher la liste des catégories pour l'admin.
router.get("/admin", async (req, res) => {
  try {
    const categories = await prisma.categorie.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        sousCategories: true,
        //{select : {nom :true}}
      },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// afficher une categorie.
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const categorie = await prisma.categorie.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.json(categorie);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// chercher une categorie par nom.
router.put("/nomCat", async (req, res) => {
  const { nom } = req.body;
  try {
    const categories = await prisma.categorie.findMany({
      where: {
        etatArchive: false,
      },
    });
    const categorie = categories?.filter(
      (obj) => obj.nom.toUpperCase() == nom.toUpperCase()
    )[0];
    res.json(categorie);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
    console.log(error.message);
  }
});

// modifier une categorie
router.put("/:id", async (req, res) => {
  const { nom, image } = req.body;
  const id = req.params.id;
  try {
    const categorie = await prisma.categorie.update({
      data: {
        nom: nom,
        image: image,
      },
      where: { id: Number(id) },
    });
    res.json(categorie);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
// archiver une categorie
router.put("/archive/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.$transaction(async (prisma) => {
      const categorie = await prisma.categorie.update({
        data: {
          etatArchive: true,
        },
        where: { id: Number(id) },
      });
      const souscategorie = await prisma.sousCategorie.updateMany({
        data: {
          etatArchive: true,
        },
        where: { idCategorie: categorie.id },
      });

      res.json(categorie);
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
// desarchiver une categorie
router.put("/desarchive/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.$transaction(async (prisma) => {
      const categorie = await prisma.categorie.update({
        data: {
          etatArchive: false,
        },
        where: { id: Number(id) },
      });
      const souscategorie = await prisma.sousCategorie.updateMany({
        data: {
          etatArchive: false,
        },
        where: { idCategorie: categorie.id },
      });

      res.json(categorie);
    });
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
});
module.exports = router;
