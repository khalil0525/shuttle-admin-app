const { Sequelize } = require('sequelize');
const db = require('../db');

const ResourceAttachment = db.define('resourceAttachment', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  link: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.ENUM('pdf', 'image'),
    allowNull: false,
  },
  key: { type: Sequelize.STRING, allowNull: false },
});

module.exports = ResourceAttachment;
