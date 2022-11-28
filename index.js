const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const morgan = require("morgan");

const register = require("./containers/register");
const image = require("./containers/image");
const signin = require("./containers/signin");
const profile = require("./containers/profile");
const users = require("./containers/users");

const hashPassword = require("./helper-functions/password").hashPassword;

const db = require("./init-db/init-postgres");

const app = express();

app.use(morgan("combined"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// app.get("/", (req, res) => users.getUsers(req, res, db));
app.get("/", (req, res) => res.send("Server is running"));

app.get("/profile/:id", (req, res) => profile.getUserProfile(req, res, db));

app.post("/signin", (req, res) => signin.signInUser(req, res, db, bcrypt));

app.post("/register", (req, res) =>
  register.registerUser(req, res, db, hashPassword)
);

app.put("/image", (req, res) => image.postImage(req, res, db));

app.post("/imageurl", (req, res) => image.handleApiCall(req, res));

app.listen(6000, () => {
  console.log("Listening on Port 6000");
});
