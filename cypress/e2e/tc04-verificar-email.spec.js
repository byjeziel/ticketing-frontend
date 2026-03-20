/**
 * TC04 — Verificación de email (token válido e inválido)
 *
 * Cubre: visita con parámetros en URL, mock de API con respuestas distintas,
 *        verificación de estados de la UI (éxito/error), y navegación desde botones.
 *
 * Sin autenticación requerida. Página 100% pública.
 *
 * Correr desde CLI:
 *   npx cypress run --spec "cypress/e2e/tc04-verificar-email.spec.js"
 */

const VERIFY_ENDPOINT = 'http://localhost:3000/tickets/verify-email*';

describe('TC04 — Verificación de email', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false);
  });

  it('muestra el estado de error cuando no se proporciona token', () => {
    cy.visit('/verify-email');

    // La página detecta ausencia de token y muestra el estado de error
    cy.contains('Verificación fallida').should('be.visible');
  });

  it('muestra el estado de error cuando el token es inválido o expirado', () => {
    cy.intercept('GET', VERIFY_ENDPOINT, {
      statusCode: 200,
      body: { success: false, message: 'Token inválido o expirado.' },
    }).as('verifyInvalid');

    cy.visit('/verify-email?token=token-invalido-abc123');
    cy.wait('@verifyInvalid');

    cy.contains('Verificación fallida').should('be.visible');
    cy.contains('Token inválido o expirado.').should('be.visible');
    cy.contains('Ir a Eventos').should('be.visible');
  });

  it('muestra el estado de éxito cuando el token es válido', () => {
    cy.intercept('GET', VERIFY_ENDPOINT, {
      statusCode: 200,
      body: { success: true, message: 'Email verificado correctamente.' },
    }).as('verifyOk');

    cy.visit('/verify-email?token=token-valido-xyz789');
    cy.wait('@verifyOk');

    cy.contains('¡Email verificado!').should('be.visible');
    cy.contains('Tu código QR ya está activo').should('be.visible');
    cy.contains('Ver Mis Entradas').should('be.visible');
  });

  it('navega a /events al clickear "Ir a Eventos" desde el estado de error', () => {
    cy.intercept('GET', VERIFY_ENDPOINT, {
      statusCode: 200,
      body: { success: false, message: 'Token inválido.' },
    }).as('verifyError');

    cy.intercept('GET', 'http://localhost:3000/events', {
      statusCode: 200,
      body: [],
    }).as('getEvents');

    cy.visit('/verify-email?token=bad-token');
    cy.wait('@verifyError');

    cy.contains('Ir a Eventos').click();

    cy.url().should('include', '/events');
  });
});
