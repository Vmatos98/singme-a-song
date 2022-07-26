import { prisma } from "./../../src/database.js";


export async function clearDB() {
    await prisma.$transaction([
        prisma.$executeRaw`TRUNCATE TABLE recommendations`,
        
    ]);
}