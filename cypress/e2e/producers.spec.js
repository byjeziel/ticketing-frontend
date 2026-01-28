describe('Producers - create & edit flows', () => {
  // Puerto donde corre la API mockeada
  const apiBase = 'http://localhost:3000/producers';

  it('creates a producer', () => {
    const newProducer = { _id: 'p1', name: 'Test Producer', email: 'test@example.com', phone: '123456' };

    //Mock de Post y Get
    cy.intercept('POST', apiBase, { statusCode: 201, body: newProducer }).as('postProducer');

    cy.intercept('GET', apiBase, { statusCode: 200, body: [newProducer] }).as('getProducersAfterCreate');

    //Visita la ruta de creacion
    cy.visit('/producers/create');
    
    //Rellena el formulario
    cy.get('input[placeholder="Nombre"]').should('exist').type(newProducer.name);
    cy.get('input[placeholder="Email"]').type(newProducer.email);
    cy.get('input[placeholder="Teléfono"]').type(newProducer.phone);

    //Envia el formulario
    cy.contains('button', 'Crear').click();

    //Verfica que redirige a /producers y muestra el nuevo productor
    cy.url().should('include', '/producers');
    cy.contains(newProducer.name).should('exist');
  });

  it('edits an existing producer and shows updated name', () => {
    const original = { _id: 'p2', name: 'Orig Name', email: 'orig@example.com', phone: '111' };
    const updated = { ...original, name: 'Updated Name' };

    // Retorno del productor original
    cy.intercept('GET', apiBase, { statusCode: 200, body: [original] }).as('getProducers');

    // Visita la lista de productores
    cy.visit('/producers');

    // Verifica que el productor original exista en la lista
    cy.contains(original.name).should('exist');

    cy.intercept('GET', `${apiBase}/${original._id}`, { statusCode: 200, body: original }).as('getById');

    cy.contains('button', 'Editar').click();

    // Se fija que tenga los datos originales
    cy.get('input[placeholder="Nombre"]').should('have.value', original.name);

    // Hace un cambio
    cy.get('input[placeholder="Nombre"]').clear().type(updated.name);

    // Mock de PATCH y GET luego de la actualizacion
    cy.intercept('PATCH', `${apiBase}/${original._id}`, { statusCode: 200, body: updated }).as('patchProducer');
    cy.intercept('GET', apiBase, { statusCode: 200, body: [updated] }).as('getProducersAfterUpdate');

    // Guarda los cambios
    cy.contains('button', 'Guardar').click();

    // Vuelve a la lista y verifica el cambio
    cy.url().should('include', '/producers');
    cy.contains(updated.name).should('exist');
  });
});