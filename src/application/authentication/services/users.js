const getUsers = (req, res, db) => {
  return db
    .select()
    .from("users")
    .then((data) => {
      if (data.length) {
        return data;
        // res.json(data);
      } else {
        return "Unable to fetch user data";
        // res.json("Unable to fetch user data");
      }
    });
};

module.exports = {
  getUsers,
};
