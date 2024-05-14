describe('upload store documents spec', () => {
    beforeEach(() => {
        const isStaging = Cypress.env('IsStaging');
        cy.visit(`${Cypress.env(isStaging ? 'REACT_CYPRESS_STAGING_TEST_URL' : 'REACT_CYPRESS_LOCAL_TEST_URL')}/login`); // Adjust if your local development URL is different
        cy.get('input[name="email"]').type('test214515251658@yopmail.com');
        cy.get('input[name="password"]').type('Tonyspark@71');
        cy.contains('button', 'Login').click();
    })

    it('Test store document upload element visibility', () => {
        cy.url().should('include', '/dashboard/app');
        cy.get('[name="navMenu"]').click();
        cy.contains('a div', 'upload document').click();
        cy.url().should('include', '/dashboard/kyc');
    })

    it('Test store document upload', () => {
        cy.get('[name="navMenu"]').click();
        cy.contains('a div', 'upload document').click();
        cy.contains('h5','Your Files are Successfuly Uploaded And it is Under Review').then($element => {
            if($element.length > 0){
                cy.contains('h5', 'Your Files are Successfuly Uploaded And it is Under Review').should('be.visible');
            }else{
                cy.contains('button', 'Next').click();
                cy.get('input[name="customerServiceNumber"]').type('9513217169');
                cy.get('input[name="streetAddress"]').type('456 Main Street, Apt. 12B');
                cy.get('input[name="cityAddress"]').type('San Francisco');
                cy.get('input[name="regionAddress"]').type('CA (California)');
                cy.get('input[name="zipCodeAddress"]').type('94105');
                cy.get('input[name="numberOfEmployees"]').type('5');
                cy.get('input[name="uniqueIdentifier"]').type('51s51aa9-58s51-521d');
                cy.contains('button', 'Next').click();
                cy.contains('div', 'Individual').click();
                cy.contains('button', 'Next').click();
                cy.get('[name="uploadId"]').click();
                cy.get('input[type="file"][name="uploadIdInput"]').invoke('show').selectFile('cypress/fixtures/test_id.jpg');
                cy.get('[name="uploadDoc"]').click();
                cy.get('input[type="file"][name="uploadDocInput"]').invoke('show').selectFile('cypress/fixtures/test_business_doc.jpg');
                cy.contains('button', 'Submit').click();
                cy.contains('h4', 'Uploading Files').should('be.visible').wait(20000);
                cy.contains('a div', 'upload document').click().wait(1000);
            }
        });

    })

    // todo add more unit test for store upload
})