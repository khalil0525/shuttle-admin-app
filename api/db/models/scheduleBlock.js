const Sequelize = require("sequelize");
const db = require("../db");

const ScheduleBlock = db.define("scheduleBlock", {
  term: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  startTime: {
    type: Sequelize.TIME,
    allowNull: false,
  },
  endTime: {
    type: Sequelize.TIME,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  showOnBlocksheet: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  showOnTradeboard: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  tradeboardNote: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  ownerId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = ScheduleBlock;
