-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "uname" VARCHAR(255) NOT NULL,
    "pass" CHAR(60) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uname_key" ON "User"("uname");
