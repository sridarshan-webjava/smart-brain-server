const express = require("express");
const router = express.Router();

const { getUserProfile } = require("../services/profile");
const { getUsers } = require("../services/users");

router.get("/", (req, res) =>
  getUserProfile(req, res, db).then((response) => res.json(response))
);

router.get("/all-users", (req, res) =>
  getUsers(req, res, db).then((response) => res.json(response))
);

module.exports = router;
