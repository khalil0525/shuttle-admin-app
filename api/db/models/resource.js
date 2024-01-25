const { Sequelize } = require("sequelize");
const db = require("../db");

const Resource = db.define("resource", {
  question: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  answer: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  order: {
    type: Sequelize.INTEGER,

    unique: true,
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

Resource.beforeCreate(async (resource) => {
  const lastOrder = await Resource.max("order");
  resource.order = lastOrder !== null ? lastOrder + 1 : 1;
});

Resource.beforeUpdate(async (resource, options) => {
  if (resource.changed("enabled") && !resource.enabled) {
    const resourcesToUpdate = await Resource.findAll({
      where: {
        order: {
          [Sequelize.Op.gt]: resource.order,
        },
      },
    });

    await Promise.all(
      resourcesToUpdate.map(async (resourceToUpdate) => {
        resourceToUpdate.order -= 1;
        await resourceToUpdate.save({ transaction: options.transaction });
      })
    );
  }
});
Resource.deleteResource = async (resourceId) => {
  const resource = await Resource.findByPk(resourceId);

  if (resource) {
    const orderToDelete = resource.order;

    await resource.destroy();

    const resourcesToUpdate = await Resource.findAll({
      where: {
        order: {
          [Sequelize.Op.ne]: orderToDelete,
        },
      },
      order: [["order", "ASC"]],
    });

    let currentOrder = 1;

    for (const resourceToUpdate of resourcesToUpdate) {
      resourceToUpdate.order = currentOrder++;
      await resourceToUpdate.save();
    }
  }
};

module.exports = Resource;
