describe('setting unit tests', () => {
    beforeEach(() => {
        const isStaging = Cypress.env('IsStaging');
        cy.visit(`${Cypress.env(isStaging ? 'REACT_CYPRESS_STAGING_TEST_URL' : 'REACT_CYPRESS_LOCAL_TEST_URL')}/login`); // Adjust if your local development URL is different
        cy.get('input[name="email"]').type('test891554@yopmail.com');
        cy.get('input[name="password"]').type('Tonyspark@71');
        cy.contains('button', 'Login').click().wait(3000);
        if(isStaging){
            cy.pause();
        }
        cy.contains('a','Proceed to Settings').click();
    })

    it('Check if setting page elements are visible', () => {
        cy.contains('h4', 'Profile Settings').should('be.visible');
        cy.contains('div label', 'First Name').should('be.visible');
        cy.contains('div label', 'Middle Name (Optional)').should('be.visible');
        cy.contains('div label', 'Last Name').should('be.visible');
        cy.contains('div label', 'Country').should('be.visible');
        cy.contains('div label', 'Username').should('be.visible');
        cy.contains('div label', 'Email').should('be.visible');
        cy.contains('div label', 'Mobile Number').should('be.visible');
        cy.contains('h6', 'Preferences').should('be.visible');
    })

    it('Test change profile', () => {
        cy.contains('button' ,'Edit Profile').click();
        cy.get('[name="firstName"]').clear().type('testery');
        cy.get('[name="middleName"]').clear().type('testing');
        cy.get('[name="lastName"]').clear().type('testy');
        cy.contains('button', 'Save').click().wait(2000);
        cy.get('input[name="firstName"]').invoke('val').then((inputValue) => {
            // Use Cypress assertions to compare the input value with expected value
            expect(inputValue).to.equal('testery');
        });
        cy.get('input[name="middleName"]').invoke('val').then((inputValue) => {
            // Use Cypress assertions to compare the input value with expected value
            expect(inputValue).to.equal('testing');
        });
        cy.get('input[name="lastName"]').invoke('val').then((inputValue) => {
            // Use Cypress assertions to compare the input value with expected value
            expect(inputValue).to.equal('testy');
        });
    })

    it('Test change password', () => {
        cy.contains('button', 'Change Password').click();
        cy.contains('h2', 'Change Password').should('be.visible');
        cy.contains('div label', 'New Password')
            .parent('div') // Assuming the input is a sibling of the label inside the same div
            .find('input')
            .type('Tonyspark@71');
        cy.contains('div label', 'Confirm New Password')
            .parent('div') // Assuming the input is a sibling of the label inside the same div
            .find('input')
            .type('Tonyspark@71');
        cy.contains('div[class="MuiDialog-root MuiModal-root css-zw3mfo-MuiModal-root-MuiDialog-root"] button', 'Change Password').click();
        cy.on('window:alert', (message) => {
            // Log or assert the message as needed
            expect(message).to.equal('Password changed successfully');
        });
    })

    it('Test app policy link', () => {
        cy.scrollTo('bottom')
        cy.contains('span', 'Terms and Conditions, Cookie Policy, and Privacy Policy').click();
        cy.contains('h2', 'Terms and Conditions').should('be.visible');
    })
})