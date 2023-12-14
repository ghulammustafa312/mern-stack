// src/seed.ts

import * as mongoose from 'mongoose';
import { UserModel } from '../users/entities/user.entity';
import { faker } from '@faker-js/faker';

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mern-stack');
    const createRandomUser = () => {
      return {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password:
          '$2b$10$7GGD29Og6ARZbY299LPgheav9XqL5INj7QNlHeOPZHGCAK9pxKVbC', // hashed password for Test111@
        addresses: [
          {
            addressLine1: faker.location.streetAddress(),
            addressLine2: faker.location.secondaryAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            country: faker.location.country(),
          },
        ],
        role: 'USER',
        phoneNo: faker.phone.number(),
      };
    };
    const users = await faker.helpers.multiple(createRandomUser, {
      count: 10000,
    });
    const batchPromises = [];
    for (let i = 0; i < users.length; i += 1000) {
      const currentBatch = users.slice(i, i + 1000);
      batchPromises.push(UserModel.insertMany(currentBatch));
    }
    await Promise.all(batchPromises);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
