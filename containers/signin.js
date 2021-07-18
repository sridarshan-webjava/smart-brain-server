const signInUser = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    return res.status(404).json("Invalid request");
  }
  db.select()
    .from("login")
    .where({ email: email })
    .then(data => {
      return bcrypt.compare(password, data[0].hash, (err, match) => {
        if (match) {
          db.select()
            .from("users")
            .where({ email: email })
            .then(resp => res.json(resp[0]))
            .catch(err => res.status(400).json("unable to fetch user data"));
        } else {
          res.status(400).json("Passwords do not match");
        }
      });
    })
    .catch(err => res.json("Invalid credentials"));
};

module.exports = {
  signInUser,
};
