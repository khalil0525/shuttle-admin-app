const Sequelize = require('sequelize');
const db = require('../db');

const Permission = db.define('permission', {
  tabName: {
    type: Sequelize.ENUM('dispatch', 'training', 'whiteboard', 'website'),
    allowNull: false,
  },
  canView: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  canAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Permission;
