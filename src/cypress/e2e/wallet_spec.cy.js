describe('wallet unit tests', () => {
    beforeEach(() => {
        cy.visit(`${Cypress.env('REACT_CYPRESS_TEST_URL')}/login`); // Adjust if your local development URL is different
        cy.get('input[name="email"]').type('test21451523@yopmail.com');
        cy.get('input[name="password"]').type('Tonyspark@71');
        cy.contains('button', 'Login').click().wait(3000);
        cy.get('[name="navMenu"]').click();
        cy.contains('a div', 'Wallets & Payouts').click();
    })

    it('Check wallet elements visible', () => {
        cy.url().should('include', '/dashboard/wallet');
        cy.contains('h4', 'Wallet and Payout').should('be.visible');
    })
})