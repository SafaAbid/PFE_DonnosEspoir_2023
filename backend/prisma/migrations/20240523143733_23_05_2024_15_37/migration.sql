/*
  Warnings:

  - You are about to drop the column `description` on the `demandeobjet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `demandeobjet` DROP COLUMN `description`;

-- AlterTable
ALTER TABLE `demandereparation` ADD COLUMN `description` VARCHAR(191) NULL;
