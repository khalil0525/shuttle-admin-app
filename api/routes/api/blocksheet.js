const router = require("express").Router();
const { ScheduleBlock, User } = require("../../db/models");
const { Op } = require("sequelize");
const dayjs = require("dayjs");
router.post("/", async (req, res, next) => {
  try {
    const { block } = req.body;

    // Check for conflicting entries for the user in the same week
    const conflictingBlocks = await ScheduleBlock.findAll({
      where: {
        ownerId: block.ownerId,
        date: {
          [Op.between]: [
            dayjs(block.date).startOf("week").toDate(),
            dayjs(block.date).endOf("week").toDate(),
          ],
        },
        [Op.or]: [
          {
            startTime: {
              [Op.between]: [block.startTime, block.endTime],
            },
          },
          {
            endTime: {
              [Op.between]: [block.startTime, block.endTime],
            },
          },
        ],
      },
    });

    if (conflictingBlocks.length > 0) {
      return res
        .status(400)
        .json({ error: "Conflicting schedule blocks found." });
    }

    const scheduleBlock = await ScheduleBlock.create({
      ...block,
    });

    res.status(201).json({ scheduleBlock });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const scheduleBlocks = await ScheduleBlock.findAll({
      include: {
        model: User,

        attributes: ["name", "id"],
      },
    });
    res.status(200).json({ scheduleBlocks });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
router.get("/tradeboard", async (req, res, next) => {
  try {
    const tradeBoardBlocks = await ScheduleBlock.findAll({
      where: {
        showOnTradeboard: true,
        showOnBlocksheet: true,
      },
      include: {
        model: User,

        attributes: ["name", "id"],
      },
    });
    res.status(200).json({ tradeBoardBlocks });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/blocks/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const currentDate = dayjs();
    const startOfWeek = currentDate.startOf("week").format("YYYY-MM-DD");
    const endOfWeek = currentDate.endOf("week").format("YYYY-MM-DD");
    console.log(startOfWeek, endOfWeek);
    const scheduleBlocks = await ScheduleBlock.findAll({
      where: {
        ownerId: userId,
        date: {
          [Op.between]: [startOfWeek, endOfWeek],
        },
      },
      include: {
        model: User,

        attributes: ["name", "id"],
      },
    });

    if (!scheduleBlocks || scheduleBlocks.length === 0) {
      return res.status(404).json({
        error: "No schedule blocks found for the specified user and date range",
      });
    }

    return res.status(200).json({ scheduleBlocks });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/sheet", async (req, res, next) => {
  try {
    const currentDate = dayjs();
    const startOfPreviousWeek = currentDate
      .subtract(1, "week")
      .startOf("week")
      .format("YYYY-MM-DD");
    const endOfNextWeek = currentDate
      .add(1, "week")
      .endOf("week")
      .format("YYYY-MM-DD");
    console.log(startOfPreviousWeek, endOfNextWeek);
    const scheduleBlocks = await ScheduleBlock.findAll({
      where: {
        date: {
          [Op.between]: [startOfPreviousWeek, endOfNextWeek],
        },
      },
      include: {
        model: User,

        attributes: ["name", "id"],
      },
    });

    res.status(200).json({ scheduleBlocks });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/block/:id", async (req, res, next) => {
  try {
    const scheduleBlock = await ScheduleBlock.findByPk(req.params.id);
    if (!scheduleBlock) {
      return res.status(404).json({ error: "ScheduleBlock not found" });
    }
    return res.status(200).json({ scheduleBlock });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { scheduleBlockData } = req.body;
    console.log(scheduleBlockData);
    const scheduleBlock = await ScheduleBlock.findByPk(req.params.id);
    if (!scheduleBlock) {
      return res.status(404).json({ error: "ScheduleBlock not found" });
    }
    console.log(scheduleBlock);
    await scheduleBlock.update(scheduleBlockData);
    return res.status(200).json({ scheduleBlock });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const scheduleBlock = await ScheduleBlock.findByPk(req.params.id);
    if (!scheduleBlock) {
      return res.status(404).json({ error: "ScheduleBlock not found" });
    }
    await scheduleBlock.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put("/take/:blockId", async (req, res, next) => {
  try {
    const { blockId } = req.params;
    const { id: userId } = req.user;

    const scheduleBlock = await ScheduleBlock.findByPk(blockId);

    if (!scheduleBlock) {
      return res.status(404).json({ error: "ScheduleBlock not found" });
    }

    if (!scheduleBlock.showOnTradeboard) {
      return res
        .status(403)
        .json({ error: "Access denied. Block cannot be taken." });
    }
    console.log(userId);
    // Check for conflicting entries for the user in the same week
    const conflictingBlocks = await ScheduleBlock.findAll({
      where: {
        ownerId: userId,
        date: {
          [Op.between]: [
            dayjs(scheduleBlock.date).startOf("week").toDate(),
            dayjs(scheduleBlock.date).endOf("week").toDate(),
          ],
        },
        [Op.or]: [
          {
            startTime: {
              [Op.between]: [scheduleBlock.startTime, scheduleBlock.endTime],
            },
          },
          {
            endTime: {
              [Op.between]: [scheduleBlock.startTime, scheduleBlock.endTime],
            },
          },
        ],
      },
    });

    if (conflictingBlocks.length > 0) {
      return res
        .status(400)
        .json({ error: "Conflicting schedule blocks found." });
    }

    await scheduleBlock.update({ ownerId: userId, showOnTradeboard: false });

    res.status(200).json({ scheduleBlock });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
