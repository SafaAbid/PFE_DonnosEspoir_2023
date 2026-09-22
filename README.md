# 🤝 Donnons Espoir

**Plateforme web de dons pour associations caritatives**

Projet réalisé dans le cadre d'un stage de fin d'études (PFE) chez **AZIIN**, Sfax.

---

## 📖 À propos du projet

**Donnons Espoir** est une plateforme web dédiée à la gestion des dons et à la mise en relation des différents acteurs impliqués dans les actions solidaires : associations caritatives, donateurs, entreprises écoresponsables et administrateurs.

L'objectif principal est de simplifier la publication des besoins des associations, de faciliter les dons des particuliers et des entreprises, et de permettre un suivi transparent des opérations réalisées sur la plateforme.

Ce projet a été l'occasion de mettre en pratique des compétences en développement web full-stack, conception d'API REST, gestion de bases de données relationnelles et développement d'interfaces utilisateur interactives.

---

## ✨ Fonctionnalités principales

- 👤 **Gestion multi-rôles** : Visiteur, Donateur, Association, Entreprise écoresponsable, Administrateur
- 📢 Publication et consultation des besoins des associations
- 💝 Gestion et suivi des dons
- 🔐 Authentification et gestion des accès selon le rôle
- 📊 Tableau de bord pour le suivi des opérations
- 🔄 Communication en temps réel entre les différents acteurs de la plateforme

---

## 🛠️ Stack technique

| Côté | Technologies |
|------|-------------|
| **Frontend** | React.js, Vite |
| **Backend** | Node.js, Express.js |
| **Base de données** | MySQL |
| **ORM** | Prisma |

---

## 📁 Structure du projet

Le projet est organisé en deux dossiers principaux :

```
donnons-espoir/
├── backend/
│   ├── prisma/          # Schéma et migrations de la base de données
│   ├── routes/          # Routes de l'API REST
│   ├── .env             # Variables d'environnement (non versionné)
│   ├── app.js           # Point d'entrée du serveur Express
│   └── package.json
│
└── frontend/
    ├── public/          # Fichiers statiques
    ├── src/             # Composants et logique de l'application React
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Installation et démarrage

### Prérequis

- [Node.js](https://nodejs.org/) (v16 ou supérieur)
- [MySQL](https://www.mysql.com/)
- npm ou yarn

### 1. Cloner le projet

```bash
git clone https://github.com/<votre-utilisateur>/donnons-espoir.git
cd donnons-espoir
```

### 2. Configuration du Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` à la racine du dossier `backend` avec les variables suivantes :

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/donnons_espoir"
PORT=5000
JWT_SECRET=your_jwt_secret
```

Appliquer les migrations Prisma :

```bash
npx prisma migrate dev
```

Lancer le serveur :

```bash
npm start
```

### 3. Configuration du Frontend

```bash
cd ../frontend
npm install
npm run dev
```

L'application sera accessible par défaut sur `http://localhost:5173` (frontend) et l'API sur `http://localhost:5000` (backend).

---

## 👥 Rôles utilisateurs

| Rôle | Description |
|------|-------------|
| **Visiteur** | Consultation des informations publiques de la plateforme |
| **Donateur** | Consultation des besoins et réalisation de dons |
| **Association** | Publication des besoins et suivi des dons reçus |
| **Entreprise écoresponsable** | Participation aux actions solidaires |
| **Administrateur** | Supervision et gestion globale de la plateforme |

---

## 🎓 Contexte académique

Ce projet a été développé dans le cadre d'un stage de fin d'études (PFE), effectué au sein de l'entreprise **AZIIN** (Sfax, Tunisie).

---

## 📄 Licence

Ce projet est réalisé à des fins académiques dans le cadre d'un stage de fin d'études.

---

## 📬 Contact

N'hésitez pas à me contacter pour toute question concernant ce projet.
