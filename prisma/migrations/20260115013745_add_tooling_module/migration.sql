-- CreateTable
CREATE TABLE "Tooling" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Tooling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolingActivity" (
    "id" SERIAL NOT NULL,
    "component" TEXT NOT NULL,
    "procedure" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ToolingActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolingOrder" (
    "id" SERIAL NOT NULL,
    "folio" SERIAL NOT NULL,
    "toolingId" INTEGER NOT NULL,
    "technicianId" TEXT,
    "validatorId" TEXT,
    "date_create" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_finish" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ASIGNADA',
    "piezasProducidas" INTEGER,

    CONSTRAINT "ToolingOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolingCheck" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "component" TEXT NOT NULL,
    "procedure" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "comments" TEXT,
    "img" TEXT,

    CONSTRAINT "ToolingCheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tooling_code_key" ON "Tooling"("code");

-- AddForeignKey
ALTER TABLE "ToolingOrder" ADD CONSTRAINT "ToolingOrder_toolingId_fkey" FOREIGN KEY ("toolingId") REFERENCES "Tooling"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolingOrder" ADD CONSTRAINT "ToolingOrder_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("iduser") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolingOrder" ADD CONSTRAINT "ToolingOrder_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "User"("iduser") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolingCheck" ADD CONSTRAINT "ToolingCheck_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ToolingOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
