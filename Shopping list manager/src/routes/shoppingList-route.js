'use strict';

const express = require('express');
const router = express.Router();
const { body, param, matchedData } = require('express-validator');

const {
  createShoppingList,
  addUserAccessManagement,
  allShoppingLists,
  getShoppingList,
  updateShoppingList,
  deleteAccessManagerUser,
  deleteShoppingList,
} = require('../controllers/shoppingList-controller');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt } = require('../middleware/authentication');

const { isValidMongoId } = require('../utils/helpers');

router.post(
  '/shopping-list',
  checkJwt('getCurrentUser'),
  body('title').not().isEmpty().trim().escape().isLength({ min: 4, max: 255 }),
  body('accessManagement.*').trim().escape().custom((value) => isValidMongoId(value)).optional({ nullable: true }),
  validateRequest,
  async (req, res, next) => {
    try {
      const response = await createShoppingList(matchedData(req, { locations: ['body'] }), req.userId);

      if (response) res.status(201).send({ message: 'Shopping list was successfully created.' });
      else res.status(400).send({ message: 'Shopping list was not created.' });
    } catch (error) {
      next(error);
    }
  },
);

router.get('/shopping-lists', checkJwt('isAdmin'), async (req, res, next) => {
  try {
    const response = await allShoppingLists();

    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/shopping-lists/user/:userId',
  checkJwt('isOwnerOrAdmin'),
  param('userId').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const response = await allShoppingLists(userId);

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/shopping-list/:shoppingListId',
  checkJwt('hasAccess'),
  param('shoppingListId').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { shoppingListId } = req.params;
      const response = await getShoppingList(shoppingListId);

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/shopping-list/:shoppingListId/invite-user',
  checkJwt('isOwnerOrAdmin'),
  param('shoppingListId').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  body('userId').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { shoppingListId } = req.params;
      const response = await addUserAccessManagement(matchedData(req, { locations: ['body', 'param'] }), shoppingListId);
      if (response) res.status(201).send({ message: 'User was successfully added.' });
      else res.status(400).send({ message: 'User was not added.' });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/shopping-list/:shoppingListId',
  checkJwt('isOwnerOrAdmin'),
  param('shoppingListId').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  body('title').isString().trim().escape().isLength({ min: 4, max: 255 }),
  body('accessManagement.*').trim().escape().custom((value) => isValidMongoId(value)).optional({ nullable: true }),
  validateRequest,
  async (req, res, next) => {
    try {
      const { shoppingListId } = req.params;
      const validateData = matchedData(req, { locations: ['body', 'param'] });
      const response = await updateShoppingList(shoppingListId, validateData);

      if (response) res.status(200).send({ message: 'Shopping list was successfully updated.' });
      else res.status(400).send({ message: 'Shopping list was not updated.' });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/shopping-list/:shoppingListId/remove-user',
  checkJwt('isOwnerOrAdmin'),
  param('shoppingListId').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  body('accessManagement').not().isEmpty().trim().escape().custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { shoppingListId } = req.params;
      const validateData = matchedData(req, { locations: ['body', 'param'] });
      const response = await deleteAccessManagerUser(shoppingListId, validateData);
      if (response) res.status(200).send({ message: 'User was successfully removed from the shopping list.' });
      else res.status(400).send({ message: 'User was not removed from the shopping list.' });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/shopping-list/:shoppingListId',
  checkJwt('isOwnerOrAdmin'),
  param('shoppingListId').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { shoppingListId } = req.params;
      const response = await deleteShoppingList(shoppingListId);

      if (response) res.status(200).send({ message: 'Shopping list was successfully deleted.' });
      else res.status(400).send({ message: 'Shopping list was not deleted.'  });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = {
  shoppingListRoute: router,
};
