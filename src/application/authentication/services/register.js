const OperationError = require("../../ErrorClass/OperationError");
const ValidationError = require("../../ErrorClass//ValidationError");
const { createUserSession } = require("./signin");

const validateDbData = () => {
  if (
    (Array.isArray(dataToSend) && dataToSend.length <= 0) ||
    (typeof dataToSend === "object" && Object.keys(dataToSend).length <= 0) ||
    !dataToSend
  ) {
    return false;
  }
  return true;
};

const executeInsertQueryDb = async (db, insertData, returnData, tableName) => {
  const trx = await db.transaction();
  try {
    const data = await trx
      .insert(insertData)
      .into(tableName)
      .returning(returnData);
    if (validateDbData) {
      console.log("Data is valid", data[0]);
      const dataToSend = data[0];
      await trx.commit();
      return dataToSend;
    } else {
      console.log("Data is invalid");
      throw new OperationError("Failed to register");
    }
  } catch (e) {
    const trx2 = await db.transaction();
    await trx2.rollback();
    throw e;
  }
};

const registerUser = async (req, res, db, hashPassword) => {
  const { name, email, password } = req.body;
  if (email === "" || password === "") {
    throw new ValidationError(
      "Email or password is empty. Please provide valid credentials"
    );
  }
  const hashedPassword = await hashPassword(password);
  const loginEmail = await executeInsertQueryDb(
    db,
    {
      hash: hashedPassword,
      email: email,
    },
    "email",
    "login"
  );
  console.log(loginEmail);
  const userDetails = await executeInsertQueryDb(
    db,
    {
      email: loginEmail,
      name: name,
      joined: new Date(),
    },
    "*",
    "users"
  );
  const token = createUserSession(userDetails.email, userDetails.id);
  return { token, ...userDetails };
};

module.exports = {
  registerUser,
};
