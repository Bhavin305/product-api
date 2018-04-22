const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLB
} = require('graphql/type');

const Product = require('../app/models/product.model');

const productType = new GraphQLObjectType({
  name: 'products',
  description: 'products',
  fields: () => ({
    productId: {
      type: GraphQLString,
      description: 'The product id.',
    },
    title: {
      type: GraphQLString,
      description: 'The product title.',
    },
    price: {
      type: (GraphQLInt),
      description: 'The product price.',
    },
    quantity: {
      type: (GraphQLInt),
      description: 'The product quantity'
    },
    productImage: {
      type: GraphQLString,
      description: 'The product image url'
    }
  })
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      products: {
        type: new GraphQLList(productType),
        resolve: () => {
          var projection = {
            __v: false
          };
          const products = new Promise((resolve, reject) => {
            Product.find({}, projection)
              .then(products => {
                const response = products.map((p) => {
                  return {
                    productId: p._id,
                    title: p.title,
                    price: p.price,
                    quantity: p.quantity,
                    productImage: 'http://127.0.0.1:3000' + "/image/" + p._id
                  }
                });
                resolve(response);
              }).catch(err => {
                reject({
                  message: err.message || "Some error occurred while retrieving products."
                })
              });
          })
          return products;
        }
      }
    }
  })
});

module.exports = schema;