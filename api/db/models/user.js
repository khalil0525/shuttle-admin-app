const Sequelize = require('sequelize');
const db = require('../db');
const crypto = require('crypto');
const Permission = require('./permission'); // Import the Permission model

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  photoURL: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      min: 6,
    },
    allowNull: false,
    get() {
      return () => this.getDataValue('password');
    },
  },
  salt: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue('salt');
    },
  },
});

User.prototype.correctPassword = function (password) {
  return User.encryptPassword(password, this.salt()) === this.password();
};

User.createSalt = function () {
  return crypto.randomBytes(16).toString('base64');
};

User.encryptPassword = function (plainPassword, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainPassword)
    .update(salt)
    .digest('hex');
};

const setSaltAndPassword = (user) => {
  if (user.changed('password')) {
    user.salt = User.createSalt();
    user.password = User.encryptPassword(user.password(), user.salt());
  }
};

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);
User.beforeBulkCreate((users) => {
  users.forEach(setSaltAndPassword);
});

User.afterCreate(async (user) => {
  const tabs = ['dispatch', 'training', 'whiteboard', 'website'];

  // Create permission entries for each tab
  for (const tabName of tabs) {
    await Permission.create({
      tabName,
      canView: false,
      canAdmin: false,
      userId: user.id,
    });
  }
});

module.exports = User;
