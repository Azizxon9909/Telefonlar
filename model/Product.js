const mongoose = require("mongoose");
const DbProduct = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  memory: {
    type: Number,
    required: true,
  },
  sale: Number,
  like: {
    type: Number,
    default: 0,
  },
  dateNow: {
    type: Date,
    default: Date.now,
  },
  comment: {
      type:String,
      minlength: 10
  },
  color:{
    type:String,
    required: true
  },
  author: {
    type: String
  },
  tel: {
    type: String
  },
  photo: String
});
module.exports = mongoose.model('product', DbProduct);
