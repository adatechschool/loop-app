/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login with username and password
     * @example cy.login('admin', 'password123')
     */
    login(username: string, password: string): Chainable<void>
    
    /**
     * Custom command to login as valid user from fixtures
     * @example cy.loginAsValidUser()
     */
    loginAsValidUser(): Chainable<void>
    
    /**
     * Custom command to create a place via API
     * @example cy.createPlaceViaAPI(placeData)
     */
    createPlaceViaAPI(placeData: any): Chainable<any>
    
    /**
     * Custom command to delete a place via API
     * @example cy.deletePlaceViaAPI('place-id')
     */
    deletePlaceViaAPI(placeId: string): Chainable<void>
    
    /**
     * Custom command to get all places via API
     * @example cy.getPlacesViaAPI()
     */
    getPlacesViaAPI(): Chainable<any>
    
    /**
     * Custom command to fill place form
     * @example cy.fillPlaceForm(placeData)
     */
    fillPlaceForm(placeData: any): Chainable<void>
    
    /**
     * Custom command to verify URL contains specific part
     * @example cy.verifyUrlContains('/places')
     */
    verifyUrlContains(urlPart: string): Chainable<void>
  }
}