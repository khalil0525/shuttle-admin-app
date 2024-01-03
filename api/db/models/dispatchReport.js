const { Sequelize } = require('sequelize');
const db = require('../db');

const DispatchReport = db.define('dispatchReport', {
  dateOfDispatch: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  timeOfDispatchStart: {
    type: Sequelize.TIME,
    allowNull: false,
  },
  timeOfDispatchEnd: {
    type: Sequelize.TIME,
    allowNull: false,
  },
  onCallExperience: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  additionalComments: {
    type: Sequelize.TEXT,
  },
  hasFullRuns: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  requiresFollowUp: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = DispatchReport;
