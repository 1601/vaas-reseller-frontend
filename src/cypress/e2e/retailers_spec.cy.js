describe('retailers unit tests', () => {
    const now = new Date().getTime();
    const unixTimestamp = Math.floor(now / 1000);
    const tempEmail = `testuser${unixTimestamp}@example.com`;

    beforeEach(() => {
        const isStaging = Cypress.env('IsStaging');
        cy.visit(`${Cypress.env(isStaging ? 'REACT_CYPRESS_STAGING_TEST_URL' : 'REACT_CYPRESS_LOCAL_TEST_URL')}/login`); // Adjust if your local development URL is different
        cy.get('input[name="email"]').type('test891554@yopmail.com');
        cy.get('input[name="password"]').type('Tonyspark@71');
        cy.contains('button', 'Login').click().wait(2000);
        if(isStaging){
            cy.pause();
        }
        cy.get('[name="navMenu"]').click();
        cy.contains('a div', 'Store').click();
        cy.contains('a div', 'Manage Retailers').click();
    })

    it('Check if retailers page elements are visible', () => {
        cy.contains('h5', 'My Retailers').should('be.visible');
    })

    it('test add retailer', () => {
        cy.contains('button' ,'+ Add Retailer').click();
        cy.get('input[name="email"]').type(tempEmail);
        cy.get('input[name="firstName"]').type('test');
        cy.get('input[name="lastName"]').type('tester');
        cy.get('input[name="mobileNumber"]').type('9133217369');
        cy.get('input[name="companyName"]').type('sample company');
        cy.contains('button' ,'Submit').click();
        cy.contains('h6', 'Creating Retailer...').should('be.visible');
        cy.contains('h5', 'Reseller Successfully Created').should('be.visible');
        cy.contains('button' ,'Done').click();
    })

    it('test change retailer status', () => {
        cy.get('button svg[data-testid="EditIcon"]').click();
        cy.contains('ul li', 'Active').click();
        cy.contains('table td', 'Active').should('be.visible');
        cy.get('button svg[data-testid="EditIcon"]').click();
        cy.contains('ul li', 'Deactivated').click();
        cy.contains('table td', 'Deactivated').should('be.visible');
        cy.get('button svg[data-testid="EditIcon"]').click();
        cy.contains('ul li', 'Disabled').click();
        cy.contains('table td', 'Disabled').should('be.visible');
    })

    it('test edit retailer', () => {
        cy.get('button svg[data-testid="MoreVertIcon"]').click({multiple: true});
        cy.contains('ul li', 'Edit Retailer').click();
        cy.contains('h2', 'Edit Retailer').should('be.visible');
        cy.get('input[name="firstName"]').clear();
        cy.get('input[name="firstName"]').type('testy');
        cy.get('input[name="lastName"]').clear();
        cy.get('input[name="lastName"]').type('testery');
        cy.get('input[name="companyName"]').clear();
        cy.get('input[name="companyName"]').type('test company');
        cy.contains('button', 'Submit').click();
        cy.contains('table td div', 'testy testery').should('be.visible');
        cy.contains('table td', 'test company').should('be.visible');
        cy.get('button svg[data-testid="MoreVertIcon"]').click({multiple: true});
        cy.contains('ul li', 'Edit Retailer').click();
        cy.get('input[name="firstName"]').clear();
        cy.get('input[name="firstName"]').type('test');
        cy.get('input[name="lastName"]').clear();
        cy.get('input[name="lastName"]').type('tester');
        cy.get('input[name="companyName"]').clear();
        cy.get('input[name="companyName"]').type('N/A');
        cy.contains('button', 'Submit').click();
        cy.contains('table td div', 'test tester').should('be.visible');
        cy.contains('table td', 'N/A').should('be.visible');
    })

    it('test delete retailer', () => {
        cy.contains('table td div', 'test tester').should('be.visible');
        cy.get('button svg[data-testid="MoreVertIcon"]').click({multiple: true});
        cy.contains('ul li', 'Delete Retailer').click();
        cy.contains('h2', 'Confirm Deletion').should('be.visible');
        cy.contains('button', 'Yes').click();
        cy.contains('table td div', 'test tester').should('not.exist');
    })
})