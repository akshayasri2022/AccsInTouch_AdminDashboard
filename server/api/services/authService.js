

const jwt = require("jsonwebtoken");
const userSignUp = require("../model/userModel");
const bcrypt = require("bcryptjs");

const blacklist = new Set();

const loginUser = async ({ email, password }) => {
  const user = await userSignUp.findOne({ where: { email } });

  if (!user) throw new Error("Email is not registered");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Password is incorrect");

  // Include entire user details in token
  const tokenPayload = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phone: user.phoneNumber,
    cityName: user.cityName,
    districtName: user.districtName,
    pinCode: user.pinCode,
    gender: user.gender,
    image_url: user.image_url,
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { token, role: user.role , email:user.email, fullName: user.fullName, };
};


const logoutUser = (token) => {
  blacklist.add(token);
};

const isTokenBlacklisted = (token) => {
  return blacklist.has(token);
};

module.exports = {
  loginUser,
  logoutUser,
  isTokenBlacklisted,
};
