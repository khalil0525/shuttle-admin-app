// app.js

const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const logger = require("morgan");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./db");
const path = require("path");
const cookieParser = require("cookie-parser");

const { User, Permission } = require("./db/models");

const corsMiddleware = require("./middleware/corsMiddleware");
const sessionStore = new SequelizeStore({ db });

const { json, urlencoded } = express;

const app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "../client/build")));

app.use(corsMiddleware);
app.use(function (req, res, next) {
  const token = req.cookies["x-access-token"];

  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
      if (err) {
        return next();
      }

      User.findOne({
        where: { id: decoded.id },
      }).then((user) => {
        if (!user) {
          return next();
        }

        Permission.findAll({
          where: { userId: user.id },
        }).then((permissions) => {
          user.permissions = permissions;

          req.user = user;

          return next();
        });
      });
    });
  } else {
    return next();
  }
});

app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/api"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/../client/build/index.html"));
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = { app, sessionStore };
