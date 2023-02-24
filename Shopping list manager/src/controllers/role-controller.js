'use strict';

const Role = require('../models/role-model');
const { NotFoundError } = require('../utils/errors');

/**
 * Get one role depends on name or id
 * @param {String} id
 * @param {String} name
 * @returns {Object } role
 */
const getRole = async (id = undefined, name = undefined) => {
  let role = name ? await Role.findOne({ name }).lean() : await Role.findById(id).lean();
  if (!role) throw new NotFoundError("Role was not found.");
  return role;
};

/**
 * ADMIN: Get list of roles
 * @returns {Array[Object]} Roles
 */
const getRoles = async () => {
  return await Role.find().lean();
};

module.exports = { getRole, getRoles };
