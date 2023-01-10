const faker = require('faker');
faker.locale = 'es';

function generateFakeProducts(n) {
  let fakeProducts = [];
  for (let index = 0; index < n; index++) {
    const fakeProduct = {
      title: faker.commerce.product(),
      price: faker.commerce.price(10, 10000),
      thumbnail: faker.image.abstract(200, 200, true),
    };
    fakeProducts.push(fakeProduct);
  }
  return fakeProducts;
}

module.exports = generateFakeProducts;
