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
});
