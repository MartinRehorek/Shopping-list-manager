const request = require('supertest')
const app = require('../src/index')

// npm test --runInBand --detectOpenHandles

jest.setTimeout(30000);

describe('Seed the database in order to return the correct statements.', () => {
  // seed
  test('Seed the database for tests', async () => {
    const response = await request(app)
      .post('/api/dummy-seed')
    expect(response.statusCode).toBe(200);
    // not authorized
    expect(response.statusCode).not.toBe(401);
    // bad request
    expect(response.statusCode).not.toBe(400);
    // Database was not seeded
    expect(response.statusCode).not.toBe(403);
    // wait for it to be seeded
    await new Promise((r) => setTimeout(r, 20000));

  });
});


describe('Test the API endpoints with Shopping list CRUD as to check the functionality of the app. Some of the test cases need to be run in-order to achieve the right responses.', () => {
  let JWT_TOKEN = '';
  let testingShoppingListId = '';

  // login
  test('It should log as an admin', async () => {

    const response = await request(app)
      .post('/api/login')
      .send({ password: 'adminadmin', email: 'adminadmin@admin.com' });

    expect(response.statusCode).toBe(200);
    // not authorized
    expect(response.statusCode).not.toBe(401);
    // wrong parameters
    expect(response.statusCode).not.toBe(422);
    expect(response.body).toHaveProperty('token');
    JWT_TOKEN = response.body.token
  });

  // vytvoření záznamu (např. shoppingList/create)
  test('It should create a shopping list', async () => {
    const response = await request(app)
      .post('/api/shopping-list')
      .set('Authorization', `Bearer ${JWT_TOKEN}`)
      .send({ "title": "TESTING_SHOPPING_LIST" });

    expect(response.statusCode).toBe(201);
    // not authorized
    expect(response.statusCode).not.toBe(401);
    // wrong parameters
    expect(response.statusCode).not.toBe(422);
    expect(response.body).toEqual({
      "message": "Shopping list was successfully created."
    });
  });

  // poskytnutí seznamu datu (např. shoppingList/list)
  test('It should return all shopping lists', async () => {

    const response = await request(app)
      .get('/api/shopping-lists')
      .set('Authorization', `Bearer ${JWT_TOKEN}`)
    expect(response.statusCode).toBe(200);
    // not authorized
    expect(response.statusCode).not.toBe(401);
    expect(response.body[4]).toHaveProperty('_id');
    testingShoppingListId = response.body[4]['_id'];
  });

    // úpravu záznamu (např. shoppingList/update)
  test('It should update a shopping list', async () => {
    const response = await request(app)
      .patch(`/api/shopping-list/${testingShoppingListId}`)
      .set('Authorization', `Bearer ${JWT_TOKEN}`)
      .send({ "title": "UPDATED_TESTING_SHOPPING_LIST" });

    expect(response.statusCode).toBe(200);
    // not authorized
    expect(response.statusCode).not.toBe(401);
    // wrong parameters
    expect(response.statusCode).not.toBe(422);
    expect(response.body).toEqual({
      "message": "Shopping list was successfully updated."
    });
  });

  // vrácení jednoho záznamu (např. shoppingList/get)
  test('It should get a shopping list', async () => {
    const response = await request(app)
      .get(`/api/shopping-list/${testingShoppingListId}`)
      .set('Authorization', `Bearer ${JWT_TOKEN}`)
    expect(response.statusCode).toBe(200);
    // not authorized
    expect(response.statusCode).not.toBe(401);
    // wrong parameters
    expect(response.statusCode).not.toBe(422);
    expect(response.body).toHaveProperty("title", "UPDATED_TESTING_SHOPPING_LIST" );
  });

  // smazání záznamu (např. shoppingList/delete)
  test('It should delete a shopping list', async () => {
    const response = await request(app)
      .delete(`/api/shopping-list/${testingShoppingListId}`)
      .set('Authorization', `Bearer ${JWT_TOKEN}`)
    expect(response.statusCode).toBe(200);
    // not authorized
    expect(response.statusCode).not.toBe(401);
    // wrong parameters
    expect(response.statusCode).not.toBe(422);
    expect(response.body).toEqual({
      "message": "Shopping list was successfully deleted."
    });
  });
});
