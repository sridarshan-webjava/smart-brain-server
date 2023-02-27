const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY,
});

const handleApiCall = () => {
  return app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      console.log(data);
      // res.json(data);
      return data;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const postImage = (req, res, db) => {
  const { id } = req.body;
  return db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then((resp) => {
      if (resp.length !== 0) {
        // res.json(Number(resp[0]));
        return Number(resp[0]);
      } else {
        // res.json("Not Found");
        return "Not Found";
      }
    });
};

module.exports = {
  postImage,
  handleApiCall,
};
