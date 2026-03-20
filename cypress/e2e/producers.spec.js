/**
 * Producers — Verificación de protección de rutas y visibilidad de botones
 *
 * Confirma que:
 *   1. La ruta /producers/create está protegida (redirige a Auth0 sin sesión)
 *   2. Los botones Editar/Eliminar están ocultos para usuarios no autenticados
 *
 * Estos tests validan el comportamiento de seguridad implementado en:
 *   - App.tsx (ProtectedRoute en /producers/edit/:id)
 *   - ProducersPage.tsx (visibilidad condicional de botones según rol)
 */

describe('Producers - protección de rutas y visibilidad', () => {
  const apiBase = 'http://localhost:3000/producers';

  beforeEach(() => {
    cy.on('uncaught:exception', () => false);
  });

  it('redirige a Auth0 al intentar acceder a /producers/create sin autenticación', () => {
    cy.visit('/producers/create');

    // ProtectedRoute llama loginWithRedirect() → la URL deja de ser /producers/create.
    // cy.url() devuelve '' cuando la app navegó a un origen cross-origin (auth0.com),
    // lo cual NO incluye 'producers/create'. Ambos casos confirman que la ruta está protegida.
    cy.url().should('not.include', 'producers/create');
  });

  it('oculta los botones Editar y Eliminar a usuarios no autenticados', () => {
    const producer = { _id: 'p1', name: 'Test Producer', email: 'test@example.com', phone: '123456' };

    cy.intercept('GET', apiBase, { statusCode: 200, body: [producer] }).as('getProducers');

    cy.visit('/producers');
    cy.wait('@getProducers');

    // El nombre se muestra (GET /producers es público)
    cy.contains(producer.name).should('exist');

    // Los botones de acción NO son visibles para usuarios sin rol admin
    cy.contains('button', 'Editar').should('not.exist');
    cy.contains('button', 'Eliminar').should('not.exist');
  });
});
