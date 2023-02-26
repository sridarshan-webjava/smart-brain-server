const jwt = require("jsonwebtoken");
const { redisClient } = require("../init-db/init-redis");

const getUserCredentials = (req, db, bcrypt) => {
  const { email, password } = req.body;
  if (email === "") {
    throw new Error("Provide a valid email");
  }
  if (password === "") {
    throw new Error("Provide a valid password");
  }
  return db
    .select()
    .from("login")
    .where({ email: email })
    .then(data => {
      const match = bcrypt.compareSync(password, data[0].hash);
      console.log(match);
      if (match) {
        return db
          .select()
          .from("users")
          .where({ email: email })
          .then(user => user[0])
          .catch(err => console.log(err));
      } else {
        return Promise.reject("Invalid credentials");
      }
    })
    .catch(err => Promise.reject(err));
};

const getUserIdFromToken = async token => {
  const id = await redisClient.get(token.slice(7));
  return id;
};
