'use strict';

const express = require('express');
const router = express.Router();
const { body, param, matchedData, check } = require('express-validator');

const {
  createItems,
  allItems,
  getItemByShoppingListId,
  updateItem,
  deleteItems,
} = require('../controllers/item-controller');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt } = require('../middleware/authentication');
const { isValidMongoId } = require('../utils/helpers');

router.post(
  '/shopping-list/:shoppingListId/items',
  checkJwt('hasAccess'),
  param('shoppingListId').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  check('items.*.name').not().isEmpty().trim().escape().isLength({ min: 4, max: 255 }),
  check('items.*.url').isString().trim().escape().isLength({ min: 4, max: 255 }).optional({ nullable: true }),
  check('items.*.amount').isNumeric().trim().escape().isLength({ min: 0, max: 100000 }).optional({ nullable: true }),
  check('items.*.isBought').not().isEmpty().isBoolean(),
  validateRequest,
  async (req, res, next) => {
    try {
      const { shoppingListId } = req.params;
      const response = await createItems(matchedData(req, { locations: ['body'] }), shoppingListId);
      console.log(matchedData(req, { locations: ['body'] }), shoppingListId);
      if (response) res.status(201).send({ message: 'Given items were successfully added to the shopping list.' });
      else res.status(400).send({ message: 'Given items were not added to the shopping list.' });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/shopping-list/:shoppingListId/items',
  checkJwt('hasAccess'),
  param('shoppingListId').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { shoppingListId } = req.params;
      const response = await allItems(shoppingListId);

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/shopping-list/:shoppingListId/item/:itemId',
  checkJwt('hasAccess'),
  param('shoppingListId').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  param('itemId').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { shoppingListId, itemId } = req.params;
      const response = await getItemByShoppingListId(shoppingListId, itemId);

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/shopping-list/:shoppingListId/item/:itemId',
  checkJwt('hasAccess'),
  param('shoppingListId').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  param('itemId').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  body('name').isString().trim().escape().isLength({ min: 4, max: 255 }).optional({ nullable: true }),
  body('url').isString().trim().escape().isLength({ min: 4, max: 255 }).optional({ nullable: true }),
  body('amount').isNumeric().trim().escape().isLength({ min: 0, max: 100000 }).optional({ nullable: true }),
  body('isBought').isBoolean().optional({ nullable: true }),
  validateRequest,
  async (req, res, next) => {
    try {
      const { shoppingListId, itemId } = req.params;
      const response = await updateItem(shoppingListId, itemId, matchedData(req, { locations: ['body', 'param'] }));

      if (response) res.status(200).send({ message: 'Item was successfully updated.' });
      else res.status(400).send({ message: 'Item was not updated.' });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/shopping-list/:shoppingListId/items',
  checkJwt('hasAccess'),
  param('shoppingListId').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  body('itemIds.*').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { shoppingListId } = req.params;
      const response = await deleteItems(shoppingListId, matchedData(req, { locations: ['body', 'param'] }));

      if (response) res.status(200).send({ message: 'Items were successfully deleted.' });
      else res.status(400).send({ message: 'Items were not deleted.' });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = {
  itemRoute: router,
};
