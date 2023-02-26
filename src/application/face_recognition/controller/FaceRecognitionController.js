const express = require("express");
const router = express.Router();

const { db } = require("../init-db/init-postgres");
const { postImage, handleApiCall } = require("../services/image");

router.put("/image", (req, res) =>
  postImage(req, res, db)
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      res.status(400).json(err.message);
    })
);

router.post("/image/url", (req, res) =>
  handleApiCall(req, res).then(response => {
    res.json(response);
  })
);

module.exports = router;
