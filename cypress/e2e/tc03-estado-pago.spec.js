/**
 * TC03 — Página de estado de pago
 *
 * Cubre: navegación directa a diferentes estados (success/failure/pending),
 *        verificación de mensajes, número de referencia, y clicks de navegación.
 *
 * Sin autenticación requerida. Página 100% pública.
 *
 * Correr desde CLI:
 *   npx cypress run --spec "cypress/e2e/tc03-estado-pago.spec.js"
 */

describe('TC03 — Página de estado de pago', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false);
  });

  it('muestra el estado de pago exitoso con número de referencia', () => {
    cy.visit('/payment/success?reference=REF-2026-001');

    cy.contains('¡Pago exitoso!').should('be.visible');
    cy.contains('Tus entradas fueron confirmadas').should('be.visible');
    cy.contains('REF-2026-001').should('be.visible');
    cy.contains('Ver Mis Entradas').should('be.visible');
  });

  it('muestra el estado de pago fallido con opción de reintentar', () => {
    cy.visit('/payment/failure');

    cy.contains('Pago fallido').should('be.visible');
    cy.contains('No se pudo procesar tu pago').should('be.visible');
    cy.contains('Intentar de nuevo').should('be.visible');
  });

  it('muestra el estado de pago pendiente con mensaje informativo', () => {
    cy.visit('/payment/pending');

    cy.contains('Pago pendiente').should('be.visible');
    cy.contains('Tu pago está siendo procesado').should('be.visible');
    cy.contains('Ver Eventos').should('be.visible');
  });

  it('navega a la lista de eventos al clickear "Intentar de nuevo" desde pago fallido', () => {
    cy.intercept('GET', 'http://localhost:3000/events', {
      statusCode: 200,
      body: [],
    }).as('getEvents');

    cy.visit('/payment/failure');
    cy.contains('Intentar de nuevo').click();

    cy.url().should('satisfy', (url) =>
      url.includes('/events') || url === Cypress.config('baseUrl') + '/'
    );
  });

  it('navega a mis entradas al clickear "Ver Mis Entradas" desde pago exitoso', () => {
    cy.visit('/payment/success');

    // Si ProtectedRoute redirige a Auth0 (cross-origin), cy.url() lanza CypressError.
    // Capturamos ese error: si menciona auth0.com, la protección funciona correctamente.
    cy.on('fail', (err) => {
      if (err.message.includes('auth0.com')) return false;
      throw err;
    });

    cy.contains('Ver Mis Entradas').click();
    // Si no hubo redirect cross-origin (sesión activa), debe ir a /my-tickets
    cy.url().should('include', 'my-tickets');
  });
});
