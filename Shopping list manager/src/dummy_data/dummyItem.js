'use strict';

const { DUMMY_SHOPPING_LIST } = require('./dummyShoppingList');
const Item = require('../models/item-model');


const DUMMY_ITEMS = [
  new Item({
    name: 'Jablko',
    url: 'https://nakup.itesco.cz/groceries/cs-CZ/products/2001014948058',
    amount: 20,
    isBought: false,
    shoppingListId: DUMMY_SHOPPING_LIST[0]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Item({
    name: 'Mrkev',
    amount: 2,
    isBought: false,
    url: 'https://nakup.itesco.cz/groceries/cs-CZ/products/2001012691581',
    shoppingListId: DUMMY_SHOPPING_LIST[0]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Item({
    name: 'Brambory',
    isBought: false,
    url: 'https://nakup.itesco.cz/groceries/cs-CZ/products/2001012819923',
    shoppingListId: DUMMY_SHOPPING_LIST[0]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Item({
    name: 'Relax Džus 100% rajče 1l',
    isBought: true,
    url: 'https://nakup.itesco.cz/groceries/cs-CZ/products/2001011242364',
    shoppingListId: DUMMY_SHOPPING_LIST[0]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Item({
    name: 'Kartacek',
    isBought: false,
    amount: 3,
    shoppingListId: DUMMY_SHOPPING_LIST[1]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Item({
    name: 'Zubni Pasta',
    amount: 1,
    isBought: false,
    shoppingListId: DUMMY_SHOPPING_LIST[1]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Item({
    name: 'Drevo',
    isBought: false,
    shoppingListId: DUMMY_SHOPPING_LIST[2]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Item({
    name: 'Lak',
    isBought: false,
    shoppingListId: DUMMY_SHOPPING_LIST[2]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Item({
    name: 'Hrebiky',
    isBought: true,
    amount: 100,
    url: 'https://www.bauhaus.cz/tipy-od-profesionala/naradi-a-stroje/hrebiky',
    shoppingListId: DUMMY_SHOPPING_LIST[2]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
];

module.exports = {
  DUMMY_ITEMS,
};
