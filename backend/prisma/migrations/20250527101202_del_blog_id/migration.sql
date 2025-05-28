/*
  Warnings:

  - You are about to drop the column `authoId` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `blog_id` on the `Blog` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_authoId_fkey";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "authoId",
DROP COLUMN "blog_id",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ALTER COLUMN "published" SET DEFAULT false;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
