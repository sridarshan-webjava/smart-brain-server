const jwt = require("jsonwebtoken");
const redisClient = require("../init-db/init-redis");

const getUserCredentials = (req, db, bcrypt) => {
  const { email, password } = req.body;
  console.log(email, password);
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

const fetchUserDetailsWithToken = (res, token) => {
  getUserIdFromToken(token)
    .then(userId => {
      if (userId === null) {
        return res.json("Invalid Authorization Token");
      }
      return res.json({ userId, token });
    })
    .catch(e => console.log("Inside authtoken error", e));
};

const generateAuthToken = (email, id) => {
  return jwt.sign({ email, id }, "smart-brain-secret");
};

const mapUserTokenToId = async (token, id) => {
  await redisClient.set(token, id);
};

const createUserSession = (email, id) => {
  const token = generateAuthToken(email, id);
  mapUserTokenToId(token, id);
  return { success: true, userId: id, token: token };
};

const signInUser = (req, res, db, bcrypt) => {
  const { authorization } = req.headers;
  authorization
    ? fetchUserDetailsWithToken(res, authorization)
    : getUserCredentials(req, db, bcrypt)
        .then(data => {
          data?.email && data?.id
            ? res.json({
                "Bearer Token": createUserSession(
                  data.email,
                  data.id,
                  redisClient
                ),
              })
            : Promise.reject("Incorrect login details");
        })
        .catch(err => {
          console.log("Inside outer catch block", err);
          res.status(400).json(err);
        });
};

module.exports = {
  signInUser,
};
