describe('template spec', () => {
    beforeEach(() => {
        // Runs before each test in the block
        cy.visit(`${Cypress.env('REACT_CYPRESS_TEST_URL')}/forgotpassword`); // Adjust if your local development URL is different
    });

    it('Check forgot password page elements are visible', () => {
        cy.url().should('include', '/forgotpassword');
        cy.contains('h4', 'Forgot Password').should('be.visible');
        cy.get('input[name="forgotPassEmail"]').should('be.visible');
        cy.contains('button', 'Request Password Change').should('be.visible');
    });

    it('Test change pass', () => {
        cy.get('[name="forgotPassEmail"]').type("anthonyjoshua.sparkle@gmail.com");
        cy.contains('Request Password Change').click();
        cy.contains('Password Request processing...').should('be.visible');
        cy.contains('Password change request sent! Redirecting to login...').should('be.visible');
        cy.url().should('include', '/login');
    })

    // it('', () => {
    //
    // })
})