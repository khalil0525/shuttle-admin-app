const Sequelize = require('sequelize');

const crypto = require('crypto');
const db = require('../db');
const User = require('./user');
const Invite = db.define('invite', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  lastEmailSent: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  lastEmailSuccess: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.INTEGER,
  },
  activated: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
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

Invite.prototype.correctPassword = function (password) {
  return Invite.encryptPassword(password, this.salt()) === this.password();
};
Invite.createSalt = function () {
  return crypto.randomBytes(16).toString('base64');
};
Invite.encryptPassword = function (plainPassword, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainPassword)
    .update(salt)
    .digest('hex');
};

const setSaltAndPassword = (invite) => {
  if (invite.changed('password')) {
    invite.salt = Invite.createSalt();
    invite.password = Invite.encryptPassword(invite.password(), invite.salt());
  }
};

Invite.beforeCreate(setSaltAndPassword);
Invite.beforeUpdate(setSaltAndPassword);
Invite.beforeBulkCreate((invites) => {
  invites.forEach(setSaltAndPassword);
});

module.exports = Invite;
