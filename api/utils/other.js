const crypto = require("crypto");

function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
}
function isValidName(name) {
  return name && name.length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
}
module.exports = { generateRandomPassword, isValidName };
