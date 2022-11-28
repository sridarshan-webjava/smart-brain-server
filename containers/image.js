const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "f7e7dc2708e44d41a06a715d531e3483",
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      console.log(data);
      res.json(data);
    })
    .catch(err => res.status(400).json("Could not make API Call"));
};

const postImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then(resp => {
      if (resp.length !== 0) {
        res.json(Number(resp[0]));
      } else {
        res.json("Not Found");
      }
    })
    .catch(err => console.log(err));
};

module.exports = {
  postImage,
  handleApiCall,
};
