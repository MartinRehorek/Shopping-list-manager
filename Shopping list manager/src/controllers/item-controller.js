'use strict';

const ShoppingList = require('../models/shoppingList-model');
const Item = require('../models/item-model');

const { ConflictError, NotFoundError, NoContentError } = require('../utils/errors');

/**
 * BULK OPERATION: Create multiple items to a shopping list
 * @param {Array[Object]} data
 * @param {String} shoppingListId
 * @returns Boolean
 */
const createItems = async (data, shoppingListId) => {
  const shoppingList = await ShoppingList.exists({ _id: shoppingListId });
  if (!shoppingList) throw new ConflictError(`Shopping List with id: ${shoppingListId} does not exist.`);

  const items = data.items.map((item) => ({ ...item, shoppingListId }));

  const response = await Item.insertMany(items);
  if (!response) return false;

  await ShoppingList.findOneAndUpdate({ _id: shoppingListId },{ $push: { items: response }});
  return true;
};

/**
 * List all shopping list items by id
 * @param {String} shoppingListId
 * @returns Array[Object]
 */
const allItems = async (shoppingListId) => {
  const shoppingList = await ShoppingList.findOne({ _id: shoppingListId }).lean();
  if (!shoppingList) throw new NotFoundError(`Shopping List with id: ${shoppingListId} does not exist.`);

  const items = await Item.find({ shoppingListId }).lean();
  if (items.length === 0) throw new NoContentError(`No items were found in shopping list with id: ${shoppingListId} .`);
  return items;
};

/**
 * Get ona item by shopping list id
 * @param {String} shoppingListId
 * @param {String} itemId
 * @returns Object
 */
const getItemByShoppingListId = async (shoppingListId, itemId) => {
  const item = await Item.findOne({ _id: itemId, shoppingListId }).lean();
  if (!item) throw new NotFoundError(`No item was found with id: ${itemId} .`);

  return item;
};

/**
 * Update item by shopping list id and item id
 * @param {String} shoppingListId
 * @param {String} itemId
 * @param {Object} data
 * @returns Boolean
 */
const updateItem = async (shoppingListId, itemId, data) => {
  const item = await Item.findOne({ _id: itemId, shoppingListId }).lean();
  if (!item) throw new NotFoundError(`No item was found with id: ${itemId} .`);
  const updatedItem = await Item.findOneAndUpdate({ _id: itemId, shoppingListId }, data, { new: true });

  if (updatedItem) return true;
  else return false;
};

/**
 * BULK OPERATION: Delete multiple items from shopping list by id
 * @param {String} shoppingListId
 * @param {Array[String]} data
 * @returns Boolean
 */
const deleteItems = async (shoppingListId, data) => {
  const shoppingList = await Item.find({ _id: { $in: data.itemIds } }).lean();
  if (shoppingList.length === 0) throw new NotFoundError(`No items was found with id: ${data.itemIds} .`);
  const response = await Item.deleteMany({ _id: { $in: data.itemIds } });

  if (response) {
    shoppingList.map(async (item) => {
      await ShoppingList.findOneAndUpdate({ _id: shoppingListId }, { $pull: { items: item._id }})});

    return true;
  } else return false;
};

module.exports = {
  createItems,
  allItems,
  getItemByShoppingListId,
  updateItem,
  deleteItems,
};
