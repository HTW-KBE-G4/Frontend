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

const mockComponents: HardwareComponent[] = new Array(10).fill(mockComponent);

const mockProduct: Product = {
  product_id: 1,
  name: 'MOCK',
  components: mockComponents,
  uvp: 99,
  image_url: 'MOCK',
};

const mockProducts: Product[] = new Array(5).fill(mockProduct);

const mockProductJSON = JSON.stringify(mockProduct);

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
    cy.get('.q-gutter-md')
      .children()
      .get('.q-card')
      .eq(mockID - 1) // -1 because -> index
      .click();
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
    /*cy.intercept('POST', '/products/create', {
      statusCode: 200,
      body: {
        name: 'MOCK',
        components: mockComponents,
      },
    });*/
    cy.intercept('GET', `${api}/components*`, {
      statusCode: 200,
      body: mockComponents,
    });
    cy.visit('/products');
    cy.wait(1000);
  });
  it('Gutter contains the right amount of fetched products', () => {
    cy.get('.q-gutter-md')
      .children()
      .should('have.length', mockProducts.length + 1); //+1 due to 1 "Create Card being present"
  });
  it('Product is clickable and redirects to page', () => {
    cy.get('.q-gutter-md')
      .children()
      .get('.q-card')
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
      cy.get('.q-gutter-sm')
        .children()
        .should('have.length', mockProduct.components.length);
    });
  });
  it('Product creation dialog opens', () => {
    cy.visit('/products/create');
    const popUp = cy.get('.q-dialog');
    popUp.should('be.visible');
    popUp.within(() => {
      cy.get('.q-gutter-md')
        .children()
        .should('have.length', mockComponents.length);
      cy.get('.q-input').should('be.visible');
    });
  });
  it('Product creation successfully sends data to API', () => {
    const name = 'Given Name';
    cy.visit('/products/create');
    cy.get('.q-dialog').within(() => {
      cy.get('.q-gutter-md')
        .children()
        .get('.q-card')
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
    cy.get('.q-dialog').within(() => {
      input = cy.get('[data-cy=name-input]');
      input.type(name).should('have.value', name);
    });

    cy.get('[data-cy=create-button]').should('not.be.enabled');

    cy.get('[data-cy=name-input]').clear();

    cy.get('.q-dialog').within(() => {
      cy.get('.q-gutter-md')
        .children()
        .get('.q-card')
        .eq(mockID - 1)
        .click();
    });

    cy.get('[data-cy=create-button]').should('not.be.enabled');
  });

  /*it('Product cannot be created if name is missing / components are not selected', () => {
    cy.visit('/products/create');
    cy.intercept('GET', '/products*', {
      statusCode: 200,
      body: {
        mockProducts,
      },
    });
    cy.intercept('GET', '/components*', {
      statusCode: 200,
      body: {
        mockComponents,
      },
    });
    cy.intercept('POST', '/products/create', {
      statusCode: 200,
      body: {
        name: 'MOCK',
        components: mockComponents,
      },
    });
    cy.visit('/products/create');
    //check if New Product Created pop up came
  });*/
});
/*
describe('Products Page', () => {
  it('Get all products', () => {
    cy.intercept('GET', '/products*', {
      statusCode: 200,
      body: {
        mockProducts,
      },
    });
    cy.visit('/products');
    //cy.get('list').length == mockProducts.length;
  });
  it('Get one product', () => {
    cy.intercept('GET', '/products*', {
      statusCode: 200,
      body: {
        mockProducts,
      },
    });
    cy.intercept('GET', '/products/*', {
      statusCode: 200,
      body: {
        mockProduct,
      },
    });
    cy.visit('/products');
    //cy.get('general-card').click(); //OR cy.visit(`/components/${id}`);
    //cy.get('general-card').name === ...;
  });
});

describe('Product Creation', () => {
  it('Create a product', () => {
    cy.visit('/products/create');
    cy.intercept('GET', '/products*', {
      statusCode: 200,
      body: {
        mockProducts,
      },
    });
    cy.intercept('GET', '/components*', {
      statusCode: 200,
      body: {
        mockComponents,
      },
    });
    cy.intercept('POST', '/products/create', {
      statusCode: 200,
      body: {
        name: 'MOCK',
        components: mockComponents,
      },
    });
    cy.visit('/products/create');
    //check if New Product Created pop up came
  });
});*/

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
