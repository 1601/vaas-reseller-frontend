describe('Landing Page Tests', () => {
  beforeEach(() => {
    // Runs before each test in the block
    cy.visit('http://localhost:3000'); // Adjust if your local development URL is different
  });

  it('Checks for the presence of Login and Create Shop links, and email input field', () => {
    cy.contains('Log in').should('be.visible');
    cy.contains('Create Shop').should('be.visible');
    cy.get('input[placeholder="Your email..."]').should('be.visible');
  });

  it('Allows user to input email and redirects to the signup page', () => {
    cy.get('input[placeholder="Your email..."]').type('user@example.com');
    cy.contains('Create my Own Shop').click();
    cy.url().should('include', '/signup');
    cy.get('input[name="email"]').should('have.value', 'user@example.com');
  });

  it('Check Login button redirection', () => {
    cy.contains('Log in').click();
    cy.url().should('include', '/login');
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.contains('button', 'Login').should('be.visible');
  });

  it('Check Sign up button redirection', () => {
    cy.contains('Create Shop').click();
    cy.url().should('include', '/signup');
    cy.get('input[name="firstName"]').should('exist')
    cy.get('input[name="middleName"]').should('exist')
    cy.get('input[name="lastName"]').should('exist')
    cy.get('input[name="mobileNumber"]').should('exist')
    cy.get('input[name="username"]').should('exist')
    cy.get('input[name="password"]').should('exist')
    cy.get('input[name="confirmPassword"]').should('exist')
    cy.contains('h6', 'Sign Up').should('exist');
  });
});
