import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";

describe('tests insert suit',()=>{
    const data = {
        name: faker.music.songName(),
        youtubeLink: faker.internet.url(),
    }

    it('insert',()=>{
        jest.spyOn(recommendationRepository,'findByName').mockImplementationOnce(():any=>false);
        jest.spyOn(recommendationRepository,'create').mockImplementationOnce((val):any=>expect(val).toEqual(data));
        recommendationService.insert(data);
    })

    it('insert duplicate data',async()=>{
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(():any => true);
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce((val):any => val);
        const response = await recommendationService.insert(data);
        expect(response).rejects.toEqual({ type: "conflict", message: "Recommendations names must be unique"});
    })
})

describe('tests vote suit', () => {
    const id = 1;
    it('upvote',()=>{
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((num):any => num === id? true : false);
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((num, opt):any => {
            expect(num).toEqual(id);
            expect(opt).toEqual("increment");
        });
        recommendationService.upvote(id);
    })
})