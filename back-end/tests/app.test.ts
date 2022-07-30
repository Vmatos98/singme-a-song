import supertest from "supertest";
import { faker } from "@faker-js/faker";

import app from "../src/app.js";
import {clearDB, createManyRecommendations, createManyRandomRecommendations} from "./factories/configureDBFactory.js"
import * as factories from "./factories/recommendationsFactory.js";
import exp from "constants";

const agent = supertest(app);

beforeEach(async() =>{
    await clearDB();
})

describe("recomendation tests suit", ()=>{
    it("add recomendation", async() =>{

        const data = {
            name: faker.music.songName(),
            youtubeLink: "https://www.youtube.com/watch?v=Ct6BUPvE2sM",
        }

        const response = await agent.post('/recommendations').send(data);

        expect(response.statusCode).toBe(201);
    })

    it("add recomendation unnamed", async() =>{

        const data = {
            name: '',
            youtubeLink: "https://www.youtube.com/watch?v=Ct6BUPvE2sM",
        }

        const response = await agent.post('/recommendations').send(data);

        expect(response.statusCode).toBe(422);
    })

    it("add recomendation without URL", async() =>{

        const data = {
            name: faker.music.songName(),
            youtubeLink: "",
        }

        const response = await agent.post('/recommendations').send(data);

        expect(response.statusCode).toBe(422);
    })

    it("add recomendation without youtube url", async() =>{

        const data = {
            name: faker.music.songName(),
            youtubeLink: faker.internet.url(),
        }

        const response = await agent.post('/recommendations').send(data);

        expect(response.statusCode).toBe(422);
    })

    it("add recomendation repeated", async() =>{

        const name = faker.music.songName()
        await factories.createRecomendationWithDefinedName(name);
        const data = {
            name: name,
            youtubeLink: "https://www.youtube.com/watch?v=Ct6BUPvE2sM",
        }

        // const response = await agent.post('/recommendations').send(data);
        const response = await agent.post('/recommendations').send(data);
        // expect(response.statusCode).toBe(201);
        expect(response.statusCode).toBe(409);
    })

    // it("add recomendation with URL repeated, but different name", async() =>{

    //     const name = faker.music.songName();
    //     const url = "https://www.youtube.com/watch?v=Ct6BUPvE2sM";
    //     await factories.createRecomendation(name, url);
    //     const data = {
    //         name: faker.music.songName(),
    //         youtubeLink: url,
    //     }

    //     const response = await agent.post('/recommendations').send(data);
    //     expect(response.statusCode).toBe(409);
    // })

    it("upvote recomendation", async() =>{
        const name = faker.music.songName();
        const url = "https://www.youtube.com/watch?v=Ct6BUPvE2sM";
        await factories.createRecomendation(name, url);
        const response1 = await agent.get(`/recommendations`);
        const elementId = response1.body[0].id;
        await agent.post(`/recommendations/${elementId}/upvote`);
        const response2 = await agent.get(`/recommendations`);
        expect(response2.body[0].score).toBe(1);
    })

    it("downvote recomendation", async() =>{
        await factories.createRecomendationWithDefinedScore(1);
        const response1 = await agent.get(`/recommendations`);
        const elementId = response1.body[0].id;
        await agent.post(`/recommendations/${elementId}/downvote`);
        const response2 = await agent.get(`/recommendations`);
        expect(response2.body[0].score).toBe(0);
    })
    
    it("delete recomendation by downvote", async() =>{
        await factories.createRecomendationWithDefinedScore(-5);
        const response1 = await agent.get(`/recommendations`);
        const elementId = response1.body[0].id;
        await agent.post(`/recommendations/${elementId}/downvote`);
        const response2 = await agent.get(`/recommendations`);
        expect(response2.body).toStrictEqual([]);
    })

    it("get recomendation without date in DB", async() =>{
        const response = await agent.get(`/recommendations`);
        expect(response.body).toEqual([]);
    })

    it("get recomendations", async() =>{
        await createManyRecommendations(11);
        const response = await agent.get(`/recommendations`);
        expect(response.body.length).toBe(10);
    })

    it("get recomendation by id", async()=>{
        const name = faker.music.songName();
        await factories.createRecomendationWithDefinedName(name);
        const response1 = await agent.get(`/recommendations`);
        const elementId = +response1.body[0].id;
        const response = await agent.get(`/recommendations/${elementId}`);
        expect(+response.body.id).toBe(elementId);
        expect(response.body.name).toBe(name);
    })

    it("get amount recommendations", async()=>{
        const amount = 5;
        await createManyRandomRecommendations(amount);
        const response = await agent.get(`/recommendations/top/${amount}`);
        expect(response.body.length).toBe(5);
        expect(+response.body[0].score).toBeGreaterThan(+response.body[4].score);
    })

    it("get random recommendations without date in DB", async()=>{
        const response = await agent.get(`/recommendations/random`);
        expect(response.statusCode).toBe(404);

    })

    it("get random recommendations ", async()=>{
        await createManyRandomRecommendations(10);
        const response = await agent.get(`/recommendations/random`);
        expect(response.body).not.toBe([]);

    })
})

