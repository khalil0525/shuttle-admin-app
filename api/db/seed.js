const db = require('./db');
const { User, Route } = require('./models');
require('dotenv').config();

async function seed() {
  await db.sync({ force: true });
  console.log('db synced!');
  const PrimaryAdmin = await User.create({
    email: 'collinskhalil@hotmail.com',
    password: 'gggabc123',
    isAdmin: true,
  });

  const TesterAdmin = await User.create({
    email: 'testeradmin@test.com',
    password: 'gggabc123',
    isAdmin: true,
  });
  const TesterUser = await User.create({
    email: 'testeruser@test.com',
    password: 'gggabc123',
    isAdmin: false,
  });
}

async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}
if (module === require.main) {
  runSeed();
}
