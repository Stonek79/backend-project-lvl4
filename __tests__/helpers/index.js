// @ts-check

import faker from 'faker';

const fakeUser = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

const fakeTask = () => ({
  name: faker.lorem.word(),
  description: faker.lorem.paragraph(),
  statusId: '1',
  executorId: '1',
  creatorId: 1,
});

const fakeStatus = () => ({
  name: faker.lorem.word(),
});

const fakeLabel = () => ({
  name: faker.lorem.word(),
});

export {
  fakeUser, fakeTask, fakeStatus, fakeLabel,
};
