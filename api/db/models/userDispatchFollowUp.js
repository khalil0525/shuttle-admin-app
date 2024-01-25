const Sequelize = require('sequelize');
const db = require('../db');

const UserDispatchFollowUp = db.define(
  'userDispatchFollowUp',
  {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    dispatchReportId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'dispatchReportId'],
      },
    ],
  }
);

module.exports = UserDispatchFollowUp;
