const { Sequelize } = require('sequelize');
const db = require('../db');

const Image = db.define('Image', {
  link: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  key: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.ENUM('login'),
    defaultValue: 'login',
    allowNull: false,
  },
});

module.exports = Image;
