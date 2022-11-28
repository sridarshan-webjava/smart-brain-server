const bcrypt = require("bcrypt-nodejs");
async function hashPassword(password) {
  let hashedPassword;
  await bcrypt.hash(password, null, null, (err, hash) => {
    hashedPassword = hash;
  });
  console.log("hashed password is", hashedPassword);
  return hashedPassword;
}

module.exports = {
  hashPassword,
};
