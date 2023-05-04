const User = require("../model/user.model");
const Profile = require("../model/profile.model");
const Transaction = require("../model/transaction.model");

const getBalanceByUserId = async function (id) {
  try {
    const result = await User.findById(id).populate("profileId");
    return result.profileId.coinsBalance;
  } catch (error) {
    res.json({ result: false, error });
  }
};
const registerUser = async (req, res, next) => {
  const { username, email, password, firstName, lastName, role } = req.body;
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (user) {
    res
      .status(400)
      .render("login", { message: "email or username already has been used" });
  } else {
    const newProfile = await Profile.create({ firstName, lastName });
    const newUser = await User.create({
      username,
      email,
      password,
      profileId: newProfile._id,
      role,
    });
    res
      .status(201)
      .render("login", {
        message: "your user has been added try to log in " + newUser,
      });
  }
};

module.exports = {
  getBalanceByUserId,
  registerUser,
};
