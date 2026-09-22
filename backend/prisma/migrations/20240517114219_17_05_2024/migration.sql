/*
  Warnings:

  - You are about to drop the column `score` on the `association` table. All the data in the column will be lost.
  - You are about to drop the column `nbObjets` on the `donateur` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `donateur` table. All the data in the column will be lost.
  - You are about to drop the column `etatArchive` on the `donation` table. All the data in the column will be lost.
  - You are about to drop the column `etatArchive` on the `reparation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[numTelephone]` on the table `Association` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numTelephone]` on the table `Donateur` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idDemandeObjet]` on the table `Donation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `association` DROP COLUMN `score`;

-- AlterTable
ALTER TABLE `donateur` DROP COLUMN `nbObjets`,
    DROP COLUMN `score`;

-- AlterTable
ALTER TABLE `donation` DROP COLUMN `etatArchive`;

-- AlterTable
ALTER TABLE `reparation` DROP COLUMN `etatArchive`;

-- CreateIndex
CREATE UNIQUE INDEX `Association_numTelephone_key` ON `Association`(`numTelephone`);

-- CreateIndex
CREATE UNIQUE INDEX `Donateur_numTelephone_key` ON `Donateur`(`numTelephone`);

-- CreateIndex
CREATE UNIQUE INDEX `Donation_idDemandeObjet_key` ON `Donation`(`idDemandeObjet`);
