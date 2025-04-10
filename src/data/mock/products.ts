import { faker } from '@faker-js/faker';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  reviews: number;
  sales: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Toys',
  'Beauty',
  'Health',
];

export function generateProducts(count: number = 100): Product[] {
  return Array.from({ length: count }, () => {
    const stock = faker.number.int({ min: 0, max: 1000 });
    const sales = faker.number.int({ min: 0, max: 500 });
    let status: Product['status'];
    
    if (stock === 0) status = 'out_of_stock';
    else if (stock < 10) status = 'low_stock';
    else status = 'in_stock';

    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      image: faker.image.urlLoremFlickr({ category: 'product' }),
      category: faker.helpers.arrayElement(categories),
      price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      stock: stock,
      rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
      reviews: faker.number.int({ min: 0, max: 500 }),
      sales: sales,
      status: status,
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      updatedAt: faker.date.recent({ days: 30 }).toISOString(),
    };
  });
}

// Generate a fixed set of products
export const mockProducts = generateProducts(100);
