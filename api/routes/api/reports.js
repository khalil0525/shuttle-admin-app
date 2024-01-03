const router = require('express').Router();
const { DispatchReport, FullRun, User } = require('../../db/models');

router.post('/', async (req, res) => {
  try {
    const { dateOfDispatch, report, fullRuns } = req.body;

    if (!req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!dateOfDispatch || !report) {
      return res
        .status(400)
        .json({ message: 'Required fields need to be filled out' });
    }

    const requiredReportFields = [
      'timeOfDispatchStart',
      'timeOfDispatchEnd',
      'onCallExperience',
      'hasFullRuns',
      'requiresFollowUp',
    ];

    const missingFields = requiredReportFields.filter(
      (field) => report[field] === ''
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Invalid report: Missing required fields - ${missingFields.join(
          ', '
        )}`,
      });
    }

    if (
      report.onCallExperience !== 'Nothing/Entirely Uneventful' &&
      !report.additionalComments
    ) {
      return res.status(400).json({
        message:
          'Invalid report: additional comments is required for the selected onCallExperience',
      });
    }

    const dispatchReport = await DispatchReport.create({
      dateOfDispatch,
      ...report,
      userId: req.user.id,
    });

    if (!dispatchReport) {
      return res.status(500).json({ error: 'Failed to create DispatchReport' });
    }

    if (fullRuns && fullRuns.length > 0) {
      const fullRunsData = fullRuns.map((fullRun) => ({
        ...fullRun,
        date: dateOfDispatch,
        dispatchReportId: dispatchReport.id,
        userId: req.user.id,
      }));
      await FullRun.bulkCreate(fullRunsData);
    }

    return res.status(201).json({ dispatchReport });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const dispatchReport = await DispatchReport.findByPk(req.params.id);

    if (!dispatchReport) {
      return res.status(404).json({ error: 'Dispatch Report not found' });
    }

    await dispatchReport.destroy();

    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/', async (req, res) => {
  try {
    const dispatchReports = await DispatchReport.findAll({
      include: [
        {
          model: User,
          attributes: ['email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const formattedDispatchReports = dispatchReports.map((report) => ({
      ...report.dataValues,
      userEmail: report.user.email,
    }));

    return res.status(200).json({ dispatchReports: formattedDispatchReports });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/full-run', async (req, res) => {
  try {
    const fullRuns = await FullRun.findAll({
      include: [
        {
          model: User,
          attributes: ['email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const formattedFullRuns = fullRuns.map((run) => ({
      ...run.dataValues,
      userEmail: run.user.email,
    }));

    return res.status(200).json({ fullRuns: formattedFullRuns });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/full-run', async (req, res) => {
  try {
    const { date, time, name, passengersLeftBehind } = req.body;

    if (!req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!date || !time || !name || passengersLeftBehind === undefined) {
      return res
        .status(400)
        .json({ message: 'Required fields need to be filled out' });
    }

    const fullRun = await FullRun.create({
      date,
      time,
      name,
      passengersLeftBehind,
      userId: req.user.id,
    });

    if (!fullRun) {
      return res.status(500).json({ error: 'Failed to create Full Run' });
    }

    return res.status(201).json({ fullRun });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.delete('/full-run/:id', async (req, res) => {
  try {
    const fullRun = await FullRun.findByPk(req.params.id);

    if (!fullRun) {
      return res.status(404).json({ error: 'Full Run not found' });
    }

    await fullRun.destroy();

    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;
