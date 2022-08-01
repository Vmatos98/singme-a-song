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

    it('insert duplicate data',()=>{
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(():any => true);
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce((val):any => val);
        const response = recommendationService.insert(data);
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

    it('downvote', async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((num):any => num === id? true : false);
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((num, opt):any => {
            expect(num).toEqual(id);
            expect(opt).toEqual("decrement");
            return {score: 1};
        });
        await recommendationService.downvote(id);
    }); 

    it('remove', async () => {
        jest.spyOn(recommendationRepository,"find").mockImplementationOnce((num):any => num === id? true : false);
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((num, opt):any => {
            return {score: -6};
        });
        jest.spyOn(recommendationRepository,"remove").mockImplementationOnce((num):any => {});
        await recommendationService.downvote(id);
        expect(recommendationRepository.remove).toBeCalledTimes(1);
    })    
})

describe('get recomendations tests suit', ()=>{
    const id = 1;

    it('get recomendations',()=>{
        jest.spyOn(recommendationRepository,"findAll").mockImplementationOnce(():any => true);
        const response = recommendationService.get();
        expect(response).toBeTruthy();
    })

    it('get top recomendations',()=>{
        jest.spyOn(recommendationRepository,"getAmountByScore").mockImplementationOnce((num):any => expect(num).toEqual(3) );
        recommendationService.getTop(3);
    } )

    it('get recomendations by id', () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((num):any => num === id?  true : false);
        const promise = recommendationService.getById(1);
        promise.then(res => expect(res).toEqual(true));
    });

    it('not found get by id', () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((num):any => false);
        const promise = recommendationService.getById(id);
        expect(promise).rejects.toEqual({ type: "not_found", message: ""});
    })

    it('get random recomendation from gt mode', async () => {
        Math.random.bind(global.Math);
        global.Math.random = () => 0.6;
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(({score, scoreFilter}):any => {
            expect(score).toEqual(10);
            expect(scoreFilter).toEqual("gt");
            return true;
        });
        const response= recommendationService.getRandom();
        expect(response).toBeTruthy();
    })

    it('get random recomendation from lte mode', async () => {
        Math.random.bind(global.Math);
        global.Math.random = () => 0.8;
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(({score, scoreFilter}):any => {
            expect(score).toEqual(10);
            expect(scoreFilter).toEqual("lte");
            return true;
        });
        const response= recommendationService.getRandom();
        expect(response).toBeTruthy();
    })
})