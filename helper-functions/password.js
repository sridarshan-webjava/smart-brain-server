async function hashPassword(password) {
  let hashedPassword;
  await bcrypt.hash(password, null, null, (err, hash) => {
    hashedPassword = hash;
  });
  return hashedPassword;
}

module.exports = {
  hashPassword,
};
