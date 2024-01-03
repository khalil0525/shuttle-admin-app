const router = require('express').Router();
const { Sequelize } = require('sequelize');
const { Image } = require('../../db/models');
const AwsS3 = require('../../utils/AwsS3');
const awsS3 = new AwsS3();

router.get('/random', async (req, res, next) => {
  try {
    const randomImages = await Image.findAll({
      order: Sequelize.literal('random()'),
    });
    if (!randomImages?.length) {
      return res.status(404).json({ error: 'No images found' });
    }

    res.status(200).json(randomImages[0]);
  } catch (error) {
    next(error);
  }
});
router.get('/', async (req, res, next) => {
  try {
    const images = await Image.findAll();

    if (!images || images.length === 0) {
      return res.status(404).json({ error: 'No images found' });
    }

    res.status(200).json(images);
  } catch (error) {
    next(error);
  }
});

router.post('/', awsS3.getMulter().single('file'), async (req, res, next) => {
  try {
    if (
      !req.user.isAdmin &&
      !req.user.permissions.find((perm) => perm.tabName === 'website').canAdmin
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { type = 'login' } = req.body;

    console.log(req.file);
    const newImage = await Image.create({
      link: req.file.location,
      key: req.file.key,
      type,
    });

    res.status(201).json(newImage);
  } catch (error) {
    next(error);
  }
});

router.delete('/:imageId', async (req, res, next) => {
  try {
    if (
      !req.user.isAdmin &&
      !req.user.permissions.find((perm) => perm.tabName === 'website').canAdmin
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const imageId = req.params.imageId;

    const imageToDelete = await Image.findByPk(imageId);

    if (!imageToDelete) {
      return res.status(404).json({ error: 'Image not found' });
    }

    await awsS3.deleteFile(imageToDelete.key);

    await imageToDelete.destroy();

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
