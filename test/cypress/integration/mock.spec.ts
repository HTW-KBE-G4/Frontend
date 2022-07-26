// Use `cy.dataCy` custom command for more robust tests
// See https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements
//import * as ctx from "../../../quasar.conf.js";
import { Product } from '../../../src/stores/product';
import {
  defaultCurrency,
  predefinedCurrencies,
} from '../../../src/stores/currency';
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
  imageURL: 'MOCK',
};

const mockComponents: HardwareComponent[] = new Array(10).fill(mockComponent);

const mockProduct: Product = {
  product_id: 1,
  name: 'MOCK',
  components: mockComponents,
  uvp: 99,
  image_url: 'MOCK',
};

const mockProducts: Product[] = new Array(5).fill(mockProduct);

const mockID = 1;

function pageIsVisible() {
  return cy.get('.q-header').should('be.visible');
}

// Run this first so all other tests won't have to wait for page to load
describe('Page Loads', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(10000);
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
    cy.get('[data-cy=component-gutter]')
      .children()
      .should('have.length', mockComponents.length);
  });
  it('Component is clickable and shows dialog', () => {
    cy.get('[data-cy=component-gutter]')
      .children()
      .get('[data-cy=general-card]')
      .eq(mockID - 1) // -1 because -> index
      .click();
    cy.get('[data-cy=detailed-component]').should('be.visible');
    cy.url().should('include', mockID);
  });
  it('Visiting /components/ID also shows dialog with info', () => {
    cy.visit(`/components/${mockID}`);
    const popUp = cy.get('[data-cy=detailed-component]');
    popUp.should('be.visible');
    popUp.within(() => {
      cy.contains(mockComponent.productName);
    });
  });
});

describe('Products Page', () => {
  beforeEach(() => {
    cy.intercept('GET', `${api}/products*`, {
      statusCode: 200,
      body: mockProducts,
    });
    cy.intercept('GET', `${api}/products/*`, {
      statusCode: 200,
      body: mockProduct,
    });
    cy.intercept('GET', `${api}/components*`, {
      statusCode: 200,
      body: mockComponents,
    });
    cy.visit('/products');
    cy.wait(1000);
  });
  it('Gutter contains the right amount of fetched products', () => {
    cy.get('[data-cy=product-gutter]')
      .children()
      .should('have.length', mockProducts.length + 1); //+1 due to 1 "Create Card being present"
  });
  it('Product is clickable and redirects to page', () => {
    cy.get('[data-cy=product-gutter]')
      .children()
      .get('[data-cy=general-card]')
      .eq(mockID - 1)
      .click();
    cy.get('[data-cy=products-page]')
      .should('be.visible')
      .within(() => cy.contains(mockProduct.uvp));
    cy.url().should('include', mockID);
  });
  it('Visiting /products/ID also shows its info + components', () => {
    cy.visit(`/products/${mockID}`);
    const page = cy.get('[data-cy=products-page]');
    page.should('be.visible');
    page.within(() => {
      cy.get('[data-cy=product-components]')
        .children()
        .should('have.length', mockProduct.components.length);
    });
  });
  it('Product creation dialog opens', () => {
    cy.visit('/products/create');
    const popUp = cy.get('[data-cy=create-popup]');
    popUp.should('be.visible');
    popUp.within(() => {
      cy.get('[data-cy=selectable-components]')
        .children()
        .should('have.length', mockComponents.length);
      cy.get('[data-cy=name-input]').should('be.visible');
    });
  });
  it('Product creation successfully sends data to API', () => {
    const name = 'Given Name';
    cy.visit('/products/create');
    cy.get('[data-cy=create-popup]').within(() => {
      cy.get('[data-cy=selectable-components]')
        .children()
        .get('[data-cy=general-card]')
        .eq(mockID - 1)
        .click();
      cy.get('[data-cy=name-input]').type(name).should('have.value', name);
    });

    cy.intercept('POST', `${api}/products/create*`, {
      statusCode: 200,
    }).as('createProduct');
    cy.get('[data-cy=create-button]').click();
    cy.wait('@createProduct').its('response.statusCode').should('eq', 200);

    cy.get('.q-notification').should('have.class', 'bg-positive'); // -> successful Creation
  });
  it('Product cannot be created if name is missing / components are not selected', () => {
    const name = 'Given Name';
    let input;
    cy.visit('/products/create');
    cy.get('[data-cy=create-popup]').within(() => {
      input = cy.get('[data-cy=name-input]');
      input.type(name).should('have.value', name);
    });

    cy.get('[data-cy=create-button]').should('not.be.enabled');

    cy.get('[data-cy=name-input]').clear();

    cy.get('[data-cy=create-popup]').within(() => {
      cy.get('[data-cy=selectable-components]')
        .children()
        .get('[data-cy=general-card]')
        .eq(mockID - 1)
        .click();
    });

    cy.get('[data-cy=create-button]').should('not.be.enabled');
  });
});

describe('Main Menu', () => {
  beforeEach(() => {
    cy.visit('/');
    pageIsVisible();
  });
  it('Switching currencies attempts to reload the products correctly', () => {
    cy.intercept('GET', `${api}/products?currency=${defaultCurrency}`, {
      statusCode: 200,
      body: mockProducts,
    });

    cy.get('[data-cy=currency-switch]').click();
    cy.get('[data-cy=currency-item]').should('be.visible');

    const currencyToBeSelected =
      predefinedCurrencies[predefinedCurrencies.length - 1]; // last selectable currency
    cy.intercept('GET', `${api}/products?currency=${currencyToBeSelected}`, {
      statusCode: 200,
      body: mockProducts,
    }).as('fetchProducts');

    cy.get('[data-cy=currency-item]').last().click(); // last selectable currency

    cy.wait('@fetchProducts').then((interception) => {
      expect(interception.request.url).to.include(currencyToBeSelected);
    });
  });
});

describe('Negative testing', () => {
  it('Visiting the products page should result in an error notification if the API is not reachable', () => {
    cy.visit('/products');
    cy.get('.q-notification').should('have.class', 'bg-negative'); // -> products couldn't be loaded
  });
  it('Visiting the components page should result in an error notification if the API is not reachable', () => {
    cy.visit('/components');
    cy.get('.q-notification').should('have.class', 'bg-negative'); // -> components couldn't be loaded
  });
  it('Visiting a product page that does not exist should result in an error notification and push back to /products', () => {
    cy.visit('/products/1');
    cy.get('.q-notification').should('have.class', 'bg-negative'); // -> product couldn't be loaded
    cy.location('pathname').should('eq', '/products');
  });
  it('Trying to display a component that does not exist should result in an error notification and push back to /components', () => {
    cy.visit('/components/1');
    cy.get('.q-notification').should('have.class', 'bg-negative'); // -> component couldn't be loaded
    cy.location('pathname').should('eq', '/components');
  });
  it('Trying to create a product without the API being reachable should result in an error notification', () => {
    cy.intercept('GET', `${api}/products*`, {
      statusCode: 200,
      body: mockProducts,
    });
    cy.intercept('GET', `${api}/components*`, {
      statusCode: 200,
      body: mockComponents,
    });
    cy.visit('/products/create');
    cy.get('[data-cy=create-popup]').within(() => {
      cy.get('[data-cy=selectable-components]')
        .children()
        .get('[data-cy=general-card]')
        .eq(mockID - 1)
        .click();
      cy.get('[data-cy=name-input]').type('MOCK');
    });
    cy.get('[data-cy=create-button]').click();
    cy.get('.q-notification').should('have.class', 'bg-negative'); // -> product couldn't be created
  });
});

// Workaround for Cypress AE + TS + Vite
// See: https://github.com/quasarframework/quasar-testing/issues/262#issuecomment-1154127497
export {};
