/* eslint-disable no-undef */
/// <reference types="Cypress" />

import {faker} from '@faker-js/faker';

describe('E2E tests suit', () => {
    it("insert new recomendation", () => {
    const data = {
        name: faker.music.songName(),
        link: 'https://www.youtube.com/watch?v=nNhMjV76OQo'
    }
    cy.intercept("GET", "/recommendations").as("getRecommendations");
    cy.visit('http://localhost:3000');
    cy.get('#name').type(data.name);
    cy.get('#url').type(data.link);
    cy.get('#enter').click();
    cy.get('#name').should('have.value', '');
    cy.get('#url').should('have.value', '');
    
})

it('upvote and downvote', () => {
    
    cy.get('#up').click();
    cy.wait(1000);
    cy.get('#down').click();
})

it('delete recommendation', () => {
    for(let i = 0; i < 6; i++) {
        cy.get('#down').click();
        cy.wait(500);
    }
})

it('visit other pages',()=>{
    cy.get("#top").click();
    cy.url().should("equal", "http://localhost:3000/top");
    cy.wait(1000);
    cy.get("#random").click();
    cy.url().should("equal", "http://localhost:3000/random")
})
})
