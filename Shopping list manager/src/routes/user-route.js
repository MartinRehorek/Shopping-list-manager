'use strict';

const express = require('express');
const router = express.Router();
const { body, param, matchedData } = require('express-validator');

const {
  registerUser,
  createUser,
  updateUser,
  deleteUser,
  allUsers,
  getUser,
  getUserByEmail,
} = require('../controllers/user-controller');

const { validateRequest } = require('../middleware/validate-request');
const { checkJwt } = require('../middleware/authentication');

const { isValidMongoId } = require('../utils/helpers');

router.post(
  '/user/register',
  body('email').not().isEmpty().trim().escape().isEmail(),
  body('name').not().isEmpty().trim().escape().isLength({ min: 2, max: 255 }),
  body('surname').not().isEmpty().trim().escape().isLength({ min: 2, max: 255 }),
  body('password').not().isEmpty().isString().trim().escape().isLength({ min: 4 }),
  validateRequest,
  async (req, res, next) => {
    try {
      const response = await registerUser(matchedData(req, { locations: ['body'] }));

      if (response) res.status(201).send({ message: 'User was successfully registered.' });
      else res.status(400).send({ message: 'User was not registered.' });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/user/create',
  checkJwt('isAdmin'),
  body('name').isString().trim().escape().isLength({ min: 2, max: 255 }),
  body('surname').isString().trim().escape().isLength({ min: 2, max: 255 }),
  body('email').not().isEmpty().trim().escape().isEmail(),
  body('password').not().isEmpty().isString().trim().escape().isLength({ min: 4 }),
  body('roleId').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const response = await createUser(matchedData(req, { locations: ['body'] }));

      if (response) res.status(201).send({ message: 'User was successfully created.' });
      else res.status(400).send({ message: 'User was not created.' });
    } catch (error) {
      next(error);
    }
  },
);

router.get('/users', checkJwt('isAdmin'), async (req, res, next) => {
  try {
    const response = await allUsers();
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/user',
  checkJwt('getCurrentUser'),
  async (req, res, next) => {
    try {
      const response = await getUser(req.userId);
      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/user/invite',
  checkJwt(),
  body('email').not().isEmpty().trim().escape().isEmail(),
  validateRequest,
  async (req, res, next) => {
    try {
      const validateData = matchedData(req, { locations: ['body', 'param'] });
      const response = await getUserByEmail(validateData.email);

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
);


router.get(
  '/user/:userId',
  checkJwt('isAdmin'),
  param('userId').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const response = await getUser(userId);

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/user/:userId',
  checkJwt('isOwnerOrAdmin'),
  param('userId').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  body('name').isString().trim().escape().isLength({ min: 2, max: 255 }).optional({ nullable: true }),
  body('surname').isString().trim().escape().isLength({ min: 2, max: 255 }).optional({ nullable: true }),
  body('email').trim().escape().isEmail().optional({ nullable: true }),
  body('password').isString().trim().escape().isLength({ min: 4 }).optional({ nullable: true }),
  body('roleId').isString().trim().escape().optional({ nullable: true }).custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const validateData = matchedData(req, { locations: ['body', 'param'] });
      const response = await updateUser(userId, validateData, req.isAdmin);

      if (response) res.status(200).send({ message: 'User was successfully updated.' });
      else res.status(400).send({ message: 'User was not updated.' });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/user/:userId',
  checkJwt('isOwnerOrAdmin'),
  param('userId').not().isEmpty().isString().trim().escape().custom((value) => isValidMongoId(value)),
  validateRequest,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const response = await deleteUser(userId);

      if (response) res.status(204).send({ message: 'User was successfully deleted.' });
      else res.status(400).send({ message: 'User was not deleted.' });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = {
  userRoute: router,
};
