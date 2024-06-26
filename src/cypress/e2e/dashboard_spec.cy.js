describe('dashboard unit tests', () => {

    beforeEach(() => {
        const isStaging = Cypress.env('IsStaging');
        cy.visit(`${Cypress.env(isStaging ? 'REACT_CYPRESS_STAGING_TEST_URL' : 'REACT_CYPRESS_LOCAL_TEST_URL')}/login`); // Adjust if your local development URL is different
        cy.get('input[name="email"]').type('test891554@yopmail.com');
        cy.get('input[name="password"]').type('Tonyspark@71');
        cy.contains('button', 'Login').click();
    })

    it('check if dashboard page elements are mounted', () => {
        const isStaging = Cypress.env('IsStaging');
        if(isStaging){
            cy.pause();
        }
        cy.url().should('include', '/dashboard/app');
        cy.contains('h4', 'Hi test, welcome back').should('be.visible');
        cy.contains('Wallet Balance: ').should('be.visible');
    });

    it('Test Proceed to setting redirection', () => {
        const isStaging = Cypress.env('IsStaging');
        if(isStaging){
            cy.pause();
        }
        cy.url().should('include', '/dashboard/app');
        cy.contains('a','Proceed to Settings').click();
        cy.url().should('include', '/dashboard/settings/profile')
    })

    it('Test wallet redirection', () => {
        const isStaging = Cypress.env('IsStaging');
        if(isStaging){
            cy.pause();
        }
        cy.url().should('include', '/dashboard/app');
        cy.get('[name="navMenu"]').click();
        cy.contains('a div', 'Wallets & Payouts').click();
        cy.url().should('include', '/dashboard/wallet');
        cy.contains('h4', 'Wallet and Payout').should('be.visible');
    })

    it('Test store redirection', () => {
        const isStaging = Cypress.env('IsStaging');
        if(isStaging){
            cy.pause();
        }
        cy.url().should('include', '/dashboard/app');
        cy.get('[name="navMenu"]').click();
        cy.contains('a div', 'Store').click();
        cy.contains('a div', 'Storefront').click();
        cy.url().should('include', '/dashboard/store/storefront');
        cy.contains('h4', 'Store Details').should('be.visible');
    })

    it('Test upload redirection', () => {
        const isStaging = Cypress.env('IsStaging');
        if(isStaging){
            cy.pause();
        }
        cy.url().should('include', '/dashboard/app');
        cy.get('[name="navMenu"]').click();
        cy.contains('a div', 'upload document').click();
        cy.url().should('include', '/dashboard/kyc');
    })

})