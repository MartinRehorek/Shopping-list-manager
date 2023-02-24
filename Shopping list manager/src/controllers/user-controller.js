'use strict';

const User = require('../models/user-model');
const ShoppingList = require('../models/shoppingList-model');
const Item = require('../models/item-model');

const { getRole } = require('./role-controller');

const { ConflictError, NotFoundError, NotAuthorizedError } = require('../utils/errors');
const { ROLE } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Register a user
 * @param {Object} data
 * @returns Boolean
 */
const registerUser = async (data) => {
  const userExists = await User.exists({ email: data.email });
  if (userExists) {
    throw new ConflictError('User already exists.');
  }

  const role = await getRole(undefined, ROLE.user);
  data.roleId = role._id;
  const user = new User(data);

  return await user
    .save()
    .then(async () => {
      return true;
    })
    .catch((error) => {
      logger.error(error);
      return false;
    });
};

/**
 * ADMIN ONLY: Used to create a user with admin rights
 * @param {Object} data
 * @returns {Boolean}
 */
const createUser = async (data) => {
  const userExists = await User.exists({ email: data.email });
  if (userExists) {
    throw new ConflictError('User exists.');
  }
  const checkRole = await getRole(data.roleId, undefined);
  if (!checkRole) {
    throw new NotFoundError("Role doesn't exist.");
  }
  const user = new User(data);

  return await user
    .save()
    .then(async () => {
      return true;
    })
    .catch((error) => {
      logger.error(error);
      return false;
    });
};

/**
 * ADMIN ONLY: Get list of users
 * @returns {Array[Object]} users
 */
const allUsers = async () => {
  return await User.find().populate({ path: 'role' }).populate({ path: 'shoppingLists' }).lean();
};

/**
 * Get user by id
 * @param {String} userId
 * @returns {Object } user
 */
const getUser = async (userId) => {
  const user = await User.findOne({ _id: userId })
    .lean()
    .populate([{ path: 'role' }])
    .populate({ path: 'shoppingLists' });

  if (!user) throw new NotFoundError("User was not found.");

  return user;
};

/**
 * Get user by id
 * @param {String} userId
 * @returns {Object } user
 */
 const getUserByEmail = async (email) => {
  const user = await User.findOne({ email: email }, { _id: 1, roleId: 0, email: 1}).lean();

  if (!user) throw new NotFoundError("User was not found.");

  return user;
};

/**
 * ADMIN & THE SAME USER: Update user
 * @param {String} userId
 * @param {Object} data
 * @param {Boolean} isAdmin
 * @returns Boolean
 */
const updateUser = async (userId, data, isAdmin) => {
  const user = await User.findOne({ _id: userId }).lean();
  if (!user) throw new NotFoundError("User was not found.");
  let newData;

  // ADMIN: Update role
  if (isAdmin && data?.roleId) {
    const role = await getRole(data.roleId, undefined);
    delete data.role;

    newData = {
      ...data,
      roleId: role._id,
    };
  } else if (isAdmin === undefined && data?.roleId) throw new NotAuthorizedError('Not authorized to update user.');
  else {
    newData = data;
  }

  const updatedUser = await User.findOneAndUpdate({ _id: userId }, newData, { new: true });
  return updatedUser ? true: false;
};

/**
 * ADMIN & THE SAME USER: Delete user
 * @param {String} userId
 * @returns Boolean
 */
const deleteUser = async (userId) => {
  const user = await User.findOne({ _id: userId }).lean();
  if (!user) throw new NotFoundError("User doesn't exist.");
  const response = await User.deleteOne({ email: user.email });

  if (response) {
    const shoppingLists =  await ShoppingList.find({ userId }).lean()

    shoppingLists?.map(async list => {
      await ShoppingList.deleteOne({ _id: list._id });

      list.items?.map(async item => {
        await Item.deleteMany({ _id: { $in: item } });
      })
    })

    user?.shoppingLists.map(async (list) => {
      await ShoppingList.findOneAndUpdate(
        { _id: list.toString() },
        {
          $pull: { accessManagement: userId },
        },
      );
    });

    return true;
  } else return false;
};;

module.exports = { registerUser, createUser, allUsers, getUser, getUserByEmail, updateUser, deleteUser };
