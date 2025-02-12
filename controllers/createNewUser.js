const { user: userModel } = require("../models/index.js");
const { validateUserQueryParams } = require("../validations/index.js");
const { doesUserExist } = require("../services/doesUserExist.js");
const createNewUser = async (req, res) => {
  // validate user input
  const errors = validateUserQueryParams(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const { username, email } = req.body;
    // check if user already exists
    if (!doesUserExist(email)) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await userModel.create({ username, email });
    if (user) {
      return res
        .status(201)
        .json({ message: "User created successfully", user });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

module.exports = { createNewUser };
