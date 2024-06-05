describe('upload store documents spec', () => {
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
    })

    it('Test store document upload element visibility', () => {
        cy.url().should('include', '/dashboard/app');
        cy.get('[name="navMenu"]').click();
        cy.contains('a div', 'upload document').click();
        cy.url().should('include', '/dashboard/kyc');
    })

    it('test validation form', () => {
        cy.url().should('include', '/dashboard/app');
        cy.get('[name="navMenu"]').click();
        cy.contains('a div', 'upload document').click();
        cy.contains('button', 'Next').click();
        cy.get('input[name="customerServiceNumber"]').type('abcde');
        cy.get('input[name="customerServiceNumber"]').should('be.empty');
        cy.get('input[name="numberOfEmployees"]').type('abcde');
        cy.get('input[name="numberOfEmployees"]').should('have.value', 0);
        cy.get('input[name="uniqueIdentifier"]').type('@##%^');
        cy.get('input[name="uniqueIdentifier"]').should('have.value', '');
        cy.get('input[name="externalLinkAccount-0"]').type('vortex.com');
        cy.contains('button', 'Next').click();
        cy.contains('Invalid Link').should('be.visible');
    })

    it('test validation upload', () => {
        cy.get('[name="navMenu"]').click();
        cy.contains('a div', 'upload document').click();
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
        cy.get('[name="uploadId"]').click();
        cy.get('input[type="file"][name="uploadIdInput"]').invoke('show').selectFile('cypress/fixtures/test_id.jpg');
        cy.get('[name="uploadId"]').click();
        cy.get('[name="uploadDoc"]').click();
        cy.get('input[type="file"][name="uploadDocInput"]').invoke('show').selectFile('cypress/fixtures/test_business_doc.jpg');
        cy.get('[name="uploadDoc"]').click();
        cy.get('input[type="file"][name="uploadDocInput"]').invoke('show').selectFile('cypress/fixtures/test_business_doc.jpg').wait(2000);
        cy.contains('Exceeded allowed number of files to be uploaded').should('be.visible');
    })

    it('Test store document upload', () => {
        const isStaging = Cypress.env('IsStaging');
        cy.get('[name="navMenu"]').click();
        cy.contains('a div', 'upload document').click();
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
        cy.contains('h6', 'Upload Success').should('be.visible');
        cy.contains('Proceed').click();
        cy.visit(`${Cypress.env(isStaging ? 'REACT_CYPRESS_STAGING_TEST_URL' : 'REACT_CYPRESS_LOCAL_TEST_URL')}/dashboard/app`);
        cy.get('[name="navMenu"]').click();
        cy.contains('a div', 'upload document').click();
        cy.contains('h5','Your Files are Successfuly Uploaded And it is Under Review').should('be.visible');
    })

    it('Test show uploaded document', () => {
        cy.get('[name="navMenu"]').click();
        cy.contains('a div', 'Store').click();
        cy.contains('a div', 'Storefront').click();
        cy.contains('button', 'Uploaded Document').click();
        cy.contains('h2', 'Uploaded Document').should('be.visible');
    })
})