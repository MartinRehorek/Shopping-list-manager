'use strict';

const express = require('express');
const createDummyData = require('../controllers/seeder-controller');
const env = require('env-var');

const router = express.Router();

/**
 * SEEDER for dummy data
 */
router.post('/dummy-seed', (req, res, next) => {
  try {
    if (env.get('NODE_ENV').required().asString() === 'development' || env.get('NODE_ENV').required().asString() === 'test') {
      createDummyData();
      res.status(200).send({ message: 'Database was successfully seeded.' });
    } else {
      res.status(403).send({ message: 'Database was not seeded.' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = {
  dummySeedRoute: router,
};
