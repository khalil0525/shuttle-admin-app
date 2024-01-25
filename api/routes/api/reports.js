const router = require("express").Router();
const {
  UserDispatchFollowUp,
  DispatchReport,
  User,
  FullRun,
} = require("../../db/models");

router.post("/", async (req, res) => {
  try {
    const { dateOfDispatch, report, fullRuns } = req.body;

    if (!req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (!dateOfDispatch || !report) {
      return res
        .status(400)
        .json({ message: "Required fields need to be filled out" });
    }

    const requiredReportFields = [
      "timeOfDispatchStart",
      "timeOfDispatchEnd",
      "onCallExperience",
      "hasFullRuns",
      "requiresFollowUp",
    ];

    const missingFields = requiredReportFields.filter(
      (field) => report[field] === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Invalid report: Missing required fields - ${missingFields.join(
          ", "
        )}`,
      });
    }

    if (
      report.onCallExperience !== "Nothing/Entirely Uneventful" &&
      !report.additionalComments
    ) {
      return res.status(400).json({
        message:
          "Invalid report: additional comments is required for the selected onCallExperience",
      });
    }

    const dispatchReport = await DispatchReport.create({
      dateOfDispatch,
      ...report,
      userId: req.user.id,
    });

    if (!dispatchReport) {
      return res.status(500).json({ error: "Failed to create DispatchReport" });
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
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const dispatchReport = await DispatchReport.findByPk(req.params.id);

    if (!dispatchReport) {
      return res.status(404).json({ error: "Dispatch Report not found" });
    }

    await dispatchReport.destroy();

    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/", async (req, res) => {
  try {
    const dispatchReports = await DispatchReport.findAll({
      order: [["createdAt", "DESC"]],
    });

    const formattedDispatchReports = [];

    for (const report of dispatchReports) {
      const userDispatchFollowUp = await UserDispatchFollowUp.findOne({
        where: { dispatchReportId: report.id },
      });

      const creatorUser = dispatchReports
        ? await User.findByPk(report.userId, {
            attributes: ["id", "name", "email"],
          })
        : null;

      const resolvedBy = userDispatchFollowUp
        ? await User.findByPk(userDispatchFollowUp.userId, {
            attributes: ["id", "name", "email"],
          })
        : null;

      formattedDispatchReports.push({
        ...report.dataValues,
        creatorUser,
        resolvedBy,
      });
    }

    return res.status(200).json({ dispatchReports: formattedDispatchReports });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/full-run", async (req, res) => {
  try {
    const fullRuns = await FullRun.findAll({
      include: [
        {
          model: User,
          attributes: ["email", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formattedFullRuns = fullRuns.map((run) => ({
      ...run.dataValues,
      userEmail: run.user.email,
    }));

    return res.status(200).json({ fullRuns: formattedFullRuns });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/full-run", async (req, res) => {
  try {
    const { date, time, name, passengersLeftBehind } = req.body;

    if (!req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (!date || !time || !name || passengersLeftBehind === undefined) {
      return res
        .status(400)
        .json({ message: "Required fields need to be filled out" });
    }

    const fullRun = await FullRun.create({
      date,
      time,
      name,
      passengersLeftBehind,
      userId: req.user.id,
    });

    if (!fullRun) {
      return res.status(500).json({ error: "Failed to create Full Run" });
    }

    return res.status(201).json({ fullRun });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.delete("/full-run/:id", async (req, res) => {
  try {
    const fullRun = await FullRun.findByPk(req.params.id);

    if (!fullRun) {
      return res.status(404).json({ error: "Full Run not found" });
    }

    await fullRun.destroy();

    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/resolve/:dispatchReportId", async (req, res) => {
  try {
    const { dispatchReportId } = req.params;

    if (
      !req.user?.isAdmin &&
      !req.user?.permissions?.find((perm) => perm.tabName === "dispatch")
        ?.canAdmin
    ) {
      return res
        .status(403)
        .json({ error: "Access denied. Admin rights required." });
    }

    const followUp = await UserDispatchFollowUp.findOne({
      where: {
        userId: req.user.id,
        dispatchReportId,
      },
    });

    let updatedDispatchReport;

    if (!followUp) {
      const newFollowUp = await UserDispatchFollowUp.create({
        userId: req.user.id,
        dispatchReportId,
      });

      const updatedFollowUp = await UserDispatchFollowUp.findByPk(
        newFollowUp.id
      );

      updatedDispatchReport = await DispatchReport.findByPk(dispatchReportId, {
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"],
            through: {
              model: UserDispatchFollowUp,
              attributes: [],
            },
            as: "users",
          },
        ],
      });
    } else {
      if (followUp.userId !== req.user.id) {
        return res.status(403).json({
          error: "Access denied. You can only delete your own follow-up.",
        });
      }

      await followUp.destroy();

      updatedDispatchReport = await DispatchReport.findByPk(dispatchReportId, {
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"],
            through: {
              model: UserDispatchFollowUp,
              attributes: [],
            },
            as: "users",
          },
        ],
      });
    }

    const resolvedBy = updatedDispatchReport.users[0];

    const responseObject = {
      dispatchReport: {
        ...updatedDispatchReport.dataValues,
        resolvedBy: resolvedBy ? resolvedBy : null,
      },
    };

    return res.status(200).json(responseObject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
