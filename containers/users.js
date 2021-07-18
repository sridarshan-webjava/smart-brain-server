const getUsers = (req, res, db) => {
  db.select()
    .from("users")
    .then(data => {
      if (data.length) {
        res.json(data);
      } else {
        res.json("Unable to fetch user data");
      }
    })
    .catch(err => res.json("Error in fetching data"));
};

module.exports = {
  getUsers,
};
