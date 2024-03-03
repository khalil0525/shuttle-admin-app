const db = require("./db");
const { User, Route, ScheduleBlock } = require("./models");

async function seed() {
  console.log(process.env.DB_DATABASE);
  await db.sync({ force: true });
  console.log("db synced!");

  const PrimaryAdmin = await User.create({
    email: "tech@occtransport.org",
    password: "OCCTtech986@!",
    isAdmin: true,
  });
  const SecondaryAdmin = await User.create({
    email: "bytesizedcoder@gmail.com",
    password: "OCCTtech986@!",
    isAdmin: true,
  });
  // Sample ScheduleBlock data
  const scheduleBlocksData = [
    {
      id: 2,
      name: "Test 1",
      type: "campusShuttle",
      term: "Summer 2024",
      date: "2024-02-07",
      startTime: "08:00:00",
      endTime: "12:00:00",
      ownerId: SecondaryAdmin.id,
      description: "",
      showOnTradeboard: false,
      showOnBlocksheet: true,
    },

    {
      id: 3,
      name: "Test 2222",
      type: "dispatch",
      date: "2024-02-07",
      startTime: "14:00:00",
      endTime: "18:00:00",
      ownerId: SecondaryAdmin.id,
      term: "Summer 2024",
      description: "",
      showOnTradeboard: false,
      showOnBlocksheet: true,
    },

    {
      id: 4,
      name: "Test Block 33333333",
      type: "training",
      date: "2024-02-06",
      startTime: "10:00:00",
      endTime: "15:00:00",
      ownerId: SecondaryAdmin.id,
      term: "Summer 2024",
      description: "",
      showOnTradeboard: false,
      showOnBlocksheet: true,
    },
    {
      id: 5,
      name: "Test Block 4",
      type: "charter",
      date: "2024-02-06",
      startTime: "16:00:00",
      endTime: "20:00:00",
      ownerId: SecondaryAdmin.id,
      term: "Summer 2024",
      description: "",
      showOnTradeboard: false,
      showOnBlocksheet: true,
    },

    {
      id: 6,
      term: "Summer 2024",
      name: "Test Block 5",
      type: "lift",
      date: "2024-02-08",
      startTime: "09:00:00",
      endTime: "14:00:00",
      ownerId: PrimaryAdmin.id,

      description: "",
      showOnTradeboard: false,
      showOnBlocksheet: true,
    },
    {
      id: 7,
      name: "Test Block 677323",
      type: "training",
      date: "2024-02-10",
      startTime: "15:00:00",
      endTime: "19:00:00",
      ownerId: PrimaryAdmin.id,
      term: "Summer 2024",
      description: "",
      showOnTradeboard: false,
      showOnBlocksheet: true,
    },
    {
      id: 8,
      name: "Test Block 621212",
      type: "preTripCampusShuttle",
      date: "2024-02-09",
      startTime: "15:00:00",
      endTime: "19:00:00",
      ownerId: PrimaryAdmin.id,
      term: "Summer 2024",
      description: "",
      showOnTradeboard: false,
      showOnBlocksheet: true,
    },
    {
      id: 9,
      name: "Test Block 6",
      type: "preTripBlueBus",
      date: "2024-02-08",
      startTime: "15:00:00",
      endTime: "19:00:00",
      ownerId: PrimaryAdmin.id,
      term: "Summer 2024",
      description: "",
      showOnTradeboard: false,
      showOnBlocksheet: true,
    },
    {
      id: 12,
      name: "Test 1",
      type: "lateNiteDispatch",
      term: "Summer 2024",
      date: "2024-02-07",
      startTime: "08:00:00",
      endTime: "12:00:00",
      ownerId: SecondaryAdmin.id,
      description: "",
      showOnTradeboard: false,
      showOnBlocksheet: true,
    },

    {
      id: 13,
      name: "Test 2222",
      type: "monitor",
      date: "2024-02-07",
      startTime: "14:00:00",
      endTime: "18:00:00",
      ownerId: SecondaryAdmin.id,
      term: "Summer 2024",
      description: "",
      showOnTradeboard: false,
      showOnBlocksheet: true,
    },

    {
      id: 14,
      name: "Test Block 33333333",
      type: "training",
      date: "2024-02-06",
      startTime: "10:00:00",
      endTime: "15:00:00",
      ownerId: SecondaryAdmin.id,
      term: "Summer 2024",
      description: "",
      showOnTradeboard: false,
      showOnBlocksheet: true,
    },
    {
      id: 15,
      name: "Test Block 4",
      type: "charter",
      date: "2024-02-06",
      startTime: "16:00:00",
      endTime: "20:00:00",
      ownerId: SecondaryAdmin.id,
      term: "Summer 2024",
      description: "",
      showOnTradeboard: false,
      showOnBlocksheet: true,
    },

    {
      id: 16,
      term: "Summer 2024",
      name: "Test Block 5",
      type: "lift",
      date: "2024-02-08",
      startTime: "09:00:00",
      endTime: "14:00:00",
      ownerId: PrimaryAdmin.id,

      description: "",
      showOnTradeboard: false,
      showOnBlocksheet: true,
    },
    {
      id: 17,
      name: "Test Block 637323",
      type: "whiteboard",
      date: "2024-02-11",
      startTime: "15:00:00",
      endTime: "19:00:00",
      ownerId: PrimaryAdmin.id,
      term: "Summer 2024",
      description: "",
      showOnTradeboard: false,
      showOnBlocksheet: true,
    },
    {
      id: 18,
      name: "Test Block 62133212",
      type: "coordinator",
      date: "2024-02-04",
      startTime: "15:00:00",
      endTime: "19:00:00",
      ownerId: PrimaryAdmin.id,
      term: "Summer 2024",
      description: "",
      showOnTradeboard: false,
      showOnBlocksheet: true,
    },
    {
      id: 19,
      name: "Test Block 6",
      type: "whiteboard",
      date: "2024-02-08",
      startTime: "15:00:00",
      endTime: "19:00:00",
      ownerId: PrimaryAdmin.id,
      term: "Summer 2024",
      description: "",
      showOnTradeboard: false,
      showOnBlocksheet: true,
    },
  ];

  // Create ScheduleBlocks
  for (const blockData of scheduleBlocksData) {
    await ScheduleBlock.create(blockData);
  }
}

async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

if (module === require.main) {
  runSeed();
}
