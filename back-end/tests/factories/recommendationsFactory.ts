import { faker } from "@faker-js/faker";

import { prisma } from "./../../src/database.js";

export async function createRecomendationRandomScore() {
    const test = await prisma.recommendation.create({
        data:{
            name: faker.music.songName(),
            youtubeLink: "https://www.youtube.com/watch?v=Ct6BUPvE2sM",
            score: +faker.random.numeric(2),
        }
    });
    return test;
}

export async function createRecomendationWithDefinedScore(score:number) {
    const test = await prisma.recommendation.create({
        data:{
            name: faker.music.songName(),
            youtubeLink: "https://www.youtube.com/watch?v=Ct6BUPvE2sM",
            score: score,
        }
    });
    return test;
}

export async function createRecomendationWithDefinedName(name:string) {
    const test = await prisma.recommendation.create({
        data:{
            name: name,
            youtubeLink: "https://www.youtube.com/watch?v=Ct6BUPvE2sM",
        }
    });
    return test;
}

export async function createRecomendation(name:string, url:string){
    const test = await prisma.recommendation.create({
        data:{
            name: name,
            youtubeLink: url,
        }
    });
    return test;
}