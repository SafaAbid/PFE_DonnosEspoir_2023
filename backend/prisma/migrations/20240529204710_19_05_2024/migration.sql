/*
  Warnings:

  - You are about to drop the column `description` on the `categorie` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `souscategorie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `categorie` DROP COLUMN `description`;

-- AlterTable
ALTER TABLE `souscategorie` DROP COLUMN `description`;
