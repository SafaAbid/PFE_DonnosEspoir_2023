/*
  Warnings:

  - You are about to drop the column `nbLike` on the `activite` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `utilisateur` table. All the data in the column will be lost.
  - You are about to drop the column `ville` on the `utilisateur` table. All the data in the column will be lost.
  - You are about to drop the `blocage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `blocage` DROP FOREIGN KEY `Blocage_idAssociation_fkey`;

-- DropForeignKey
ALTER TABLE `blocage` DROP FOREIGN KEY `Blocage_idDonateur_fkey`;

-- AlterTable
ALTER TABLE `activite` DROP COLUMN `nbLike`,
    MODIFY `description` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `association` ADD COLUMN `score` INTEGER NOT NULL DEFAULT 100,
    ADD COLUMN `ville` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `besoin` MODIFY `description` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `categorie` MODIFY `description` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `donateur` ADD COLUMN `score` INTEGER NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE `notification` MODIFY `description` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `objet` MODIFY `description` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `souscategorie` MODIFY `description` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `utilisateur` DROP COLUMN `score`,
    DROP COLUMN `ville`;

-- DropTable
DROP TABLE `blocage`;
