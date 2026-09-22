const express = require('express');
const { PrismaClient } = require('@prisma/client')
const nodemailer=require('nodemailer');
const bcrypt = require('bcrypt') //pour le cryptage
const jwt = require('jsonwebtoken'); //pour le token
const prisma = new PrismaClient()
const router = express.Router();

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
//Access Token
const generateAccessToken=(user) =>{
    return jwt.sign ({ iduser: user.id, role: user.role }, process.env.SECRET, {
    expiresIn: '1y'})
    }
    // Refresh
    function generateRefreshToken(user) {
    return jwt.sign ({ iduser: user.id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y'})
    }
router.post('/register', async (req, res) => {
    try {
        await prisma.$transaction(async (prisma) => {
        const { email, nom, motDePasse, role } = req.body
        const user = await prisma.utilisateur.findUnique({
            where: {
                email: email,
            },
        })
        if (user){
            return res.status(404).send({
                success: false,
                message: "l'utilisateur existe déja"
            })}
            const getImageByRole = (role) => {
                switch (role) {
                    case 'administrateur':
                        return 'https://res.cloudinary.com/dmbkofiro/image/upload/v1713924474/images/xg1htshcaarthxvnj9vg.png';
                    case 'donateur':
                        return 'https://res.cloudinary.com/dmbkofiro/image/upload/v1713923916/images/ze5ytyshmweusb4gypsr.png';
                    case 'association':
                        return 'https://res.cloudinary.com/dmbkofiro/image/upload/v1713923916/images/xdvavia4ci9f25eywjxu.png';
                    case 'entreprise':
                        return 'https://res.cloudinary.com/dmbkofiro/image/upload/v1713923916/images/z2i2yr8gsct1qrgh1viv.png';
                    default:
                        return " ";
                }
            };
        const salt = await bcrypt.genSalt(10)
        const motDePasseCrypte = await bcrypt.hash(motDePasse, salt)
        const userCreate = await prisma.utilisateur.create({
            data: {
                email:email,
                nom:nom,
                role:role,
                motDePasse:motDePasseCrypte,
                image:getImageByRole(role)

            },
        })
        
        if (userCreate.role == 'donateur') {
            let { adresse, numTelephone,ville } = req.body
            const donateur = await prisma.donateur.create({
                data: {
                    userIdD: userCreate.id,
                    numTelephone: numTelephone,
                    adresse:adresse, 
                    ville:ville
                }
                ,
                include: {
                    user: true
                }
            })
            var mailOption = {
                from: ' <safabid95@gmail.com>',
                to: userCreate.email,
                subject: 'Validation du compte',
                html: `  
                        <h2>  Bienvenue,${userCreate.nom}!</h2>
                        <h4>Cher(e) ${userCreate.nom},
                        Nous vous remercions pour votre inscription sur Donnons Espoir ! Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :
                       <p> <a
                        href="http://${req.headers.host}/api/utilisateurs/activeDonateur/utilisateur?email=${userCreate.email}">cliquez
                        ici</a></p>.
                        Une fois votre compte activé, vous pourrez accéder à toutes les fonctionnalités de notre plateforme</h4>
                        <p>Cordialement,</p>
                        <p>----------</p>
                        <p>DonnonsEspoir</p>
                    `
            }
            transporter.sendMail(mailOption, function (error, info) {
                if (error) {
                    console.log(error)
                }
                else {
                    console.log('la validation du compte a été envoyé a votre compte')
                }
            })
            //const token = generateAccessToken(donateur);
            //const refreshToken = generateRefreshToken(donateur);
            return res.status(202).send({
                success: true, message: "Succes", user: donateur /*,token,refreshToken*/
            })
        } else if (userCreate.role =='association') {
            const { identifiant,nomResponsable,numTelephone,adresse,ville } = req.body
            const association = await prisma.association.create({
                data: {
                   userIdA: userCreate.id,
                   identifiant:identifiant,
                   nomResponsable:nomResponsable,
                   numTelephone:numTelephone,
                   adresse:adresse,
                   ville:ville
                },
                include: {
                    user: true
                }
            })
            //const token = generateAccessToken(association);
            //const refreshToken = generateRefreshToken(association);
            return res.status(201).send({
                success: true, message: "Compte created successfully", user: association /*,token,refreshToken*/
            })
        } else  if (userCreate.role =='entreprise'){
            let { adresse, numTelephone,nomResponsable ,ville,identifiant} = req.body
            const donateur = await prisma.donateur.create({
                data: {
                    userIdD: userCreate.id,
                    numTelephone: numTelephone,
                    adresse:adresse, 
                    ville:ville,
                   
                },
                include: {
                    user: true
                }
            })
            const entreprise = await prisma.entreprise.create({
                data: {
                    donateurId:donateur.userIdD,
                    nomResponsable:nomResponsable,
                    identifiant:identifiant
                },
                include: {
                    donateur: {include:{
                        user:true
                    }}
                }
            })
           // const token = generateAccessToken(entreprise);
            //const refreshToken = generateRefreshToken(entreprise);
            return res.status(201).send({
                success: true, message: "Compte created successfully", user: entreprise /*,token,refreshToken */
            })
        }else{
            //Admin
            const admin = await prisma.administrateur.create({
                data: {
                userIdAdmin:userCreate.id,
            },
                
            })
            //const token = generateAccessToken(admin);
            //const refreshToken = generateRefreshToken(admin);
            return res.status(201).send({
                success: true, message: "Compte created successfully", user: admin /*,token,refreshToken*/
            })
        }
        
    })
} catch (err) {
        console.log(err)
        res.status(200).send({ success: false, message: err.message })
    }
});
//tous les comptes sauf administrateur
router.get('/',async(req,res)=>{
    try {
        const utilisateurs = await prisma.utilisateur.findMany({
            where: {
                role: {
                    not: "administrateur" 
                }
            },
            include: {
                association: true,
                donateur: {
                    include: {
                        entreprise: true
                    }
                },
            }})
            res.status(200).json(utilisateurs);
    } catch (error) {
        res.status(404).json({erreur:error.message})
    }
})
// tous les associations
router.get('/Allassociations',async(req,res)=>{
    try {
        const associations = await prisma.association.findMany({
            include: {
                user: true
            }})
            res.status(200).json(associations);
    } catch (error) {
        res.status(404).json({erreur:error.message})
    }
})

// tous les donateurs 
router.get('/Alldonateurs',async(req,res)=>{
    try {
        const donateurs = await prisma.donateur.findMany({
            where: {
                entreprise: null 
            },
            include: {
                user: true
            }})
            res.status(200).json( donateurs);
    } catch (error) {
        res.status(404).json({erreur:error.message})
    }
})

// tous les entreprises
router.get('/Allentreprises',async(req,res)=>{
    try {
        const entreprises = await prisma.entreprise.findMany({
            include: {
                donateur: {
                  include: {
                    user: true
                  }
                }
              }   
        }
        )
        res.status(200).json( entreprises);
    } catch (error) {
        res.status(404).json({erreur:error.message})
    }
})
//modifier le compte 
router.put('/:id',async (req, res) => {
    let { email, nom, motDePasse,image ,ville} = req.body
    const id = req.params.id;

    try {
        await prisma.$transaction(async (prisma) => {
        const user = await prisma.utilisateur.findUnique({
            where: {
                id: Number(id),
            },
        })
        if (user) {
            await prisma.utilisateur.update({
                data: {
                    email, nom, motDePasse,image
                },
                where: {
                    id: Number(id),
                },
            })
            if (user.role == 'association') {
                const { nomResponsable,numTelephone,adresse } = req.body
                const association = await prisma.association.update({
                    data: {
                       nomResponsable:nomResponsable,numTelephone:numTelephone,adresse:adresse,ville:ville
                    },
                    where: {
                        userIdA: Number(id),
                    },
                    include: {
                        user: true
                    }
                })
                return res.status(201).send({
                    success: true, message: "Compte update successfully", user: association
                })
            } else if (user.role == 'donateur') {
                let { adresse, numTelephone } = req.body
                const donateur = await prisma.donateur.update({
                    data: {
                        adresse,numTelephone,ville
                    },
                    where: {
                        userIdD: Number(id), 
                    },
                    include: {
                        user: true
                    }
                })
                return res.status(201).send({
                    success: true, message: "Compte update successfully", user: donateur
                })
            } else if(user.role=="entreprise"){
                let { adresse, numTelephone,nomResponsable } = req.body
                const donateur = await prisma.donateur.update({
                    data: {
                        adresse, numTelephone,ville
                    },
                    where: {
                        userIdD: Number(id),
                    },
                    include: {
                        user: true
                    }
                })
                const entreprise = await prisma.entreprise.update({
                    data: {
                        nomResponsable
                    },
                    where: {
                        donateurId: user.id,
                    },
                    include: {
                        donateur: {
                            include: {
                              user: true
                                     }
                                }
                    }
                })
                return res.status(201).send({
                    success: true, message: "Compte update successfully", user: entreprise
                })
            }else{
                let { email, nom, motDePasse,image } = req.body
                const admin=await prisma.administrateur.findUnique({
                    where: {
                        userIdAdmin: Number(id),
                    },
                    include: {
                        user: true
                    }
                })
                return res.status(201).send({
                    success: true, message: "Compte update successfully", user: admin
                })
            }
        }
    })} catch (error) {
        res.status(200).json({ message: error });
    }
});
// chercher compte par email 
router.get('/compteByEmail/:email',async (req, res,) => {
    const  {email}  = req.params
    try {
        const user = await prisma.utilisateur.findFirst({
            where: {
                email,
            },
        })
        return res.status(200).send(user)
    } catch (error) {
        res.status(500).json({
            message: error.message,
            
        })
console.log(error.message);
    }
});
// chercher compte don par num 
router.get('/compteDonByNum/:num',async (req, res,) => {
    const  {num}  = req.params
    try {
        const user = await prisma.donateur.findFirst({
            where: {
                numTelephone:num,
            },
        })
        return res.status(200).send(user)
    } catch (error) {
        res.status(500).json({
            message: error.message,
            
        })
console.log(error.message);
    }
});
// chercher compte par email 
router.get('/compteAssoByNum/:num',async (req, res,) => {
    const  {num}  = req.params
    try {
        const user = await prisma.association.findFirst({
            where: {
                numTelephone:num,
            },
        })
        return res.status(200).send(user)
    } catch (error) {
        res.status(500).json({
            message: error.message,
            
        })
console.log(error.message);
    }
});
router.get('/compte/:id',async (req, res,) => {
    const  {id}  = req.params
    try {
        const user = await prisma.utilisateur.findUnique({
            where: {
                id: Number(id),
            },
        })
        if (user) {
            if (user.role == 'donateur') {
                const donateur = await prisma.donateur.findUnique({
                    where: {
                        userIdD: Number(id),
                    },
                    include: {
                        
                        user: true
                    }
                })
                return res.status(200).send(donateur)
            } else if (user.role == 'association') {
                const association = await prisma.association.findUnique({
                    where: {
                        userIdA: Number(id),
                    },
                    include: {
                        user: true
                    }
                })
                return res.status(200).send(association)
            } else if (user.role == 'entreprise') {
                const entreprise = await prisma.entreprise.findUnique({
                    where: {
                        donateurId: Number(id),
                    },
                    include: {
                       donateur: {
                        include:{
                            user:true
                        }
                       }
                    }
                })
                return res.status(200).send({
                    success: true, message: "User details retrieved successfully",  entreprise
                })
            }else{
                const admin = await prisma.administrateur.findUnique({
                    where: {
                        userIdAdmin: Number(id),
                    },
                    include: {
                      
                            user:true
                       
                    }
                })
                return res.status(200).send({
                    success: true, message: "User details retrieved successfully", admin
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })

    }
});
//se connecter
router.post('/login', async (req, res) => {
    try {
        let { email, motDePasse } = req.body
        if (!email || !motDePasse) {
            return res.status(404).send({
                success: false, message: "tous les champs sont obligatoires"
            })
        }
        let user = await prisma.utilisateur.findUnique({
            where: {
                email: email,
            },
            include:{
                donateur:{include:{entreprise:true}},
                association:true,
            }
        })
        if (!user) {
            return res.status(400).send({
                success: false, message: " le compte n'existe pas"
            })
            } else if ( user && user.role=="donateur" && !user.donateur.isActive ) {
                return res.status(400).send({
                    success: false, message : "Votre compte est inactif. Veuillez consulter votre messagerie Gmail pour plus d'informations"
                })
        }else if(user && user.role=="association" && !user.association.isActive || user && user.role=="entreprise" && !user.donateur.isActive){
            return res.status(400).send({
                success: false, message : "Votre compte est en cours de validation par l'administrateur. Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter à l'adresse suivante : donnosEspoir@gmail.com"
            })
        }
        else {
            let isCorrectPassword = await bcrypt.compare(motDePasse, user.motDePasse)
            if (isCorrectPassword) {
                const token = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);
                if (user.role == 'donateur') {
                    const donateur = await prisma.donateur.findUnique({
                        where: {
                            userIdD: user.id
                        },
                        include: {
                            user: true
                        }
                    })
                    return res.status(200).send({
                        success: true, token, refreshToken, user: donateur
                    })
                } else if (user.role == 'association') {
                    const association = await prisma.association.findUnique({
                        where: {
                            userIdA: user.id
                        },
                        include: {
                            user: true
                        }
                    })
                    return res.status(200).send({
                        success: true, token, refreshToken, user: association
                    })
                } else  if (user.role == 'entreprise') {
                    const entreprise = await prisma.entreprise.findUnique({
                        where: {
                           donateurId: user.id
                        },
                        include: {
                            donateur:{
                                include:{
                                user:true
                            }}
                        }
                    })
                    return res.status(200).send({
                        success: true, token, refreshToken, user: entreprise
                    })
                }else{
                    const admin = await prisma.administrateur.findUnique({
                        where: {
                           userIdAdmin: user.id
                        },
                        include: {
                                user:true
                        }
                    })
                    return res.status(200).send({
                        success: true, token, refreshToken, user: admin
                    })
                }
            } else {
                return res.status(404).send({
                    success: false, message: "Veuillez vérifier votre mot de passe"
                })
            }
        }
    } catch (err) {
        return res.status(404).send({ success: false, message: err.message })
    }
});
// chercher un utilisateur par nom.
router.put('/nom/Util', async (req, res, )=> {
    const { nom } = req.body
    try {
    const utilisateur = await prisma.utilisateur.findFirst({
    where: {
    nom:nom,
    }
    })
    res.json(utilisateur)
    }
    catch (error) {
    res.status(500).json({
    message:error.message,
    })   
    }
    });
// chercher un utilisateur par nom.
router.put('/num/Util', async (req, res, )=> {
    const { numTelephone , role } = req.body
    try {
        if(role=="association"){
    const utilisateur = await prisma.association.findFirst({
    where: {
    numTelephone:numTelephone,
    }
    })
    res.json(utilisateur)}
    else{
        const utilisateur = await prisma.donateur.findFirst({
            where: {
            numTelephone:numTelephone,
            }
            })
            res.json(utilisateur)
    }    
    }
    catch (error) {
    res.status(500).json({
    message:error.message,
    })   
    }
    });
// chercher un utilisateur par identifiant.
router.put('/identifiant/Util', async (req, res, )=> {
    const { identifiant , role } = req.body
    try {
        if(role=="association"){
    const utilisateur = await prisma.association.findFirst({
    where: {
    identifiant:identifiant,
    }
    })
    res.json(utilisateur)}
    else if(role=="entreprise") {
        const utilisateur = await prisma.entreprise.findFirst({
            where: {
            identifiant:identifiant,
            }
            })
            res.json(utilisateur)
    }    
    }
    catch (error) {
    res.status(500).json({
    message:error.message,
    })   
    }
    });

//Refresh Route
router.post('/refreshToken', async (req, res, )=> {
    console.log(req.body.refreshtoken)
    const refreshtoken = req.body.refreshtoken;
    if (!refreshtoken) {
    return res.status(404).send({success: false, message: 'Token Not Found' });
    }
    else {
    jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) { console.log(err.message)
    return res.status(406).send({ success: false,message: 'Unauthorized' });
    }
    else {
    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    console.log("token-------",token);
    res.status(200).send({success: true,token, refreshToken
    })
    }
    });
    }
    
    });
//mot de passe oublié
router.post('/forgot-password', (req, res) => {
    const {email} = req.body;
    prisma.utilisateur.findUnique({where:{email: email}})
    .then(user => {
    if(!user) {
    return res.send({Status: "User not existed"})
    }
    const token = jwt.sign({id: user.id}, "jwt_secret_key", {expiresIn:
    "1d"})
    var mailOptions = {
    from: '"vérifiez votre email " <safabid95@gmail.com>',
    to: email,
    subject: 'Réinitialisation du Mot de Passe',
    text: `http://localhost:3000/reset_password/${user.id}/${token}`
    };
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error);
    } else { console.log(info)
    return res.send({Status: "Success",token})
    }
    });
    })
    })
    
    /*
    Reset Password
    */
    router.post('/reset_password/:id/:token', async(req, res) => {
    const {id, token} = req.params
    const {motDePasse} = req.body
    jwt.verify(token, "jwt_secret_key", async (err, decoded) => {
    if(err) {
    return res.json({Status: "Error with token"})
    } else {
    const salt=await bcrypt.genSalt(10);
    await bcrypt.hash(motDePasse,salt)
    .then(hash => {
    prisma.utilisateur.update({
        data:{motDePasse: hash},
        where:{id: Number(id)}, 
    })
    .then(u => res.send({Status: "Success"}))
    .catch(err => res.send({Status: err.message}))
    })
    .catch(err => res.send({Status: err.message}))
    }
    })
    })
//activer le compte
router.get('/active/utilisateur', async (req, res) => {
    try {
    const email = req.query.email
    console.log(email)
    const user = await prisma.utilisateur.findFirst({where:{email:email}})
   if(user && user.role=="association"){
    utilisateur= await prisma.association.update({
            data: {
            isActive: true
            },
            where: { userIdA: user.id},
            include:{
                user:true
            }
            })
    u=await prisma.utilisateur.findUnique({
        where:{
            id:utilisateur.userIdA
        },include: {
            association: true,
            donateur: {
                include: {
                    entreprise: true
                }
            },
        }
    })
            res.status(200).send(u)
    }else if(user && (user.role=="donateur" || user.role=="entreprise") ){
       utilisateur= await prisma.donateur.update({
            data: {
            isActive: true
            },
            where: {userIdD:user.id},
            include:{
                user:true,entreprise:true
            }
            })
            u=await prisma.utilisateur.findUnique({
                where:{
                    id:utilisateur.userIdD
                },include: {
                    association: true,
                    donateur: {
                        include: {
                            entreprise: true
                        }
                    },
                }
            })
            res.status(200).send( u )
    }
    var mailOption = {
        from: ' <safabid95@gmail.com>',
        to: user.email,
        subject: 'Validation du compte',
        html: `  
                <h2>  Bienvenue,${user.nom}!</h2>
                <h4>Cher(e) ${user.nom},
               <p> Nous sommes ravis de vous accueillir sur Donnons Espoir ! Votre compte a été validé avec succès par notre équipe administrative.
                Vous pouvez désormais accéder à toutes les fonctionnalités de notre plateforme.
                N'hésitez pas à explorer notre plateforme et à profiter de toutes les ressources mises à votre disposition.</p>
                <p>Cordialement,</p>
                <p>----------</p>
                <p><a href="http://localhost:3000/login" >DonnonsEspoir</a></p>
            `
    }
    transporter.sendMail(mailOption, function (error, info) {
        if (error) {
            console.log(error)
        }
        else {
            console.log('la validation du compte a été envoyé a votre compte')
        }
    })
    } catch (err) {
    return res.status(404).send({ success: false, message: err.message })
    }
    })
    //activer le compte
router.get('/activeDonateur/utilisateur', async (req, res) => {
    try {
    const email = req.query.email
    console.log(email)
    const user = await prisma.utilisateur.findFirst({where:{email:email}})
       utilisateur= await prisma.donateur.update({
            data: {
            isActive: true
            },
            where: {userIdD:user.id},
            include:{
                user:true,entreprise:true
            }
            })
            res.send(`
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmation d'activation du compte</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 100px auto;
                        background-color: #fff;
                        border-radius: 8px;
                        padding: 30px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h2 {
                        color: #333;
                    }
                    .center {
                        text-align: center;
                    }
                    p {
                        color: #666;
                        margin-bottom: 20px;
                    }
                    a {
                        display: inline-block;
                        background-color: #007bff;
                        color: #fff;
                        text-decoration: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                    }                     
                    a:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Votre compte a été activé avec succès!</h2>
                    <p>Vous pouvez maintenant vous connecter à votre compte.</p>
                    <div class="center">
                    <a href="http://localhost:3000/login">Se connecter</a>
                </div>                
                </div>
            </body>
            </html>
        `);
    }catch (err) {
    return res.status(404).send({ success: false, message: err.message })
    }
    })
    //desactiver le compte
    router.put('/desactive/utilisateur', async (req, res) => {
        try {
        let email = req.query.email
        const raison=req.body.raison
        console.log(email)
        let user = await prisma.utilisateur.findFirst({where:{email:email}})
       if(user.role=="association"){
        utilisateur= await prisma.association.update({
                data: {
                isActive: false
                },
                where: { userIdA: user.id},
                include:{
                    user:true
                }
                })
                u=await prisma.utilisateur.findUnique({
                    where:{
                        id:utilisateur.userIdA
                    },include: {
                        association: true,
                        donateur: {
                            include: {
                                entreprise: true
                            }
                        },
                    }
                })  
                res.status(200).send( u )
        }else if(user.role=="donateur" || user.role=="entreprise" ){
           utilisateur= await prisma.donateur.update({
                data: {
                isActive: false
                },
                where: {userIdD:user.id},
                include:{
                    user:true,entreprise:true
                }
                })
                u=await prisma.utilisateur.findUnique({
                    where:{
                        id:utilisateur.userIdD
                    },include: {
                        association: true,
                        donateur: {
                            include: {
                                entreprise: true
                            }
                        },
                    }
                })
                res.status(200).send(u)
        }
        var mailOption = {
            from: ' <safabid95@gmail.com>',
            to: user.email,
            subject: 'Desactivation du compte',
            html: `  
                    <h2>Bienvenue,${user.nom}!</h2>
                    <h4>Cher(e) ${user.nom},
                   <p> Nous espérons que vous vous portez bien. Nous tenons à vous informer que votre compte sur Donnons Espoir a été désactivé.
                   <p><strong>Raison :${"  "}</strong> ${raison}</p>
                  <p> Si vous estimez que cette désactivation est une erreur ou si vous avez des questions concernant cette décision, n'hésitez pas à nous contacter à donnonsEspoir2024@gmail.com. Nous serons heureux de vous fournir toute clarification nécessaire et d'examiner votre situation.</p>                   
                   Nous vous remercions de votre compréhension et de votre coopération.   
                   <p>Cordialement,</p>
                    <p>----------</p>
                    <p>DonnonsEspoir</p>
                `
        }
        transporter.sendMail(mailOption, function (error, info) {
            if (error) {
                console.log(error)
            }
            else {
                console.log('la validation du compte a été envoyé a votre compte')
            }
        })
        console.log(raison)
        } catch (err) {
        return res.status(404).send({ success: false, message: err.message })
        }
        })
module.exports = router;