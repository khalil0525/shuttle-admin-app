const Sequelize = require("sequelize");
const db = require("../db");

const ServiceUpdate = db.define("serviceUpdate", {
	type: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	serviceUpdateText: {
		type: Sequelize.STRING,
		allowNull: true,
	},

	expiration: {
		type: Sequelize.DATE,
		allowNull: true,
	},
	isSecondUpdate: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
});

module.exports = ServiceUpdate;
