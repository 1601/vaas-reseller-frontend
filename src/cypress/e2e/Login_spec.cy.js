describe('Login Page Tests', () => {
    beforeEach(() => {
        // Runs before each test in the block
        cy.visit(`${Cypress.env('REACT_CYPRESS_TEST_URL')}/login`); // Adjust if your local development URL is different
    });

    it('Check login page elements are visible', () => {
        cy.url().should('include', '/login');
        cy.contains('h6', 'Login').should('be.visible');
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.contains('button', 'Login').should('be.visible');
    });

    it('Check login functionality', () => {
        cy.get('input[name="email"]').type('test21451523@yopmail.com');
        cy.get('input[name="password"]').type('Tonyspark@71');
        cy.contains('button', 'Login').click();
        cy.url().should('include', '/dashboard/app');
        cy.contains('h4', 'Hi testery, welcome back').should('be.visible');
    })

    it('Check for forget password redirection', () => {
        cy.contains('a', 'Forgot password?').click();
        cy.url().should('include', '/forgotpassword');
        cy.contains('h4', 'Forgot Password').should('be.visible');
        cy.contains('label', 'Email').should('be.visible');
        cy.contains('button', 'Request Password Change').should('be.visible');
    })

    it('Check sign up redirection', () => {
        cy.contains('a', 'Sign Up').click();
        cy.url().should('include', '/signup');
        cy.get('input[name="firstName"]').should('exist');
        cy.get('input[name="middleName"]').should('exist');
        cy.get('input[name="lastName"]').should('exist');
        cy.get('input[name="mobileNumber"]').should('exist');
        cy.get('input[name="username"]').should('exist');
        cy.get('input[name="password"]').should('exist');
        cy.get('input[name="confirmPassword"]').should('exist');
        cy.contains('h6', 'Sign Up').should('exist');
    })

    it('Check help redirection', () => {
        cy.contains('button', 'Help').click();
        cy.url().should('include', '/help');
    })

    it('Check Data Privacy Policy redirection', () => {
        cy.contains('button', 'Privacy').click();
        cy.url().should('include', '/data-privacy-policy');
        cy.contains('h1','Data Privacy Policy').should('be.visible');
    })

    it('Check Terms and Conditions redirection', () => {
        cy.contains('button', 'Terms of Service').click();
        cy.url().should('include', '/terms-and-conditions');
        cy.contains('h1','Terms and Conditions').should('be.visible');
    })

});
