const router = require("express").Router();
const { Route, DispatchRouteLog, User } = require("../../db/models");

router.get("/", async (req, res, next) => {
  try {
    const routes = await Route.findAll({
      order: [["name", "ASC"]],
    });
    res.json(routes);
  } catch (error) {
    next(error);
  }
});
router.delete("/:routeId", async (req, res, next) => {
  try {
    if (
      !req.user.isAdmin &&
      !req.user.permissions.find((perm) => perm.tabName === "dispatch").canAdmin
    ) {
      return res.status(403).json({ error: "Access denied" });
    }
    const routeId = req.params.routeId;
    const routeToDelete = await Route.findByPk(routeId);

    if (!routeToDelete) {
      return res.status(404).json({ error: "Route not found" });
    }

    await routeToDelete.destroy();
    // await DispatchRouteLog.create({
    //   routeId,
    //   userId: req.user.id,
    //   entityType: 'Route',
    //   actionType: 'delete',

    //   data: routeToDelete.toJSON(),
    //   changedAt: new Date(),
    // });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (
      !req.user.isAdmin &&
      !req.user.permissions.find((perm) => perm.tabName === "dispatch").canAdmin
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).json({ error: "Name and color are required" });
    }

    const existingRoute = await Route.findOne({
      where: { name: name.trim() },
    });

    if (existingRoute) {
      return res.status(409).json({ error: "Route name already exists" });
    }

    if (!color.startsWith("#")) {
      return res.status(400).json({ error: "Color must start with '#'" });
    }

    const newRoute = await Route.create({
      name: name.trim(),
      color: color.trim(),
    });
    await DispatchRouteLog.create({
      routeId: newRoute.id,
      userId: req.user.id,
      entityType: "Route",
      actionType: "update",
      data: {
        name: newRoute.name,
        color: newRoute.color,
        status: newRoute.status,
        enabled: newRoute.enabled,
      },
      changedAt: new Date(),
    });
    res.status(201).json(newRoute);
  } catch (error) {
    next(error);
  }
});

router.put("/update/:routeId", async (req, res, next) => {
  try {
    if (
      !req.user.isAdmin &&
      !req.user.permissions.find((perm) => perm.tabName === "dispatch").canAdmin
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const routeId = req.params.routeId;
    const { name, color } = req.body;
    const routeToUpdate = await Route.findByPk(routeId);

    if (!routeToUpdate) {
      return res.status(404).json({ error: "Route not found" });
    }

    if (name !== undefined && name.trim() !== "") {
      routeToUpdate.name = name.trim();
    }

    if (color !== undefined && color.trim() !== "") {
      if (!color.trim().startsWith("#")) {
        return res.status(400).json({ error: "Color must start with #" });
      }

      routeToUpdate.color = color.trim();
    }

    await routeToUpdate.save();
    await DispatchRouteLog.create({
      routeId: routeToUpdate.id,
      userId: req.user.id,
      entityType: "Route",
      actionType: "update",
      data: {
        name: routeToUpdate.name,
        color: routeToUpdate.color,
        status: routeToUpdate.status,
        enabled: routeToUpdate.enabled,
      },
      changedAt: new Date(),
    });
    res.status(200).json(routeToUpdate);
  } catch (error) {
    next(error);
  }
});
router.put("/update/enabled/:routeId", async (req, res, next) => {
  try {
    const routeId = req.params.routeId;

    const routeToUpdate = await Route.findByPk(routeId);

    if (!routeToUpdate) {
      return res.status(404).json({ error: "Route not found" });
    }
    routeToUpdate.enabled = !routeToUpdate.enabled;

    await routeToUpdate.save();
    await DispatchRouteLog.create({
      routeId: routeToUpdate.id,
      userId: req.user.id,
      entityType: "Route",
      actionType: "update",
      data: {
        name: routeToUpdate.name,
        color: routeToUpdate.color,
        status: routeToUpdate.status,
        enabled: routeToUpdate.enabled,
      },
      changedAt: new Date(),
    });

    res.status(200).json(routeToUpdate);
  } catch (error) {
    next(error);
  }
});

router.get("/logs", async (req, res, next) => {
  try {
    if (
      !req.user.isAdmin &&
      !req.user.permissions.find((perm) => perm.tabName === "dispatch").canAdmin
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const logs = await DispatchRouteLog.findAll({
      order: [["changedAt", "DESC"]],
      include: [
        {
          model: Route,
          attributes: ["name"],
        },
        {
          model: User,
          attributes: ["email", "name"],
        },
      ],
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching DispatchRouteLogs:", error);
    next(error);
  }
});

module.exports = router;
