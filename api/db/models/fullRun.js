const { Sequelize } = require('sequelize');
const db = require('../db');

const FullRun = db.define('fullRun', {
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  time: {
    type: Sequelize.TIME,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  passengersLeftBehind: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = FullRun;
