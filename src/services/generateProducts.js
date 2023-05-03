import { faker } from "@faker-js/faker";

export const generateProducts = async () => {
  let products = [];
  for (let i = 0; i < 100; i++) {
    const product = {
      id: i + 1,
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      code: faker.helpers.slugify(faker.commerce.productName()),
      price: parseFloat(faker.commerce.price()),
      stock: faker.datatype.number({ min: 1, max: 100 }),
      status: faker.datatype.boolean(),
      category: faker.commerce.department(),
      thumbnails: [faker.image.imageUrl()],
    };
    let uniqueCode = faker.helpers.slugify(faker.commerce.productName());
    while (products.some((p) => p.code === uniqueCode)) {
      uniqueCode = faker.helpers.slugify(faker.commerce.productName());
    }
    product.code = uniqueCode;
    products.push(product);
  }
  return products;
};
