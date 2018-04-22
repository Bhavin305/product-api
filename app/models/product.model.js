const mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

const productSchema = new Schema({
  productId: ObjectId,
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  productImage: {
    data: {
      type: Buffer,
      required: true
    },
    contentType: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
  }
});

module.exports = mongoose.model('Product', productSchema);