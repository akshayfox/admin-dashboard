import { faker } from '@faker-js/faker';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive' | 'suspended';
  lastActive: string;
  joinedAt: string;
  location: {
    city: string;
    country: string;
  };
  orders: number;
  totalSpent: number;
}

const roles: User['role'][] = ['admin', 'user', 'manager'];
const statuses: User['status'][] = ['active', 'inactive', 'suspended'];

export function generateUsers(count: number = 100): User[] {
  return Array.from({ length: count }, () => {
    const orders = faker.number.int({ min: 0, max: 50 });
    const avgOrderValue = faker.number.int({ min: 50, max: 500 });
    
    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      role: faker.helpers.arrayElement(roles),
      status: faker.helpers.arrayElement(statuses),
      lastActive: faker.date.recent({ days: 7 }).toISOString(),
      joinedAt: faker.date.past({ years: 2 }).toISOString(),
      location: {
        city: faker.location.city(),
        country: faker.location.country(),
      },
      orders: orders,
      totalSpent: orders * avgOrderValue,
    };
  });
}

// Generate a fixed set of users
export const mockUsers = generateUsers(100);
