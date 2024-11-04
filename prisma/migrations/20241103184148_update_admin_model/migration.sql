-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "profilePhoto" DROP NOT NULL,
ALTER COLUMN "isDeleted" SET DEFAULT false;
