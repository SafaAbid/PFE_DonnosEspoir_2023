/*
  Warnings:

  - You are about to drop the column `cin` on the `benevole` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Benevole` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Benevole_cin_key` ON `benevole`;

-- AlterTable
ALTER TABLE `benevole` DROP COLUMN `cin`,
    ADD COLUMN `email` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Benevole_email_key` ON `Benevole`(`email`);
