const { Sequelize } = require('sequelize');
const db = require('../db');

const TrainerResource = db.define('trainerResource', {
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

TrainerResource.beforeCreate(async (trainerResource) => {
  const lastOrder = await TrainerResource.max('order');
  trainerResource.order = lastOrder !== null ? lastOrder + 1 : 1;
});

TrainerResource.beforeUpdate(async (trainerResource, options) => {
  if (trainerResource.changed('enabled') && !trainerResource.enabled) {
    const trainerResourcesToUpdate = await TrainerResource.findAll({
      where: {
        order: {
          [Sequelize.Op.gt]: trainerResource.order,
        },
      },
    });

    await Promise.all(
      trainerResourcesToUpdate.map(async (trainerResourceToUpdate) => {
        trainerResourceToUpdate.order -= 1;
        await trainerResourceToUpdate.save({
          transaction: options.transaction,
        });
      })
    );
  }
});
TrainerResource.deleteFAQ = async (faqId) => {
  const trainerResource = await TrainerResource.findByPk(faqId);

  if (trainerResource) {
    const orderToDelete = trainerResource.order;

    await trainerResource.destroy();

    const trainerResourceToUpdate = await TrainerResource.findAll({
      where: {
        order: {
          [Sequelize.Op.ne]: orderToDelete,
        },
      },
      order: [['order', 'ASC']],
    });

    let currentOrder = 1;

    for (const trainerResourceToUpdate of trainerResourceToUpdate) {
      trainerResourceToUpdate.order = currentOrder++;
      await trainerResourceToUpdate.save();
    }
  }
};

module.exports = TrainerResource;
