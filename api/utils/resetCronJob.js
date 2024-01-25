const cron = require("node-cron");
const { Op } = require("sequelize");
const { User } = require("../db/models"); // Adjust the path accordingly
const { transporter } = require("./NodeMailer"); // Adjust the path accordingly
const { generateRandomPassword } = require("./other");
const jwt = require("jsonwebtoken");

console.log(process.env.NODEMAILER_EMAIL);
const sendResetEmail = async (user, password, token) => {
  try {
    user.resetToken = token;
    user.resetMandatory = true;
    user.resetTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    await user.save();

    const mailConfigurations = {
      from: process.env.NODEMAILER_EMAIL,
      to: user.email,
      subject: "[REQUIRED] Reset your password to gain access again!",
      html: `
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            background-color: #2596be;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #2596be;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
          }
          .password-box {
            border: 1px solid #2596be;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Password Reset</h2>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p>Your password was manually reset by an administrator. To gain access again, please follow the link below and create a new password using the temporary password provided:</p>
            <p>
              <a href="${
                process.env.env === "development"
                  ? "http://localhost:3000"
                  : "https://portal.occtransport.org"
              }/reset-password?token=${token}" class="button">
                Reset Password
              </a>
            </p>
            <div class="password-box">
            <p>${password}</p>
          </div>
            <p>This link will expire in 24 hours. If 24 hours have passed, please check your email for a new password reset link.</p>
            <p>Thanks</p>
          </div>
        </div>
      </body>
      </html>
		`,
    };

    transporter.sendMail(mailConfigurations, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send recovery email." });
      } else {
        res
          .status(200)
          .json({ message: "Password recovery email sent successfully", user });
      }
    });
  } catch (error) {
    console.error("Error sending reset email:", error);
  }
};

cron.schedule(
  "0 * * * *",
  async () => {
    try {
      console.log("schedule running");
      const usersToReset = await User.findAll({
        where: {
          resetMandatory: true,
          resetToken: {
            [Op.ne]: null,
          },
          resetTokenExpiresAt: {
            [Op.lt]: new Date(),
          },
        },
      });

      for (const user of usersToReset) {
        const password = generateRandomPassword(12);
        const newToken = jwt.sign(
          { id: user.id, tempPassword: password },
          process.env.SESSION_SECRET,
          { expiresIn: "24h" }
        );

        user.resetToken = newToken;
        user.resetTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();

        await sendResetEmail(user, password, newToken);
      }
      console.log("Cron job completed at:", new Date().toLocaleString());
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  },
  {
    scheduled: true,
    timezone: "America/New_York",
  }
);
