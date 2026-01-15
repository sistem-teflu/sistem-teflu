-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'OPERADOR', 'PLANEADOR', 'TECNICO', 'INGENIERIA', 'RH', 'VIEWERS');

-- CreateTable
CREATE TABLE "User" (
    "iduser" TEXT NOT NULL,
    "nomina" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT,
    "numero" TEXT,
    "puesto" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'OPERADOR',
    "date_create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "date_delete" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("iduser")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nomina_key" ON "User"("nomina");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
