// Use `cy.dataCy` custom command for more robust tests
// See https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements
//import * as ctx from "../../../quasar.conf.js";

const id = 1;

function returnUUID(): string {
  // random number between 1 and 1 mil
  const uuid = () => Cypress._.random(0, 1e6);
  const id = uuid().toString();
  return `test${id}`;
}

describe('Fill out Registration Page', () => {
  before(() => {
    cy.visit('/');
    cy.clearCookies();
    cy.wait(40000);
  });

  it('Verify that user can go to registration page', () => {
    cy.get('a').contains('Register').should('be.visible');
    cy.get('a').contains('Register').click();
  });
  it('Verify that user is able to register', () => {
    const testString = returnUUID();
    cy.get('#firstName').type(testString);
    cy.get('#lastName').type(testString);
    cy.get('#username').type(testString);
    cy.get('#email').type(`${testString}@test.com`);
    cy.get('#password').type('abc');
    cy.get('#password-confirm').type('abc');
    cy.get('input[value="Register"]').click();
    cy.wait(20000);
  });
});

describe('Components Page', () => {
  beforeEach(() => {
    cy.visit('/components');
  });
  it('Gutter contains components', () => {
    cy.get('[data-cy=component-gutter]')
      .children()
      .should('have.length.greaterThan', 0);
  });
  it('Component is clickable and shows dialog', () => {
    cy.get('[data-cy=component-gutter]')
      .children()
      .get('[data-cy=general-card]')
      .eq(id - 1) // -1 because -> index
      .click();
    cy.get('[data-cy=detailed-component]').should('be.visible');
    cy.url().should('include', id);
  });
  it('Visiting /components/ID also shows dialog with info', () => {
    cy.visit(`/components/${id}`);
    cy.get('[data-cy=detailed-component]').should('be.visible');
  });
});

describe('Products Page', () => {
  beforeEach(() => {
    cy.visit('/products');
    cy.wait(5000);
  });
  it('Gutter contains products', () => {
    cy.get('[data-cy=product-gutter]')
      .children()
      .should('have.length.greaterThan', 1);
  });
  it('Product is clickable and redirects to page', () => {
    cy.get('[data-cy=product-gutter]')
      .children()
      .get('[data-cy=general-card]')
      .eq(id - 1)
      .click();
    cy.get('[data-cy=products-page]').should('be.visible');
    cy.url().should('include', id);
  });
  it('Visiting /products/ID also shows its info + components', () => {
    cy.visit(`/products/${id}`);
    const page = cy.get('[data-cy=products-page]');
    page.should('be.visible');
    page.within(() => {
      cy.get('[data-cy=product-components]').should('be.visible');
    });
  });
  it('Product creation dialog opens', () => {
    cy.visit('/products/create');
    const popUp = cy.get('[data-cy=create-popup]');
    popUp.should('be.visible');
    popUp.within(() => {
      cy.get('[data-cy=selectable-components]').should('be.visible');
      cy.get('[data-cy=name-input]').should('be.visible');
    });
  });
  it('Product creation successfully sends data to API', () => {
    const name = returnUUID();
    cy.visit('/products/create');
    cy.get('[data-cy=create-popup]').within(() => {
      cy.get('[data-cy=selectable-components]')
        .children()
        .get('[data-cy=general-card]')
        .eq(id - 1)
        .click();
      cy.get('[data-cy=name-input]').type(name).should('have.value', name);
    });
    cy.get('[data-cy=create-button]').click();
    cy.get('.q-notification').should('have.class', 'bg-positive'); // -> successful Creation
  });
});

// Workaround for Cypress AE + TS + Vite
// See: https://github.com/quasarframework/quasar-testing/issues/262#issuecomment-1154127497
export {};
