describe('Sign Up Page Tests', () => {
    // const now = new Date().getTime();
    // const unixTimestamp = Math.floor(now / 1000);
    // const tempEmail = `testuser${unixTimestamp}@example.com`;

    beforeEach(() => {
        // Runs before each test in the block
        cy.visit('http://localhost:3000/signup'); // Adjust if your local development URL is different
    });

    // it('create test email', () => {
    //     cy.visit('https://yopmail.com/en/');
    //     cy.get('input[class="ycptinput"]').type(tempEmail.slice(0,tempEmail.indexOf('@')));
    //     cy.get('button[title="Check Inbox @yopmail.com"]').click();
    //     cy.contains('.bname', 'tempEmail').should('be.visible');
    // })

    it('Check sign up elements are visible', () => {
        cy.url().should('include', '/signup');
        cy.get('input[name="firstName"]').should('exist');
        cy.get('input[name="middleName"]').should('exist');
        cy.get('input[name="lastName"]').should('exist');
        cy.get('input[name="email"]').should('exist');
        cy.get('input[name="mobileNumber"]').should('exist');
        cy.get('input[name="username"]').should('exist');
        cy.get('input[name="password"]').should('exist');
        cy.get('input[name="confirmPassword"]').should('exist');
    })

    // todo sign up unit test
    // it('Check sign up functionality', () => {
    //     cy.get('input[name="firstName"]').type('test');
    //     cy.get('input[name="middleName"]').type('testing');
    //     cy.get('input[name="lastName"]').type('tester');
    //     cy.get('input[name="email"]').type(tempEmail);
    //     cy.get('input[name="mobileNumber"]').type('9513217169');
    //     cy.get('input[name="password"]').type('Tonyspark@71');
    //     cy.get('input[name="confirmPassword"]').type('Tonyspark@71');
    //     cy.get('input[name="termsCheck"]').click();
    //     cy.get('.termsScroll').scrollTo('bottom'); // Scroll 'sidebar' to its bottom
    //     cy.contains('button', 'Agree to Terms').click();
    //     cy.request(`https://api.temp-mail.org/request/mail/id/${encodeURIComponent(tempEmail)}`)
    //     .its('body')
    //     .then((body) => {
    //         console.log(body);
    //         const otp = body.match(/OTP: (\d+)/)[1]; // Regex to extract OTP
    //         cy.get('#otp').type(otp);
    //         cy.get('#verify').click();
    //     });
    //     cy.get('button[name="signup"]').click().wait(15000);
    // })

    // it('', () => {
    //
    // })

});