/**
 * TC01 — Lista y filtro de eventos
 *
 * Cubre: navegación, render de lista, entrada de datos (select de categoría),
 *        click en card y navegación al detalle.
 *
 * Sin autenticación requerida. La API se mockea con cy.intercept().
 *
 * Correr desde CLI:
 *   npx cypress run --spec "cypress/e2e/tc01-lista-eventos.spec.js"
 */

const mockEvents = [
  {
    _id: 'ev1',
    title: 'Rock en el Parque',
    description: 'Festival de rock al aire libre',
    category: 'Música',
    venue: 'Parque Sarmiento',
    city: 'Buenos Aires',
    country: 'Argentina',
    price: 5000,
    currency: 'ARS',
    imageUrl: '',
    isActive: true,
    schedule: [{ date: '2026-08-15T00:00:00.000Z', time: '20:00', tickets: 200, ticketsSold: 50 }],
  },
  {
    _id: 'ev2',
    title: 'Noche de Teatro',
    description: 'Obra de teatro contemporánea',
    category: 'Teatro',
    venue: 'Teatro Nacional',
    city: 'Buenos Aires',
    country: 'Argentina',
    price: 3500,
    currency: 'ARS',
    imageUrl: '',
    isActive: true,
    schedule: [{ date: '2026-09-10T00:00:00.000Z', time: '21:00', tickets: 100, ticketsSold: 30 }],
  },
  {
    _id: 'ev3',
    title: 'Stand Up Noche',
    description: 'Show de comedia en vivo',
    category: 'Comedia',
    venue: 'El Comedians',
    city: 'Córdoba',
    country: 'Argentina',
    price: 2800,
    currency: 'ARS',
    imageUrl: '',
    isActive: true,
    schedule: [{ date: '2026-10-01T00:00:00.000Z', time: '22:00', tickets: 150, ticketsSold: 10 }],
  },
];

describe('TC01 — Lista y filtro de eventos', () => {
  beforeEach(() => {
    // Evitar que errores de Auth0 corten el test
    cy.on('uncaught:exception', () => false);

    cy.intercept('GET', 'http://localhost:3000/events', {
      statusCode: 200,
      body: mockEvents,
    }).as('getEvents');

    cy.visit('/');
    cy.wait('@getEvents');
  });

  it('muestra el título y los tres eventos al cargar la página', () => {
    cy.contains('h1', 'Próximos Eventos').should('be.visible');
    cy.contains('Rock en el Parque').should('be.visible');
    cy.contains('Noche de Teatro').should('be.visible');
    cy.contains('Stand Up Noche').should('be.visible');
  });

  it('filtra eventos al seleccionar una categoría del selector', () => {
    // Verificar estado inicial: todos los eventos visibles
    cy.contains('Rock en el Parque').should('be.visible');
    cy.contains('Noche de Teatro').should('be.visible');

    // Seleccionar categoría "Música" en el dropdown
    cy.get('select').select('Música');

    // Solo el evento de Música debe estar visible
    cy.contains('Rock en el Parque').should('be.visible');
    cy.contains('Noche de Teatro').should('not.exist');
    cy.contains('Stand Up Noche').should('not.exist');
  });

  it('vuelve a mostrar todos los eventos al seleccionar "Todas las categorías"', () => {
    // Primero filtrar
    cy.get('select').select('Teatro');
    cy.contains('Rock en el Parque').should('not.exist');

    // Limpiar el filtro
    cy.get('select').select('Todas las categorías');

    // Todos los eventos deben reaparecer
    cy.contains('Rock en el Parque').should('be.visible');
    cy.contains('Noche de Teatro').should('be.visible');
    cy.contains('Stand Up Noche').should('be.visible');
  });

  it('navega al detalle del evento al hacer click en la card', () => {
    cy.intercept('GET', 'http://localhost:3000/events/ev1', {
      statusCode: 200,
      body: { ...mockEvents[0], richDescription: '', address: 'Av. del Parque 1000', producer: 'prod1' },
    }).as('getEventDetail');

    cy.contains('Rock en el Parque').click();

    cy.url().should('include', '/events/ev1');
  });
});
