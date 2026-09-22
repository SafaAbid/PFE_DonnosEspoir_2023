/*
  Warnings:

  - You are about to drop the column `adresse` on the `benevole` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `benevole` DROP COLUMN `adresse`,
    ADD COLUMN `etatArchive` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `numTelephone` VARCHAR(191) NULL;
