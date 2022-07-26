import { faker } from "@faker-js/faker";

import { prisma } from "./../../src/database.js";

export default async function createRecomendation() {
    const test = await prisma.recommendation.create({
        data:{
            name: faker.music.songName(),
            youtubeLink: "https://www.youtube.com/watch?v=Ct6BUPvE2sM",
            score: +faker.random.numeric(2),
        }
    });
    return test;
}