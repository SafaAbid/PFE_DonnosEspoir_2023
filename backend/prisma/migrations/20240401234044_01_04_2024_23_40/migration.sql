-- CreateTable
CREATE TABLE `Utilisateur` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(255) NULL,
    `email` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NULL,
    `motDePasse` VARCHAR(255) NOT NULL,
    `score` INTEGER NOT NULL DEFAULT 100,
    `role` ENUM('association', 'donateur', 'entreprise', 'administrateur') NOT NULL,
    `ville` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Utilisateur_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `description` VARCHAR(191) NULL,
    `etat` BOOLEAN NOT NULL DEFAULT false,
    `idUtilisateur` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Administrateur` (
    `userIdAdmin` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Administrateur_userIdAdmin_key`(`userIdAdmin`),
    PRIMARY KEY (`userIdAdmin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Association` (
    `userIdA` INTEGER UNSIGNED NOT NULL,
    `identifiant` VARCHAR(191) NOT NULL,
    `nomResponsable` VARCHAR(191) NULL,
    `numTelephone` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Association_userIdA_key`(`userIdA`),
    UNIQUE INDEX `Association_identifiant_key`(`identifiant`),
    PRIMARY KEY (`userIdA`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Donateur` (
    `userIdD` INTEGER UNSIGNED NOT NULL,
    `nbObjets` INTEGER NOT NULL DEFAULT 0,
    `nbObjetsDonnes` INTEGER NOT NULL DEFAULT 0,
    `numTelephone` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Donateur_userIdD_key`(`userIdD`),
    PRIMARY KEY (`userIdD`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Blocage` (
    `bloqueur` VARCHAR(191) NOT NULL,
    `idAssociation` INTEGER UNSIGNED NOT NULL,
    `idDonateur` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`idAssociation`, `idDonateur`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Entreprise` (
    `donateurId` INTEGER UNSIGNED NOT NULL,
    `nbObjetsRepares` INTEGER NOT NULL DEFAULT 0,
    `nomResponsable` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Entreprise_donateurId_key`(`donateurId`),
    PRIMARY KEY (`donateurId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Activite` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `nbLike` INTEGER NOT NULL DEFAULT 0,
    `idAssociationA` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImageActivite` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NULL,
    `activiteId` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Besoin` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `associationId` INTEGER UNSIGNED NOT NULL,
    `description` VARCHAR(191) NULL,
    `idCategorie` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Objet` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `etatObjet` ENUM('tresBonEtat', 'bonEtat', 'moyenEtat') NULL,
    `etatPublication` ENUM('enCoursDeValidation', 'publie', 'refuse') NOT NULL DEFAULT 'enCoursDeValidation',
    `disponible` BOOLEAN NOT NULL DEFAULT true,
    `idDonateur` INTEGER UNSIGNED NOT NULL,
    `idSousCategorie` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImageObjet` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NULL,
    `objetId` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SousCategorie` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `idCategorie` INTEGER UNSIGNED NOT NULL,
    `etatArchive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categorie` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `etatArchive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DemandeObjet` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `dateDeDemande` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idObjet` INTEGER UNSIGNED NOT NULL,
    `associationId` INTEGER UNSIGNED NOT NULL,
    `etatAcceptation` ENUM('enCours', 'acceptee', 'refusee', 'annulee') NOT NULL DEFAULT 'enCours',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Donation` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `idDemandeObjet` INTEGER UNSIGNED NOT NULL,
    `idRendezVous` INTEGER UNSIGNED NOT NULL,
    `etatArchive` BOOLEAN NOT NULL DEFAULT false,
    `etatReparation` BOOLEAN NOT NULL DEFAULT false,
    `etatValidation` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Donation_idRendezVous_key`(`idRendezVous`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DemandeReparation` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `dateDemande` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `etatAcceptation` BOOLEAN NOT NULL DEFAULT false,
    `idDonation` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `DemandeReparation_idDonation_key`(`idDonation`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reparation` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `etat` ENUM('enCours', 'repare') NULL DEFAULT 'enCours',
    `idDemandeReparation` INTEGER UNSIGNED NOT NULL,
    `debutDeReparationId` INTEGER UNSIGNED NOT NULL,
    `finDeReparationId` INTEGER UNSIGNED NOT NULL,
    `idEntreprise` INTEGER UNSIGNED NOT NULL,
    `etatArchive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Reparation_idDemandeReparation_key`(`idDemandeReparation`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RendezVous` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `idBenevole` INTEGER UNSIGNED NULL,
    `etatRealisation` ENUM('enCours', 'realise', 'nonRealise') NOT NULL DEFAULT 'enCours',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Benevole` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NULL,
    `prenom` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NULL,
    `cin` VARCHAR(191) NULL,
    `idAssociation` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Benevole_cin_key`(`cin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_idUtilisateur_fkey` FOREIGN KEY (`idUtilisateur`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Administrateur` ADD CONSTRAINT `Administrateur_userIdAdmin_fkey` FOREIGN KEY (`userIdAdmin`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Association` ADD CONSTRAINT `Association_userIdA_fkey` FOREIGN KEY (`userIdA`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donateur` ADD CONSTRAINT `Donateur_userIdD_fkey` FOREIGN KEY (`userIdD`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Blocage` ADD CONSTRAINT `Blocage_idDonateur_fkey` FOREIGN KEY (`idDonateur`) REFERENCES `Donateur`(`userIdD`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Blocage` ADD CONSTRAINT `Blocage_idAssociation_fkey` FOREIGN KEY (`idAssociation`) REFERENCES `Association`(`userIdA`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entreprise` ADD CONSTRAINT `Entreprise_donateurId_fkey` FOREIGN KEY (`donateurId`) REFERENCES `Donateur`(`userIdD`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Activite` ADD CONSTRAINT `Activite_idAssociationA_fkey` FOREIGN KEY (`idAssociationA`) REFERENCES `Association`(`userIdA`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageActivite` ADD CONSTRAINT `ImageActivite_activiteId_fkey` FOREIGN KEY (`activiteId`) REFERENCES `Activite`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Besoin` ADD CONSTRAINT `Besoin_associationId_fkey` FOREIGN KEY (`associationId`) REFERENCES `Association`(`userIdA`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Besoin` ADD CONSTRAINT `Besoin_idCategorie_fkey` FOREIGN KEY (`idCategorie`) REFERENCES `Categorie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objet` ADD CONSTRAINT `Objet_idDonateur_fkey` FOREIGN KEY (`idDonateur`) REFERENCES `Donateur`(`userIdD`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objet` ADD CONSTRAINT `Objet_idSousCategorie_fkey` FOREIGN KEY (`idSousCategorie`) REFERENCES `SousCategorie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageObjet` ADD CONSTRAINT `ImageObjet_objetId_fkey` FOREIGN KEY (`objetId`) REFERENCES `Objet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SousCategorie` ADD CONSTRAINT `SousCategorie_idCategorie_fkey` FOREIGN KEY (`idCategorie`) REFERENCES `Categorie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DemandeObjet` ADD CONSTRAINT `DemandeObjet_idObjet_fkey` FOREIGN KEY (`idObjet`) REFERENCES `Objet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DemandeObjet` ADD CONSTRAINT `DemandeObjet_associationId_fkey` FOREIGN KEY (`associationId`) REFERENCES `Association`(`userIdA`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donation` ADD CONSTRAINT `Donation_idDemandeObjet_fkey` FOREIGN KEY (`idDemandeObjet`) REFERENCES `DemandeObjet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donation` ADD CONSTRAINT `Donation_idRendezVous_fkey` FOREIGN KEY (`idRendezVous`) REFERENCES `RendezVous`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DemandeReparation` ADD CONSTRAINT `DemandeReparation_idDonation_fkey` FOREIGN KEY (`idDonation`) REFERENCES `Donation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reparation` ADD CONSTRAINT `Reparation_idDemandeReparation_fkey` FOREIGN KEY (`idDemandeReparation`) REFERENCES `DemandeReparation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reparation` ADD CONSTRAINT `Reparation_debutDeReparationId_fkey` FOREIGN KEY (`debutDeReparationId`) REFERENCES `RendezVous`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reparation` ADD CONSTRAINT `Reparation_finDeReparationId_fkey` FOREIGN KEY (`finDeReparationId`) REFERENCES `RendezVous`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reparation` ADD CONSTRAINT `Reparation_idEntreprise_fkey` FOREIGN KEY (`idEntreprise`) REFERENCES `Entreprise`(`donateurId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RendezVous` ADD CONSTRAINT `RendezVous_idBenevole_fkey` FOREIGN KEY (`idBenevole`) REFERENCES `Benevole`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Benevole` ADD CONSTRAINT `Benevole_idAssociation_fkey` FOREIGN KEY (`idAssociation`) REFERENCES `Association`(`userIdA`) ON DELETE CASCADE ON UPDATE CASCADE;
