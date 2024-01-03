const Sequelize = require('sequelize');
const db = require('../db');

const Route = db.define('route', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  color: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'On or Close',
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = Route;
