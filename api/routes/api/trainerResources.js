const router = require('express').Router();

const {
  TrainerResource,
  TrainerResourceAttachment,
} = require('../../db/models');
const AwsS3 = require('../../utils/AwsS3');

const awsS3 = new AwsS3();

router.post(
  '/',
  awsS3.getMulter().array('attachments'),
  async (req, res, next) => {
    try {
      console.log(
        !req.user.permissions.find((perm) => perm.tabName === 'training')
          .canAdmin
      );
      if (
        !req.user.isAdmin &&
        !req.user.permissions.find((perm) => perm.tabName === 'training')
          .canAdmin
      ) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const { question, answer, enabled, attachmentMetaData } = req.body;

      if (question.length < 8 || (answer?.length !== 0 && answer.length < 8)) {
        return res.status(400).json({
          error: 'Question and answer must be at least 8 characters long',
        });
      }

      const updatedAttachments = await Promise.all(
        req.files.map(async (file) => {
          const props = attachmentMetaData.find(
            (entry) => entry.originalName === file.originalname
          );

          return {
            name: props.name,
            link: file.location,
            type: props.type,
            key: file.key,
          };
        })
      );

      const TrainerResourceData = {
        question,
        answer,
        attachments: updatedAttachments,
      };

      if (typeof enabled !== 'undefined') {
        TrainerResourceData.enabled = enabled;
      }

      const trainerResource = await TrainerResource.create(
        TrainerResourceData,
        {
          include: [
            {
              model: TrainerResourceAttachment,
              as: 'attachments',
            },
          ],
        }
      );
      res.status(201).json(trainerResource);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:trainerResourceId',
  awsS3.getMulter().array('attachments'),
  async (req, res, next) => {
    try {
      if (
        !req.user.isAdmin &&
        !req.user.permissions.find((perm) => perm.tabName === 'training')
          .canAdmin
      ) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const trainerResourceId = req.params.trainerResourceId;
      const { question, answer, enabled, attachmentMetaData } = req.body;

      if (question.length < 8 || (answer?.length !== 0 && answer.length < 8)) {
        return res.status(400).json({
          error: 'Question and answer must be at least 8 characters long',
        });
      }

      const trainerResource = await TrainerResource.findByPk(
        trainerResourceId,
        {
          include: [{ model: TrainerResourceAttachment, as: 'attachments' }],
        }
      );

      if (!trainerResource) {
        return res.status(404).json({ error: 'Trainer Resource not found' });
      }

      if (attachmentMetaData?.length) {
        const updatedAttachments = await Promise.all(
          attachmentMetaData.map(async (attachmentData) => {
            const existingAttachment = trainerResource.attachments.find(
              (attachment) =>
                parseInt(attachment.id) === parseInt(attachmentData.id)
            );

            const findFileUpload = req.files.find(
              (entry) => entry.originalname === attachmentData?.originalName
            );

            if (existingAttachment || attachmentData.originalName === null) {
              existingAttachment.name = attachmentData.name;
              existingAttachment.type = attachmentData.type;
              existingAttachment.link = findFileUpload
                ? findFileUpload.location
                : existingAttachment.link;
              existingAttachment.key = findFileUpload
                ? findFileUpload.key
                : existingAttachment.key;
              await existingAttachment.save();
              return existingAttachment;
            } else {
              const newAttachment = await TrainerResourceAttachment.create({
                name: attachmentData.name,
                type: attachmentData.type,
                trainerResourceId: trainerResource.id,
                key: findFileUpload.key,
                link: findFileUpload.location,
              });

              return newAttachment;
            }
          })
        );
      }

      const [rowsUpdated, [updatedTrainerResource]] =
        await TrainerResource.update(
          {
            question: question,
            answer: answer,
            enabled: enabled,
          },
          {
            where: { id: trainerResourceId },
            returning: true,
          }
        );

      if (rowsUpdated === 0) {
        return res.status(404).json({ error: 'TrainerResource not found' });
      }

      const finalTrainerResource = await TrainerResource.findByPk(
        trainerResourceId,
        {
          include: [{ model: TrainerResourceAttachment, as: 'attachments' }],
        }
      );

      res.status(200).json(finalTrainerResource);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:trainerResourceId', async (req, res, next) => {
  try {
    const trainerResourceId = req.params.trainerResourceId;

    const trainerResource = await TrainerResource.findByPk(trainerResourceId, {
      include: [{ model: TrainerResourceAttachment, as: 'attachments' }],
    });

    if (!trainerResource) {
      return res.status(404).json({ error: 'TrainerResource not found' });
    }

    for (const attachment of trainerResource.attachments) {
      await awsS3.deleteFile(attachment.key);
    }

    await TrainerResource.destroy({ where: { id: trainerResourceId } });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.post('/:trainerResourceId/swap', async (req, res, next) => {
  try {
    if (
      !req.user.isAdmin &&
      !req.user.permissions.find((perm) => perm.tabName === 'training').canAdmin
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const trainerResourceId = req.params.trainerResourceId;
    const { swapPosition } = req.body;

    const trainerResource = await TrainerResource.findByPk(trainerResourceId);
    if (!trainerResource) {
      return res.status(404).json({ error: 'TrainerResource not found' });
    }

    const swapTrainerResource = await TrainerResource.findOne({
      where: { order: swapPosition },
    });
    if (!swapTrainerResource) {
      return res
        .status(404)
        .json({ error: 'TrainerResource to swap not found' });
    }

    const tempOrder = swapTrainerResource.order;

    swapTrainerResource.order = trainerResource.order;
    trainerResource.order = 0;
    await trainerResource.save();
    await swapTrainerResource.save();
    trainerResource.order = tempOrder;
    await trainerResource.save();

    const updateTrainerResource = await TrainerResource.findByPk(
      trainerResourceId
    );
    const swappedTrainerResource = await TrainerResource.findOne({
      where: { order: swapTrainerResource.order },
    });

    res.status(200).json({
      message: 'Order positions swapped successfully',
      updateTrainerResource,
      swappedTrainerResource,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const trainerResources = await TrainerResource.findAll({
      order: [['order', 'ASC']],
      include: [
        {
          model: TrainerResourceAttachment,
          as: 'attachments',
        },
      ],
    });

    res.status(200).json(trainerResources);
  } catch (error) {
    next(error);
  }
});

router.delete(
  '/:trainerResourceId/attachments/:attachmentId',
  async (req, res, next) => {
    try {
      const trainerResourceId = req.params.trainerResourceId;
      const attachmentId = req.params.attachmentId;

      const trainerResource = await TrainerResource.findByPk(
        trainerResourceId,
        {
          include: [{ model: TrainerResourceAttachment, as: 'attachments' }],
        }
      );

      if (!trainerResource) {
        return res.status(404).json({ error: 'TrainerResource not found' });
      }

      const attachmentToDelete = trainerResource.attachments.find(
        (attachment) => attachment.id === parseInt(attachmentId)
      );

      if (!attachmentToDelete) {
        return res.status(404).json({ error: 'Attachment not found' });
      }

      await awsS3.deleteFile(attachmentToDelete.key);

      await attachmentToDelete.destroy();

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);
module.exports = router;
