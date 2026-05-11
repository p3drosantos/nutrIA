-- CreateTable
CREATE TABLE "DietPlan" (
    "id" SERIAL NOT NULL,
    "goal" TEXT NOT NULL,
    "dietPlan" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DietPlan_pkey" PRIMARY KEY ("id")
);
