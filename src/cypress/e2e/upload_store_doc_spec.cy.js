describe('upload store documents spec', () => {
    beforeEach(() => {
        const isStaging = Cypress.env('IsStaging');
        cy.visit(`${Cypress.env(isStaging ? 'REACT_CYPRESS_STAGING_TEST_URL' : 'REACT_CYPRESS_LOCAL_TEST_URL')}/login`); // Adjust if your local development URL is different
        cy.get('input[name="email"]').type('test21451523@yopmail.com');
        cy.get('input[name="password"]').type('Tonyspark@71');
        cy.contains('button', 'Login').click();
    })

    it('Test store document upload element visibility', () => {
        cy.url().should('include', '/dashboard/app');
        cy.get('[name="navMenu"]').click();
        cy.contains('a div', 'Store').click();
        cy.contains('a div', 'Storefront').click();
        cy.url().should('include', '/dashboard/store/storefront');
        cy.contains('h4', 'Store Details').should('be.visible');
    })

    // todo add more unit test for store upload
})