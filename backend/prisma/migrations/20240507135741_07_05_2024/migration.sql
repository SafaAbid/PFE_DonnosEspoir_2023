/*
  Warnings:

  - A unique constraint covering the columns `[identifiant]` on the table `Entreprise` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `entreprise` ADD COLUMN `identifiant` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Entreprise_identifiant_key` ON `Entreprise`(`identifiant`);
