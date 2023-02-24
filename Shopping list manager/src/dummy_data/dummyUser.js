'use strict';

const User = require('../models/user-model');

const { DUMMY_ROLE } = require('./dummyRole');

const DUMMY_USER = [
  // password: adminadmin
  new User({
    name: 'ADMIN',
    surname: 'ADMIN',
    email: 'adminadmin@admin.com',
    encrypt_password:
      'c1cd73124d6e99377a5d3ec12619eae2eb6d90e31e6f7159e880e1022090c30c7c50bfdd73ca484e27c4215e353b0d804e4d5bf3e5ff314b4fe58308f2a56173',
    roleId: DUMMY_ROLE[0]._id,
    salt: '507027d1-1c96-4109-b15e-a24126532afd',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  // password: robert
  new User({
    name: 'Robert',
    surname: 'Liny',
    email: 'robertliny@lenoch.com',
    encrypt_password:
      'd6257dc78ad7b02347ad747eb2a7ecad8a4129caebacee828c9faa5b524d35124dfdd4a64e27328fb33f24250ae0f896d46e28f0d29d488cd04a3ec1e18e0ad5',
    roleId: DUMMY_ROLE[1]._id,
    salt: '48290342-19d6-4d9a-a5d1-e188bb10c9ac',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  // password: martin
  new User({
    name: 'Martin',
    surname: 'Rehorek',
    email: 'martinrehorek@gmail.com',
    encrypt_password:
      '45d3a31fa85296176c1105c9e917723de8839293ba58d9ddd4e79fca3070cacc4e8cedaa631b0c65c8e51c32928a37471f915421c231eb4be8e899cf63cd1ef5',
    roleId: DUMMY_ROLE[1]._id,
    salt: '4b0255ac-dffd-46d8-938f-446a30961765',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
];

module.exports = {
  DUMMY_USER,
};
