describe('retailers unit tests', () => {
    beforeEach(() => {
        const isStaging = Cypress.env('IsStaging');
        cy.visit(`${Cypress.env(isStaging ? 'REACT_CYPRESS_STAGING_TEST_URL' : 'REACT_CYPRESS_LOCAL_TEST_URL')}/login`); // Adjust if your local development URL is different
        cy.get('input[name="email"]').type('test891554@yopmail.com');
        cy.get('input[name="password"]').type('Tonyspark@71');
        cy.contains('button', 'Login').click();
        if(isStaging){
            cy.pause();
        }
    })

    it('Check if retailers page elements are visible', () => {
        cy.get('[name="navMenu"]').click();
        cy.contains('a div', 'Store').click();
        cy.contains('a div', 'Manage Retailers').click();
        cy.contains('h5', 'My Retailers').should('be.visible');
    })
})