const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport(
  process.env.env === "development"
    ? {
        service: "Gmail",
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      }
    : {
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
          user: "apikey",
          pass: process.env.SENDGRID_API_KEY,
        },
      }
);

module.exports = { transporter };
