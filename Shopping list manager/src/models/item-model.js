'use strict';

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 255,
      minlength: 4,
      trim: true,
      unique: false,
    },
    url: {
      type: String,
      required: false,
      maxlength: 255,
      minlength: 4,
      trim: true,
      unique: false,
    },
    amount: {
      type: Number,
      min: 0,
      max: 100000,
      required: false,
    },
    isBought: {
      type: Boolean,
      required: true,
    },
    shoppingListId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'shoppingListId',
      select: true,
    },
  },
  { timestamps: true },
);

itemSchema.virtual('shoppingList', {
  ref: 'ShoppingList',
  localField: 'shoppingListId',
  foreignField: '_id',
  justOne: true,
});

itemSchema.set('toObject', {
  virtuals: true,
});
itemSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Item', itemSchema, 'item');
