import supertest from "supertest";
import { faker } from "@faker-js/faker";

import app from "../src/app.js";
import {clearDB} from "./factories/configureDBFactory.js"

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
})

