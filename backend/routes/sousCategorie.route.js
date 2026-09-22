const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
//Ajout d'une scategorie
router.post('/', async (req, res, )=> {
const {nom,image,idCategorie}=req.body
try {
const scategorie = await prisma.sousCategorie.create({
data: {
nom: nom,
image: image,
idCategorie:idCategorie,
}
})
res.json(scategorie)
} catch (error) {
res.status(500).json({
message:error.message,
})
}
});
// afficher la liste des sousCatégories.
router.get('/', async (req, res, )=> {
try {

const sousCategorie = await prisma.sousCategorie.findMany({
    where:{
        etatArchive:false
    }
    ,
    orderBy: {
        id: 'desc' },
include: {
categorie: {
select: {
nom: true,
},
}
}
})
res.json(sousCategorie)
} catch (error) {
res.status(500).json({
message:error.message,
})
}
});
// afficher la liste des sousCatégories d'une categorie.
router.get('/cat/:idCateg', async (req, res, )=> {
    const { idCateg } = req.params;
    try {
        const sousCategories = await prisma.sousCategorie.findMany({
        where: {
        idCategorie: Number(idCateg),
        etatArchive:false
        },
        orderBy: {
            id: 'desc' },
        include: {
        categorie: true,
        },
        });
        res.json(sousCategories);
        }catch (error) {
    res.status(500).json({
    message:error.message,
    })
    }
    });
// afficher la liste des sousCatégories d'une categorie pour admin
router.get('/catAdmin/:idCateg', async (req, res, )=> {
    const { idCateg } = req.params;
    try {
        const sousCategories = await prisma.sousCategorie.findMany({
        where: {
        idCategorie: Number(idCateg),
        },
        orderBy: {
            id: 'desc' },
        include: {
        categorie: true,
        },
        });
        res.json(sousCategories);
        }catch (error) {
    res.status(500).json({
    message:error.message,
    })
    }
    });

// afficher une scategorie.
router.get('/:id', async (req, res, )=> {
const { id } = req.params
try {
const scategorie = await prisma.sousCategorie.findUnique({
where: {
id: Number(id),
}
})
res.json(scategorie)
} catch (error) {
res.status(500).json({
message:error.message,
})
}
});

// modifier une scategorie
router.put('/:id', async (req, res)=> {
const {nom,image,idCategorie}=req.body
const id = req.params.id;
try {
const scategorie = await prisma.sousCategorie.update({
data: {
nom: nom,
image: image,
idCategorie:idCategorie,
},
where: { id: Number(id)},
})
res.json(scategorie);
} catch (error) {
res.status(404).json({ message: error.message });
}
});
// chercher une Scategorie par nom.
router.put('/find/nomScat', async (req, res, )=> {
    const { nom } = req.body
    try {
    const souscategorie = await prisma.sousCategorie.findFirst({
    where: {
    nom:nom,
    etatArchive:false
    }
    })
    res.json(souscategorie)
    } catch (error) {
    res.status(500).json({
    message:error.message,
    })
    
    }
    });
// archiver une sousCategorie
router.put('/archive/:id', async (req, res)=> {
const id = req.params.id;
try {
    const SousCategorie = await prisma.sousCategorie.update({
        data: {
        etatArchive:true
        },
        where: { id: Number(id)},
        })
res.json(SousCategorie);
} catch (error) {
res.status(404).json({ message: error.message });
}
});
// desarchiver une sousCategorie
router.put('/desarchive/:id', async (req, res)=> {
const id = req.params.id;
try {
    const SousCategorie = await prisma.sousCategorie.update({
        data: {
        etatArchive:false
        },
        where: { id: Number(id)},
        })
res.json(SousCategorie);
} catch (error) {
res.status(404).json({ message: error.message });
}
});
module.exports = router;