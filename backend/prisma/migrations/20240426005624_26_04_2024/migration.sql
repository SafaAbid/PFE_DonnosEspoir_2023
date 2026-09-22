/*
  Warnings:

  - You are about to drop the column `idDemandeReparation` on the `reparation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[numTelephone]` on the table `Benevole` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `demandeReparationId` to the `Reparation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `reparation` DROP FOREIGN KEY `Reparation_idDemandeReparation_fkey`;

-- AlterTable
ALTER TABLE `reparation` DROP COLUMN `idDemandeReparation`,
    ADD COLUMN `demandeReparationId` INTEGER UNSIGNED NOT NULL,
    MODIFY `etat` ENUM('enCours', 'repare', 'nonValide') NULL DEFAULT 'enCours';

-- CreateIndex
CREATE UNIQUE INDEX `Benevole_numTelephone_key` ON `Benevole`(`numTelephone`);

-- AddForeignKey
ALTER TABLE `Reparation` ADD CONSTRAINT `Reparation_demandeReparationId_fkey` FOREIGN KEY (`demandeReparationId`) REFERENCES `DemandeReparation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
