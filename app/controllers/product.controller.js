const Product = require('../models/product.model');

exports.create = (req, res, next) => {
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    quantity: req.body.quantity,
    productImage: {
      data: req.file.buffer,
      fileName: new Date().toISOString() + "-" + req.file.originalname,
      contentType: req.file.mimetype
    }
  });

  product.save()
    .then(data => {
      delete data.productImage;
      res.send({
        id: data._id,
        title: data.title,
        price: data.price,
        quantity: data.quantity,
        productImage: req.getUrl() + "/image/" + data._id
      })
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the product."
      });
    });

};

exports.findAll = (req, res) => {
  const url = req.getUrl();
  var projection = {
    __v: false,
    'productImage': false
  };
  Product.find({}, projection)
    .then(products => {
      const response = products.map((p) => {
        return {
          id: p._id,
          title: p.title,
          price: p.price,
          quantity: p.quantity,
          productImage: url + "/image/" + p._id
        }
      })
      res.send(response);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving products."
      });
    });
};

exports.findOne = (req, res) => {
  Product.findById(req.params.productId)
    .then(product => {
      if (!product) {
        return res.status(404).send({
          message: "product not found with id " + req.params.productId
        });
      }
      const response = {
        id: product._id,
        title: product.title,
        price: product.price,
        quantity: product.quantity,
        productImage: req.getUrl() + "/image/" + product._id
      }
      res.send(response);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "product not found with id " + req.params.productId
        });
      }
      return res.status(500).send({
        message: "Error retrieving product with id " + req.params.productId
      });
    });
};

exports.update = (req, res) => {
  Product.findByIdAndUpdate(req.params.productId, {
    title: req.body.title,
    price: req.body.price,
    quantity: req.body.quantity,
    productImage: {
      data: req.file.buffer,
      fileName: new Date().toISOString() + "-" + req.file.originalname,
      contentType: req.file.mimetype
    }
  },
    { new: true })
    .then(product => {
      if (!product) {
        return res.status(404).send({
          message: "product not found with id " + req.params.productId
        });
      }
      delete product.productImage;
      res.send({
        id: product._id,
        title: product.title,
        price: product.price,
        quantity: product.quantity,
        productImage: req.getUrl() + "/image/" + product._id
      })
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "product not found with id " + req.params.productId
        });
      }
      return res.status(500).send({
        message: "Error updating product with id " + req.params.productId
      });
    });
};

exports.delete = (req, res) => {
  Product.findByIdAndRemove(req.params.productId)
    .then(product => {
      if (!product) {
        return res.status(404).send({
          message: "product not found with id " + req.params.productId
        });
      }
      res.send({ message: "product deleted successfully!" });
    }).catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          message: "product not found with id " + req.params.productId
        });
      }
      return res.status(500).send({
        message: "Could not delete product with id " + req.params.productId
      });
    });
};