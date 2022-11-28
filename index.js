const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const register = require("./containers/register");
const image = require("./containers/image");
const signin = require("./containers/signin");
const profile = require("./containers/profile");
const users = require("./containers/users");

const hashPassword = require("./helper-functions/password").hashPassword;

const db = require("knex")({
  client: "pg",
  connection: process.env.DATABASE_URL,
});
const port = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => users.getUsers(req, res, db));

app.get("/profile/:id", (req, res) => profile.getUserProfile(req, res, db));

app.post("/signin", (req, res) => signin.signInUser(req, res, db, bcrypt));

app.post("/register", (req, res) =>
  register.registerUser(req, res, db, hashPassword)
);

app.put("/image", (req, res) => image.postImage(req, res, db));

app.post("/imageurl", (req, res) => image.handleApiCall(req, res));

app.listen(port, () => {
  console.log("Listening on Port 5000");
});
