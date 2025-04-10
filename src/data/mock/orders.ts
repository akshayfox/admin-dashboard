import { faker } from '@faker-js/faker';

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  product: {
    name: string;
    price: number;
    quantity: number;
  };
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  totalAmount: number;
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const statuses: Order['status'][] = ['pending', 'processing', 'completed', 'cancelled'];
const paymentMethods: Order['paymentMethod'][] = ['credit_card', 'paypal', 'bank_transfer'];

export function generateOrders(count: number = 100): Order[] {
  return Array.from({ length: count }, () => {
    const quantity = faker.number.int({ min: 1, max: 5 });
    const price = parseFloat(faker.commerce.price({ min: 100, max: 1000 }));
    
    return {
      id: faker.string.uuid(),
      orderNumber: faker.string.alphanumeric({ length: 8, casing: 'upper' }),
      customer: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
      },
      product: {
        name: faker.commerce.productName(),
        price: price,
        quantity: quantity,
      },
      status: faker.helpers.arrayElement(statuses),
      paymentMethod: faker.helpers.arrayElement(paymentMethods),
      totalAmount: price * quantity,
      createdAt: faker.date.recent({ days: 30 }).toISOString(),
      shippingAddress: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
      },
    };
  });
}

// Generate a fixed set of orders
export const mockOrders = generateOrders(100);
