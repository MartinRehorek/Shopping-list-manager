'use strict';

const env = require('env-var');
const MongoClient = require('mongodb').MongoClient;

const { DUMMY_ROLE } = require('../dummy_data/dummyRole');
const { DUMMY_USER } = require('../dummy_data/dummyUser');
const { DUMMY_SHOPPING_LIST } = require('../dummy_data/dummyShoppingList');
const { DUMMY_ITEMS } = require('../dummy_data/dummyItem');

const logger = require('../utils/logger');

const { BadRequestError } = require('../utils/errors');

/**
 * Seed DB
 */
const createDummyData = async () => {
  const mongoUri = env.get('MONGO_URI_DOCKER_SEED').required().asUrlString();
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();

    logger.info('Connected correctly to the Database.');

    // Create Collections
    const roleCollection = client.db('bs_ha_03').collection('role');
    const userCollection = client.db('bs_ha_03').collection('user');
    const shoppingListCollection = client.db('bs_ha_03').collection('shoppingList');
    const itemCollection = client.db('bs_ha_03').collection('item');
    const collections = await client.db('bs_ha_03').collections();

    // Drop Collections if exists
    if (collections.length !== 0) {
      try {
        await Promise.all(
          Object.values(collections).map(async (collection) => {
            await collection.deleteMany({});
          }),
        );
      } catch (error) {
        logger.error(`Database dropping had problems: ${error}`);
        throw new BadRequestError('Database dropping had problems');
      }
    }

    await roleCollection.insertMany(DUMMY_ROLE);
    await userCollection.insertMany(DUMMY_USER);
    await shoppingListCollection.insertMany(DUMMY_SHOPPING_LIST);
    await itemCollection.insertMany(DUMMY_ITEMS);

    userCollection.findOneAndUpdate(
      { email: 'adminadmin@admin.com' },
      {
        $set: {
          shoppingLists: [DUMMY_SHOPPING_LIST[0]._id, DUMMY_SHOPPING_LIST[1]._id],
        },
      },
    );
    userCollection.findOneAndUpdate(
      { email: 'robertliny@lenoch.com' },
      {
        $set: {
          shoppingLists: [DUMMY_SHOPPING_LIST[2]._id],
        },
      },
    );
    userCollection.findOneAndUpdate(
      { email: 'martinrehorek@gmail.com' },
      {
        $set: {
          shoppingLists: [DUMMY_SHOPPING_LIST[3]._id],
        },
      },
    );

    shoppingListCollection.findOneAndUpdate(
      { title: 'POTRAVINY' },
      {
        $set: {
          items: [
            DUMMY_ITEMS[0]._id,
            DUMMY_ITEMS[1]._id,
            DUMMY_ITEMS[2]._id,
            DUMMY_ITEMS[3]._id,
          ],
          accessManagement: [DUMMY_USER[1]._id, DUMMY_USER[2]._id],
        },
      },
    );
    shoppingListCollection.findOneAndUpdate(
      { title: 'DM' },
      {
        $set: {
          items: [DUMMY_ITEMS[4]._id, DUMMY_ITEMS[5]._id],
          accessManagement: [DUMMY_USER[1]._id],
        },
      },
    );
    shoppingListCollection.findOneAndUpdate(
      { title: 'Bauhaus' },
      {
        $set: {
          items: [DUMMY_ITEMS[6]._id, DUMMY_ITEMS[7]._id, DUMMY_ITEMS[8]._id],
          accessManagement: [DUMMY_USER[2]._id],
        },
      },
    );

    logger.info('Database has been seeded successfully.');
  } catch (err) {
    logger.error(`Database seeding has been unsuccessful: ${err}`);
    throw new BadRequestError('Database seeding has been unsuccessful');
  }
};

module.exports = createDummyData;
