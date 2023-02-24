'use strict';

const ShoppingList = require('../models/shoppingList-model');
const User = require('../models/user-model');

const { ConflictError, NotFoundError, NoContentError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Create shopping list
 * @param {Object} data
 * @param {String} userId
 * @returns Boolean
 */
const createShoppingList = async (data, userId) => {
  const user = await User.findOne({ _id: userId }).lean();
  if (!user) throw new NotFoundError("User was not found.");
  if (data.accessManagement?.length) {
    const accessManagement = await User.find({ _id: { $in: data.accessManagement } }).lean();
    if (accessManagement.length === 0) throw new NotFoundError("No users with these ids were found.");
  }
  data.userId = userId;
  const shoppingList = new ShoppingList(data);

  return await shoppingList
    .save()
    .then(async () => {
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: { shoppingLists: shoppingList },
        },
      );
      return true;
    })
    .catch((error) => {
      logger.error(error);
      return false;
    });
};

/**
 * Add user to the shopping list
 * @param {Object} data
 * @param {String} shoppingListId
 * @returns Boolean
 */
const addUserAccessManagement = async (data, shoppingListId) => {
  const shoppingList = await ShoppingList.exists({ _id: shoppingListId });
  if (!shoppingList) throw new ConflictError('Shopping list was not found.');

  const user = await User.findOne({ _id: data.userId }).lean();
  if (!user) throw new NotFoundError("User was not found.");

  const foundUser = await ShoppingList.find( { _id: shoppingListId ,accessManagement: { $in : data.userId }  });
  if (foundUser.length !== 0) throw new ConflictError('User is already in this shopping list.');

  const response = await ShoppingList.findOneAndUpdate(
    { _id: shoppingListId },
    {
      $push: { accessManagement: data.userId },
    },
  );
  return response ? true : false;
};

/**
 * Get all shopping lists for all users or by userId
 * @param {String} userId
 * @returns Array[Object]
 */
const allShoppingLists = async (userId) => {
  let shoppingLists = null;
  if (userId) {
    const user = await User.findOne({ _id: userId }).lean();
    if (!user) throw new NotFoundError("User was not found.");

    shoppingLists = await ShoppingList.find({ userId }).populate({ path: 'items' }).populate({ path: 'accessManagement' }).lean();
  } else shoppingLists = await ShoppingList.find().populate({ path: 'items' }).populate({ path: 'accessManagement' }).lean();
  return shoppingLists;
};

/**
 * Get one shopping list
 * @param {String} shoppingListId
 * @returns Object
 */
const getShoppingList = async (shoppingListId) => {
  const shoppingList = await ShoppingList.findOne({ _id: shoppingListId }).populate({ path: 'items' }).populate({ path: 'accessManagement' }).lean();
  if (!shoppingList) throw new NotFoundError("Shopping list was not found.");

  return shoppingList;
};

/**
 * Update shopping list
 * @param {String} shoppingListId
 * @param {Object} data
 * @returns Boolean
 */
const updateShoppingList = async (shoppingListId, data) => {
  const shoppingList = await ShoppingList.findOne({ _id: shoppingListId }).lean();
  if (!shoppingList) throw new NotFoundError("Shopping list was not found.");
  if (data?.accessManagement?.length > 0) {
    const accessManagement = await User.find({ _id: { $in: data.accessManagement } }).lean();
    if (accessManagement.length === 0) throw new NotFoundError("No users with these ids were found.");
  }

  const updatedShoppingList = await ShoppingList.findOneAndUpdate({ _id: shoppingListId }, data, { new: true });
  return updatedShoppingList ? true : false;
};

/**
 * Remove users from the shopping list
 * @param {String} shoppingListId
 * @param {Object} data
 * @returns Boolean
 */
const deleteAccessManagerUser = async (shoppingListId, data) => {
  const shoppingList = await ShoppingList.findOne({ _id: shoppingListId }).lean();
  if (!shoppingList) throw new NotFoundError("Shopping list was not found.");

  const response = await ShoppingList.findOneAndUpdate({ _id: shoppingListId }, { $pull: { accessManagement: data.accessManagement }});
  return response ? true : false;
};

/**
 * Delete one shopping list
 * @param {String} shoppingListId
 * @returns Boolean
 */
const deleteShoppingList = async (shoppingListId) => {
  const shoppingList = await ShoppingList.findOne({ _id: shoppingListId }).lean();
  if (!shoppingList) throw new NotFoundError("Shopping List doesn't exists");
  const response = await ShoppingList.deleteOne({ _id: shoppingListId });

  if (response) {
    await User.findOneAndUpdate({ _id: shoppingList.userId }, { $pull: { shoppingLists: shoppingListId }});
    return true;
  } else return false;
};

module.exports = {
  createShoppingList,
  addUserAccessManagement,
  allShoppingLists,
  getShoppingList,
  updateShoppingList,
  deleteAccessManagerUser,
  deleteShoppingList,
};
