const router = require("express").Router();
const { Route, ServiceUpdate, DispatchRouteLog } = require("../../db/models");

const validTypeValues = [
  "On or Close",
  "Delays",
  "No Service",
  "Planned Detour",
  "Cancelled",
];

router.post("/:routeId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(403).json({ error: "Access denied" });
    }
    const routeId = req.params.routeId;
    const { primaryServiceUpdate, secondaryServiceUpdate } = req.body;

    if (
      primaryServiceUpdate.type.length &&
      secondaryServiceUpdate.type.length
    ) {
      const route = await Route.findByPk(routeId);
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }
      if (
        !validTypeValues.includes(primaryServiceUpdate.type) ||
        !validTypeValues.includes(secondaryServiceUpdate.type)
      ) {
        return res.status(400).json({ error: "Invalid status type value" });
      }

      if (
        primaryServiceUpdate.type === "Planned Detour" &&
        secondaryServiceUpdate.type === "Delays" &&
        (!primaryServiceUpdate.serviceUpdateText ||
          !secondaryServiceUpdate.serviceUpdateText)
      ) {
        return res.status(400).json({
          error: "Service update text is required for these service updates",
        });
      }

      const existingServiceUpdates = await ServiceUpdate.findAll({
        where: { routeId },
      });

      if (existingServiceUpdates.length) {
        return res
          .status(500)
          .json({ error: "A critical server error has occurred" });
      } else if (
        primaryServiceUpdate.type === "Planned Detour" &&
        !primaryServiceUpdate.expiration
      ) {
        return res.status(400).json({
          error: "Expiration date is needed for planned detour updates",
        });
      } else if (
        secondaryServiceUpdate.type in
        ["On or Close", "No Service", "Cancelled"]
      ) {
        return res.status(400).json({
          error:
            "'On or Close', 'No Service' and 'Cancelled' cannot be set as a second service update.",
        });
      }
      const firstServiceUpdate = {
        ...primaryServiceUpdate,
        routeId,
      };
      const secondServiceUpdate = {
        ...secondaryServiceUpdate,
        routeId,
        isSecondUpdate: true,
      };
      const serviceUpdates = await ServiceUpdate.bulkCreate([
        firstServiceUpdate,
        secondServiceUpdate,
      ]);

      route.status = primaryServiceUpdate.type;
      route.save();
      await DispatchRouteLog.create({
        routeId,
        userId: req.user.id,
        entityType: "ServiceUpdate",
        actionType: "create",
        data: serviceUpdates.map((su) => ({
          type: su.type,
          serviceUpdateText: su.serviceUpdateText,
          expiration: su.expiration,
          isSecondUpdate: su.isSecondUpdate,
        })),
        changedAt: new Date(),
      });
      return res.status(201).json({ serviceUpdates });
    } else {
      const route = await Route.findByPk(routeId);
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }
      if (!validTypeValues.includes(primaryServiceUpdate.type)) {
        return res.status(400).json({ error: "Invalid status type value" });
      }
      if (
        primaryServiceUpdate.type === "Planned Detour" &&
        !primaryServiceUpdate.expiration
      ) {
        return res.status(400).json({
          error: "Expiration date is needed for planned detour updates",
        });
      }
      if (
        (primaryServiceUpdate.type === "Planned Detour" ||
          primaryServiceUpdate.type == "Delays" ||
          primaryServiceUpdate.type == "Cancelled") &&
        !primaryServiceUpdate.serviceUpdateText
      ) {
        return res.status(400).json({
          error: "Service update text is required for these service updates",
        });
      }

      const serviceUpdate = await ServiceUpdate.create({
        ...primaryServiceUpdate,
        routeId,
      });
      route.status = primaryServiceUpdate.type;
      route.save();
      await DispatchRouteLog.create({
        routeId,
        userId: req.user.id,
        entityType: "ServiceUpdate",
        actionType: "create",
        data: {
          type: serviceUpdate.type,
          serviceUpdateText: serviceUpdate.serviceUpdateText,
          expiration: serviceUpdate.expiration,
          isSecondUpdate: serviceUpdate.isSecondUpdate,
        },
        changedAt: new Date(),
      });
      return res.status(201).json({ serviceUpdates: [serviceUpdate] });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:routeId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(403).json({ error: "Access denied" });
    }

    const routeId = req.params.routeId;
    const { primaryServiceUpdate, secondaryServiceUpdate } = req.body;
    if (
      primaryServiceUpdate.type.length &&
      secondaryServiceUpdate.type.length
    ) {
      const route = await Route.findByPk(routeId);
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }
      const serviceUpdates = await ServiceUpdate.findAll({
        where: { routeId: routeId },
      });

      if (!serviceUpdates) {
        return res.status(404).json({ error: "Service update not found" });
      }
      if (
        !primaryServiceUpdate.type === "Planned Detour" ||
        !secondaryServiceUpdate.type === "Delays "
      ) {
        return res.status(400).json({ error: "Invalid status type value" });
      }

      if (
        !primaryServiceUpdate.serviceUpdateText ||
        !secondaryServiceUpdate.serviceUpdateText
      ) {
        return res.status(400).json({
          error: "Service update text is required for these service updates",
        });
      }
      if (
        primaryServiceUpdate.type === "Planned Detour" &&
        !primaryServiceUpdate.expiration
      ) {
        return res.status(400).json({
          error: "Expiration date is needed for planned detour updates",
        });
      }

      const existingServiceUpdates = await ServiceUpdate.findAll({
        where: { routeId },
        order: [["isSecondUpdate", "ASC"]],
      });

      if (existingServiceUpdates.length === 1) {
        existingServiceUpdates[0].type = primaryServiceUpdate.type;
        existingServiceUpdates[0].serviceUpdateText =
          primaryServiceUpdate.serviceUpdateText;
        existingServiceUpdates[0].expiration = primaryServiceUpdate.expiration;

        const newServiceUpdate = await ServiceUpdate.create({
          ...secondaryServiceUpdate,
          routeId,
          isSecondUpdate: true,
        });

        if (newServiceUpdate) {
          await existingServiceUpdates[0].save();

          await DispatchRouteLog.create({
            routeId,
            userId: req.user.id,
            entityType: "ServiceUpdate",
            actionType: "update",
            data: {
              type: existingServiceUpdates[0].type,
              serviceUpdateText: existingServiceUpdates[0].serviceUpdateText,
              expiration: existingServiceUpdates[0].expiration,
              isSecondUpdate: existingServiceUpdates[0].isSecondUpdate,
            },
            changedAt: new Date(),
          });

          await DispatchRouteLog.create({
            routeId,
            userId: req.user.id,
            entityType: "ServiceUpdate",
            actionType: "create",
            data: {
              type: newServiceUpdate.type,
              serviceUpdateText: newServiceUpdate.serviceUpdateText,
              expiration: newServiceUpdate.expiration,
              isSecondUpdate: newServiceUpdate.isSecondUpdate,
            },
            changedAt: new Date(),
          });

          return res.status(201).json({
            serviceUpdates: [existingServiceUpdates[0], newServiceUpdate],
          });
        } else {
          return res
            .status(401)
            .json({ message: "Records were not successfully created" });
        }
      } else if (existingServiceUpdates.length === 2) {
        existingServiceUpdates[0].type = primaryServiceUpdate.type;
        existingServiceUpdates[0].serviceUpdateText =
          primaryServiceUpdate.serviceUpdateText;
        existingServiceUpdates[0].expiration = primaryServiceUpdate.expiration;
        await existingServiceUpdates[0].save();
        existingServiceUpdates[1].type = secondaryServiceUpdate.type;
        existingServiceUpdates[1].serviceUpdateText =
          secondaryServiceUpdate.serviceUpdateText;
        existingServiceUpdates[1].expiration = null;
        await existingServiceUpdates[1].save();
        route.status = primaryServiceUpdate.type;
        route.save();
        existingServiceUpdates.forEach(async (su) => {
          await DispatchRouteLog.create({
            routeId,
            userId: req.user.id,
            entityType: "ServiceUpdate",
            actionType: "update",
            data: {
              type: su.type,
              serviceUpdateText: su.serviceUpdateText,
              expiration: su.expiration,
              isSecondUpdate: su.isSecondUpdate,
            },
            changedAt: new Date(),
          });
        });
        return res.status(201).json({
          serviceUpdates: [...existingServiceUpdates],
        });
      }
    } else {
      const route = await Route.findByPk(routeId);
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }
      const existingServiceUpdates = await ServiceUpdate.findAll({
        where: { routeId: routeId },
        order: [["isSecondUpdate", "ASC"]],
      });

      if (!existingServiceUpdates.length) {
        return res.status(404).json({ error: "Service update not found" });
      }

      if (!validTypeValues.includes(primaryServiceUpdate.type)) {
        return res.status(400).json({ error: "Invalid service type" });
      }

      if (
        (primaryServiceUpdate.type === "Planned Detour" ||
          primaryServiceUpdate.type === "Delays" ||
          primaryServiceUpdate.type === "Cancelled") &&
        !primaryServiceUpdate.serviceUpdateText.length
      ) {
        return res.status(400).json({
          error: "Service update text is required for these service updates",
        });
      }
      if (
        primaryServiceUpdate.type === "Planned Detour" &&
        !primaryServiceUpdate.expiration
      ) {
        return res.status(400).json({
          error: "Expiration date is needed for planned detour updates",
        });
      }

      existingServiceUpdates[0].type = primaryServiceUpdate.type;
      existingServiceUpdates[0].expiration = primaryServiceUpdate.expiration;
      existingServiceUpdates[0].serviceUpdateText =
        primaryServiceUpdate.serviceUpdateText;
      const serviceUpdate = await existingServiceUpdates[0].save();
      if (existingServiceUpdates.length === 2) {
        await existingServiceUpdates[1].destroy();
      }
      route.status = primaryServiceUpdate.type;
      route.save();

      await DispatchRouteLog.create({
        routeId,
        userId: req.user.id,
        entityType: "ServiceUpdate",
        actionType: "update",
        data: {
          type: serviceUpdate.type,
          serviceUpdateText: serviceUpdate.serviceUpdateText,
          expiration: serviceUpdate.expiration,
          isSecondUpdate: serviceUpdate.isSecondUpdate,
        },
        changedAt: new Date(),
      });

      return res.status(201).json({ serviceUpdates: [serviceUpdate] });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:routeId/:serviceUpdateId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(403).json({ error: "Access denied" });
    }
    const routeId = req.params.routeId;
    const serviceUpdateId = req.params.serviceUpdateId;

    const route = await Route.findByPk(routeId);
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }
    const serviceUpdate = await ServiceUpdate.findByPk(serviceUpdateId);
    if (!serviceUpdate) {
      return res.status(404).json({ error: "Service update not found" });
    }

    if (!serviceUpdate.isSecondUpdate) {
      return res
        .status(400)
        .json({ error: "Cannot delete primary service update" });
    }
    await DispatchRouteLog.create({
      routeId,
      userId: req.user.id,
      entityType: "ServiceUpdate",
      actionType: "delete",
      data: {
        type: serviceUpdate.type,
        serviceUpdateText: serviceUpdate.serviceUpdateText,
        expiration: serviceUpdate.expiration,
        isSecondUpdate: serviceUpdate.isSecondUpdate,
      },
      changedAt: new Date(),
    });
    serviceUpdate.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.get("/:routeId", async (req, res, next) => {
  try {
    const routeId = req.params.routeId;

    const serviceUpdates = await ServiceUpdate.findAll({
      where: { routeId: routeId },
    });

    res.status(200).json(serviceUpdates);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const routesWithUpdates = await Route.findAll({
      order: [["name", "ASC"]],
      include: {
        model: ServiceUpdate,
        order: [["isSecondUpdate", "ASC"]],
      },
    });

    res.json(routesWithUpdates);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
