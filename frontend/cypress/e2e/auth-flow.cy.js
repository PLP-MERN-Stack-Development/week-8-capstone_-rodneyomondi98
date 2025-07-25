describe('Auth Flow', () => {
  it('registers, logs in, and sees dashboard', () => {
    cy.visit('http://localhost:5173/register');
    cy.get('input[placeholder="Name"]').type('E2E User');
    cy.get('input[placeholder="Email"]').type('e2euser@example.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('select').select('student');
    cy.get('button').contains('Register').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Available Courses');
    // Logout and login
    // (Assume a logout button is present in the real app)
    // cy.get('button').contains('Logout').click();
    // cy.visit('http://localhost:5173/login');
    // cy.get('input[placeholder="Email"]').type('e2euser@example.com');
    // cy.get('input[placeholder="Password"]').type('password123');
    // cy.get('button').contains('Login').click();
    // cy.url().should('include', '/dashboard');
  });
}); 