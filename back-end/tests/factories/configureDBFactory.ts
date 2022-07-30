import { prisma } from "./../../src/database.js";
import { faker } from "@faker-js/faker";
import * as factories from "./recommendationsFactory.js";

export async function clearDB() {
    await prisma.$transaction([
        prisma.$executeRaw`TRUNCATE TABLE recommendations`,
        
    ]);
}

export async function createManyRecommendations(amount:number) {
    for (let i = 0; i < amount; i++) {
        const name = faker.music.songName();
        const url = "https://www.youtube.com/watch?v=Ct6BUPvE2sM";
        await factories.createRecomendation(name, url);
    }
}

export async function createManyRandomRecommendations(amount:number) {
    for (let i = 0; i < amount; i++) {
        await factories.createRecomendationRandomScore();
    }
}