const registerUser = (req, res, db, hashPassword) => {
  const { name, email, password } = req.body;
  if (email === "" || password === "") {
    return res.status(404).json("Invalid request");
  }
  hashPassword(password)
    .then(hashedPassword => {
      console.log("Obtained hash is", hashedPassword);
      db.transaction(trx => {
        trx
          .insert({
            hash: hashedPassword,
            email: email,
          })
          .into("login")
          .returning("email")
          .then(loginEmail => {
            return trx("users")
              .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date(),
              })
              .returning("*")
              .then(resp => {
                if (resp.length === 0) {
                  res.json("Failed");
                } else {
                  res.json(resp[0]);
                }
              })
              .catch(err => res.json("Failed to register"));
          })
          .then(trx.commit)
          .catch(e => {
            console.log(e);
            trx.rollback;
          });
      });
    })
    .catch(err => res.status(400).json("Unable to register user"));
};

module.exports = {
  registerUser,
};
