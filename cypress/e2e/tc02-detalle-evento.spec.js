/**
 * TC02 — Detalle de evento: selección de fecha y cálculo de total
 *
 * Cubre: visita directa a URL, verificación de datos, click en slot de horario,
 *        entrada de datos (selector de cantidad), verificación de total calculado.
 *
 * Sin autenticación requerida. La API se mockea con cy.intercept().
 *
 * Correr desde CLI:
 *   npx cypress run --spec "cypress/e2e/tc02-detalle-evento.spec.js"
 */

const mockEvent = {
  _id: 'ev1',
  title: 'Rock en el Parque',
  description: 'Festival de rock al aire libre con los mejores artistas.',
  richDescription: '',
  category: 'Música',
  venue: 'Parque Sarmiento',
  address: 'Av. del Parque 1000',
  city: 'Buenos Aires',
  country: 'Argentina',
  price: 5000,
  currency: 'ARS',
  imageUrl: '',
  isActive: true,
  producer: 'prod1',
  schedule: [
    { date: '2026-08-15T00:00:00.000Z', time: '20:00', tickets: 200, ticketsSold: 50 },
    { date: '2026-09-20T00:00:00.000Z', time: '21:30', tickets: 150, ticketsSold: 0 },
  ],
};

describe('TC02 — Detalle de evento, selección de horario y cálculo de total', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false);

    cy.intercept('GET', 'http://localhost:3000/events/ev1', {
      statusCode: 200,
      body: mockEvent,
    }).as('getEvent');

    cy.visit('/events/ev1');
    cy.wait('@getEvent');
  });

  it('muestra el nombre del evento, lugar y ciudad correctamente', () => {
    cy.contains('h1', 'Rock en el Parque').should('be.visible');
    cy.contains('Parque Sarmiento').should('be.visible');
    cy.contains('Buenos Aires, Argentina').should('be.visible');
    cy.contains('Música').should('be.visible');
  });

  it('lista los horarios disponibles con entradas restantes', () => {
    cy.contains('Fechas y Horarios Disponibles').should('be.visible');
    cy.contains('20:00').should('be.visible');
    cy.contains('21:30').should('be.visible');
    cy.contains('150 entradas disponibles').should('be.visible');
  });

  it('muestra la sección de compra al hacer click en un horario', () => {
    // Hacer click en el slot de las 21:30
    cy.contains('21:30').click();

    // Debe aparecer la sección de "Fecha y Hora Seleccionada"
    cy.contains('Fecha y Hora Seleccionada').should('be.visible');
    cy.contains('Comprar Entradas').should('be.visible');
  });

  it('actualiza el total al cambiar la cantidad de entradas', () => {
    // Seleccionar el horario de las 21:30
    cy.contains('21:30').click();

    // Verificar el total inicial (1 entrada × ARS 5000)
    cy.contains('Total: ARS 5000.00').should('be.visible');

    // Cambiar la cantidad a 3 entradas usando el selector
    cy.get('select').select('3');

    // Verificar el total actualizado (3 entradas × ARS 5000)
    cy.contains('Total: ARS 15000.00').should('be.visible');
  });
});
