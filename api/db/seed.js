const db = require('./db');
const { User, Route } = require('./models');

async function seed() {
  console.log(process.env.DB_DATABASE);
  await db.sync({ force: true });
  console.log('db synced!');
  const PrimaryAdmin = await User.create({
    email: 'tech@occtransport.org',
    password: 'OCCTtech986@!',
    isAdmin: true,
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
