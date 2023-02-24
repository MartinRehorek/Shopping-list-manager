'use strict';

const ShoppingList = require('../models/shoppingList-model');

const { DUMMY_USER } = require('./dummyUser');

const DUMMY_SHOPPING_LIST = [
  new ShoppingList({
    title: 'POTRAVINY',
    userId: DUMMY_USER[0]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new ShoppingList({
    title: 'DM',
    userId: DUMMY_USER[0]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new ShoppingList({
    title: 'Bauhaus',
    userId: DUMMY_USER[1]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new ShoppingList({
    title: 'Boty',
    userId: DUMMY_USER[2]._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
];

module.exports = {
  DUMMY_SHOPPING_LIST,
};
