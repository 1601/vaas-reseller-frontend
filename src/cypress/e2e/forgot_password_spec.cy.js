describe('forgot password unit tests', () => {
    beforeEach(() => {
        // Runs before each test in the block
        const isStaging = Cypress.env('IsStaging');
        cy.visit(`${Cypress.env(isStaging ? 'REACT_CYPRESS_STAGING_TEST_URL' : 'REACT_CYPRESS_LOCAL_TEST_URL')}/forgotpassword`); // Adjust if your local development URL is different
    });

    it('Check forgot password page elements are visible', () => {
        cy.url().should('include', '/forgotpassword');
        cy.contains('h4', 'Forgot Password').should('be.visible');
        cy.get('input[name="forgotPassEmail"]').should('be.visible');
        cy.contains('button', 'Request Password Change').should('be.visible');
    });

    // todo make the test pass
    it('Test forget pass validation', () => {
        cy.get('[name="forgotPassEmail"]').type("<>>");
        cy.contains('Request Password Change').click();
        cy.contains('Email is either unregistered or not activated').should('be.visible');
        cy.get('[name="forgotPassEmail"]').clear();
        cy.contains('Request Password Change').click();
        cy.contains('Please fill up the required field.').should('be.visible');
    });

    it('Test change pass', () => {
        cy.get('[name="forgotPassEmail"]').type("anthonyjoshua.sparkle@gmail.com");
        cy.contains('Request Password Change').click();
        cy.contains('Password Request processing...').should('be.visible');
        cy.contains('Password change request sent! Redirecting to login...').should('be.visible');
        cy.url().should('include', '/login');
    });
})