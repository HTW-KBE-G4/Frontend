// Use `cy.dataCy` custom command for more robust tests
// See https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements
//import * as ctx from "../../../quasar.conf.js";
import { Product } from '../../../src/stores/product';
import { HardwareComponent } from '../../../src/stores/hardwareComponent';

const api = 'http://localhost:8800';

const mockComponent: HardwareComponent = {
  component_id: 1,
  type: 'MOCK',
  model: 'MOCK',
  description: 'MOCK',
  manufacturer: 'MOCK',
  releaseDate: 'MOCK',
  uvp: 99,
  weight: 99,
  productName: 'MOCK',
  ean: 99,
  imageUrl: 'MOCK',
};

const mockComponents: HardwareComponent[] = new Array(5).fill(mockComponent);

const mockComponentJSON = JSON.stringify(mockComponent);
const mockComponentsJSON = JSON.stringify(mockComponents);

const mockProduct: Product = {
  product_id: 1,
  name: 'MOCK',
  components: mockComponents,
  uvp: 99,
  image_url: 'MOCK',
};

const mockProducts: Product[] = new Array(5).fill(mockProduct);

const mockProductJSON = JSON.stringify(mockProduct);
const mockProductsJSON = JSON.stringify(mockProducts);

const mockID = 1;

function pageIsVisible() {
  return cy.get('.q-header').should('be.visible');
}

// Run this first so all other tests won't have to wait for page to load
describe('Page Loads', () => {
  beforeEach(() => {
    cy.visit('/');
    pageIsVisible();
  });
  it('Assert that <title> is correct', () => {
    cy.title().should('include', 'Tanuki');
  });
});

describe('Components Page', () => {
  beforeEach(() => {
    cy.intercept('GET', `${api}/components*`, {
      statusCode: 200,
      body: mockComponents,
    });
    cy.intercept('GET', `${api}/components/*`, {
      statusCode: 200,
      body: mockComponent,
    });
    cy.visit('/components');
  });
  it('Gutter contains the right amount of fetched components', () => {
    cy.get('.q-gutter-md')
      .children()
      .should('have.length', mockComponents.length);
  });
  it('Component is clickable and shows dialog', () => {
    cy.get('.q-gutter-md').children().get('.q-card').eq(mockID).click();
    cy.get('.q-dialog').should('be.visible');
    cy.url().should('include', mockID);
  });
  it('Visiting /components/ID also shows dialog with info', () => {
    cy.visit(`/components/${mockID}`);
    const popUp = cy.get('.q-dialog');
    popUp.should('be.visible');
    popUp.within(() => {
      cy.contains(mockComponent.productName);
    });
  });
});

//TODO products page, switch currencies, about page

// ** The following code is an example to show you how to write some tests for your home page **
//
//  describe('Landing', () => {
//    beforeEach(() => {
//      cy.visit('/');
//    });
//    it('.should() - assert that <title> is correct', () => {
//      cy.title().should('include', 'Quasar');
//      cy.get('li').first().click();
//      cy.contains('Clicks on todos: 1').should('exist');
//    });
//  });
//
// describe('Home page tests', () => {
//   beforeEach(() => {
//     cy.visit('/');
//   });
//   it('has pretty background', () => {
//     cy.dataCy('landing-wrapper')
//       .should('have.css', 'background')
//       .and('match', /(".+(\/img\/background).+\.png)/);
//   });
//   it('has pretty logo', () => {
//     cy.dataCy('landing-wrapper img')
//       .should('have.class', 'logo-main')
//       .and('have.attr', 'src')
//       .and('match', /^(data:image\/svg\+xml).+/);
//   });
//   it('has very important information', () => {
//     cy.dataCy('instruction-wrapper')
//       .should('contain', 'SETUP INSTRUCTIONS')
//       .and('contain', 'Configure Authentication')
//       .and('contain', 'Database Configuration and CRUD operations')
//       .and('contain', 'Continuous Integration & Continuous Deployment CI/CD');
//   });
// });

// Workaround for Cypress AE + TS + Vite
// See: https://github.com/quasarframework/quasar-testing/issues/262#issuecomment-1154127497
export {};
