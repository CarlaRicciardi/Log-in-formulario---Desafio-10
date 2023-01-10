const contenedorMongoDB = require('../classContainer/contenedorMongoDB.js');
const modelProducts = require('../models/modelProducts.js');

class ProductosDaoMongoDB extends contenedorMongoDB {
  constructor() {
    super({
      name: 'productos',
      schema: modelProducts.ProductsSchema,
    });
  }
}

module.exports = ProductosDaoMongoDB;
