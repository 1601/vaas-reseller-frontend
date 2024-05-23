describe('Product unit tests', () => {
    beforeEach(() => {
        const isTestEnv = Cypress.env('IS_TEST_ENV');
        const isStaging = Cypress.env('IsStaging');
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
        }
        cy.get('[name="navMenu"]').click();
        cy.contains('a div', 'Products').click();
        cy.contains('a div', 'Top-up').click();
    })

    it('Check if product page elements are visible', () => {
        cy.contains('.MuiTypography-h4', 'Top-Up Products').should('be.visible');
        cy.contains(':nth-child(1) > .MuiPaper-elevation3 > .MuiTypography-h6', 'SMARTPH').should('be.visible');
        cy.get(':nth-child(1) > .MuiPaper-elevation3 > .MuiStack-root > .MuiBox-root > .MuiButtonBase-root').click();
        cy.contains('.MuiPaper-root > .MuiBox-root > .MuiTypography-root', 'Configure: SMARTPH').should('be.visible');
    })

    it('test change top up category toggle', () => {
        cy.get(':nth-child(1) > .MuiPaper-elevation3 > .MuiStack-root > .MuiFormControlLabel-root > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click().wait(3000);
        cy.get('[name="navMenu"]').click();
        cy.contains('a div', 'Home').click().wait(4000);
        cy.get('[name="navMenu"]').click().wait(1000);
        cy.contains('a div', 'Top-up').click();
        cy.get(':nth-child(1) > .MuiPaper-elevation3 > .MuiStack-root > .MuiFormControlLabel-root > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').should('not.be.checked');
        cy.get(':nth-child(1) > .MuiPaper-elevation3 > .MuiStack-root > .MuiFormControlLabel-root > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click().wait(2000);
    })

    it('test change top up category product toggle', () => {
        cy.get(':nth-child(1) > .MuiPaper-elevation3 > .MuiStack-root > .MuiBox-root > .MuiButtonBase-root').click();
        cy.get(':nth-child(1) > .MuiTableCell-alignCenter > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click().wait(3000);
        cy.get('[name="navMenu"]').click();
        cy.contains('a div', 'Home').click().wait(4000);
        cy.get('[name="navMenu"]').click().wait(1000);
        cy.contains('a div', 'Top-up').click();
        cy.get(':nth-child(1) > .MuiPaper-elevation3 > .MuiStack-root > .MuiBox-root > .MuiButtonBase-root').click();
        cy.get(':nth-child(1) > .MuiTableCell-alignCenter > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').should('not.be.checked');
        cy.get(':nth-child(1) > .MuiTableCell-alignCenter > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click().wait(3000);
    })
})