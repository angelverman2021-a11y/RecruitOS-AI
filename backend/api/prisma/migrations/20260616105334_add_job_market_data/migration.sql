-- CreateTable
CREATE TABLE "JobMarketData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "jobPostings" INTEGER NOT NULL,
    "avgSalaryUSD" INTEGER NOT NULL,
    "topCompanies" TEXT NOT NULL,
    "topSkills" TEXT NOT NULL,
    "demandIndex" REAL NOT NULL,
    "location" TEXT NOT NULL DEFAULT 'Global'
);
