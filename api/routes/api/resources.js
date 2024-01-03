const router = require('express').Router();

const { Resource, ResourceAttachment } = require('../../db/models');
const AwsS3 = require('../../utils/AwsS3');

const awsS3 = new AwsS3();

router.post(
  '/',
  awsS3.getMulter().array('attachments'),
  async (req, res, next) => {
    try {
      console.log(
        !req.user.permissions.find((perm) => perm.tabName === 'dispatch')
          .canAdmin
      );
      if (
        !req.user.isAdmin &&
        !req.user.permissions.find((perm) => perm.tabName === 'dispatch')
          .canAdmin
      ) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const { question, answer, enabled, attachmentMetaData } = req.body;
      const files = req.files || [];

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

      const resourceData = {
        question,
        answer,
        attachments: updatedAttachments,
      };

      if (typeof enabled !== 'undefined') {
        resourceData.enabled = enabled;
      }

      const resource = await Resource.create(resourceData, {
        include: [
          {
            model: ResourceAttachment,
            as: 'attachments',
          },
        ],
      });
      res.status(201).json(resource);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:resourceId',
  awsS3.getMulter().array('attachments'),
  async (req, res, next) => {
    try {
      if (
        !req.user.isAdmin &&
        !req.user.permissions.find((perm) => perm.tabName === 'dispatch')
          .canAdmin
      ) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const resourceId = req.params.resourceId;
      const { question, answer, enabled, attachmentMetaData } = req.body;

      if (question.length < 8 || (answer?.length !== 0 && answer.length < 8)) {
        return res.status(400).json({
          error: 'Question and answer must be at least 8 characters long',
        });
      }

      const resource = await Resource.findByPk(resourceId, {
        include: [{ model: ResourceAttachment, as: 'attachments' }],
      });

      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      if (attachmentMetaData?.length) {
        const updatedAttachments = await Promise.all(
          attachmentMetaData.map(async (attachmentData) => {
            const existingAttachment = resource.attachments.find(
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
              const newAttachment = await ResourceAttachment.create({
                name: attachmentData.name,
                type: attachmentData.type,
                resourceId: resource.id,
                key: findFileUpload.key,
                link: findFileUpload.location,
              });

              return newAttachment;
            }
          })
        );
      }

      const [rowsUpdated, [updatedResource]] = await Resource.update(
        {
          question: question,
          answer: answer,
          enabled: enabled,
        },
        {
          where: { id: resourceId },
          returning: true,
        }
      );

      if (rowsUpdated === 0) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      const finalResource = await Resource.findByPk(resourceId, {
        include: [{ model: ResourceAttachment, as: 'attachments' }],
      });

      res.status(200).json(finalResource);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:resourceId', async (req, res, next) => {
  try {
    const resourceId = req.params.resourceId;

    const resource = await Resource.findByPk(resourceId, {
      include: [{ model: ResourceAttachment, as: 'attachments' }],
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    for (const attachment of resource.attachments) {
      await awsS3.deleteFile(attachment.key);
    }

    await Resource.destroy({ where: { id: resourceId } });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.post('/:resourceId/swap', async (req, res, next) => {
  try {
    if (
      !req.user.isAdmin &&
      !req.user.permissions.find((perm) => perm.tabName === 'dispatch').canAdmin
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const resourceId = req.params.resourceId;
    const { swapPosition } = req.body;

    const resource = await Resource.findByPk(resourceId);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const swapResource = await Resource.findOne({
      where: { order: swapPosition },
    });
    if (!swapResource) {
      return res.status(404).json({ error: 'Resource to swap not found' });
    }

    const tempOrder = swapResource.order;

    swapResource.order = resource.order;
    resource.order = 0;
    await resource.save();
    await swapResource.save();
    resource.order = tempOrder;
    await resource.save();

    const updatedResource = await Resource.findByPk(resourceId);
    const swappedResource = await Resource.findOne({
      where: { order: swapResource.order },
    });

    res.status(200).json({
      message: 'Order positions swapped successfully',
      updatedResource,
      swappedResource,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const resources = await Resource.findAll({
      order: [['order', 'ASC']],
      include: [
        {
          model: ResourceAttachment,
          as: 'attachments',
        },
      ],
    });

    res.status(200).json(resources);
  } catch (error) {
    next(error);
  }
});

router.delete(
  '/:resourceId/attachments/:attachmentId',
  async (req, res, next) => {
    try {
      const resourceId = req.params.resourceId;
      const attachmentId = req.params.attachmentId;

      const resource = await Resource.findByPk(resourceId, {
        include: [{ model: ResourceAttachment, as: 'attachments' }],
      });

      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      const attachmentToDelete = resource.attachments.find(
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
