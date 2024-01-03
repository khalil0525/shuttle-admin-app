const Sequelize = require('sequelize');
const db = require('../db');

const DispatchRouteLog = db.define('dispatchRouteLog', {
  routeId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  entityType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  actionType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  data: {
    type: Sequelize.JSON,
    allowNull: true,
  },
  changedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = DispatchRouteLog;
