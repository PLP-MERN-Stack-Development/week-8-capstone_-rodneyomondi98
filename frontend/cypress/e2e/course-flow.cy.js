describe('Course Flow', () => {
  it('enrolls in a course and views details', () => {
    cy.visit('http://localhost:5173/login');
    cy.get('input[placeholder="Email"]').type('student@example.com');
    cy.get('input[placeholder="Password"]').type('password');
    cy.get('button').contains('Login').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Available Courses');
    // Enroll in first course if present
    cy.get('button').contains('Enroll').first().click();
    cy.contains('Enrolled');
    cy.get('button').contains('View').first().click();
    cy.url().should('include', '/courses/');
    cy.contains('Lessons');
    cy.contains('Quizzes');
  });
}); 