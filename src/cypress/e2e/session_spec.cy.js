import SecureLS from 'secure-ls';

const ls = new SecureLS({ encodingType: 'aes' });


describe('Session unit tests', () => {
    beforeEach(() => {
        const isTestEnv = Cypress.env('IS_TEST_ENV');
        const isStaging = Cypress.env('IsStaging');

        // Start the clock at a fixed point in time
        cy.clock(Date.now());

        cy.visit(`${Cypress.env(isStaging ? 'REACT_CYPRESS_STAGING_TEST_URL' : 'REACT_CYPRESS_LOCAL_TEST_URL')}/login`); // Adjust if your local development URL is different
        if (isTestEnv) {
            cy.get('input[name="email"]').type('test89155498@yopmail.com');
        }else{
            cy.pause();
        }
        cy.get('input[name="password"]').type('Tonyspark@71');
        cy.contains('button', 'Login').click();
        if(isStaging){
            cy.pause();
        }else{
            cy.wait(4000);
        }
        cy.intercept('POST', '**/verify-token', {
            statusCode: 200,
            body: {
                isValid: false
            }
        }).as('refreshSession');
    })

    it('Check if verify session dialogue elements are visible', () => {
        cy.tick(600000); // 15 minutes in milliseconds
        cy.contains('Verify User Session').should('exist');
        cy.get('input[name="sessionEmail"]').should('be.visible')
        cy.get('input[name="sessionPass"]').should('be.visible')
    })

    it('Test renew session', () => {
        cy.tick(600000); // 15 minutes in milliseconds
        cy.get('input[name="sessionEmail"][id=":ra:"]').type('test891554945@yopmail.com');
        cy.get('input[name="sessionPass"][id=":rb:"]').type('Tonyspark@71');
        cy.get(':nth-child(6) > .MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButton-textPrimary').click();
        cy.contains('Verifying login credentials...').should('be.visible');
        cy.wait(2000);
        cy.contains('Hi test, welcome back').should('be.visible');
    })

    it('Test logout', () => {
        cy.tick(600000); // 15 minutes in milliseconds
        cy.wait(2000);
        cy.get(':nth-child(6) > .MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButton-textError').click();
        cy.contains('Logging out...').should('be.visible').wait(10000);
    })
})