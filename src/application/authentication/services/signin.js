const jwt = require("jsonwebtoken");
const {
  redisClient,
} = require("../../../application/face_recognition/init-db/init-redis");
const ValidationError = require("../../ErrorClass/ValidationError");

const getUserCredentials = (email, db) => {
  return db.select().from("users").where({ email: email });
};

const validateUserCredentials = (email, password, db, bcrypt) => {
  if (email === "") {
    throw new ValidationError("Provide a valid email");
  }
  if (password === "") {
    throw new ValidationError("Provide a valid password");
  }
  return db
    .select()
    .from("login")
    .where({ email: email })
    .then(data => {
      return bcrypt.compareSync(password, data[0].hash);
    });
};

const getUserIdFromToken = async token => {
  const id = await redisClient.get(token.slice(7));
  return id;
};

const validateUserAuthToken = token => {
  return getUserIdFromToken(token);
};

const generateAuthToken = (email, id) => {
  return jwt.sign({ email, id }, "smart-brain-secret");
};

const mapUserTokenToId = async (token, id) => {
  await redisClient.set(token, id, 3600);
};

const createUserSession = (email, id) => {
  const token = generateAuthToken(email, id);
  console.log(token);
  mapUserTokenToId(token, id);
  return token;
};

const signInUser = async (req, res, db, bcrypt) => {
  const { authorization } = req.headers;
  const { email, password } = req.body;
  if (authorization && validateUserAuthToken(authorization)) {
    return { token: authorization, ...req.body };
  }
  return validateUserCredentials(email, password, db, bcrypt).then(
    async areCredentialsValid => {
      if (!areCredentialsValid) {
        throw new ValidationError("Invalid credentials");
      }
      return await getUserCredentials(email, db).then(dbResponse => {
        const userData = dbResponse[0];
        console.log(userData);
        const token = createUserSession(userData.email, userData.id);
        return { token, ...userData };
      });
    }
  );
};

module.exports = {
  signInUser,
  createUserSession,
};
