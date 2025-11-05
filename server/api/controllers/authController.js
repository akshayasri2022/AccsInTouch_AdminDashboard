
const authService = require("../services/authService");
const blacklist = new Set();

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, role, fullName } = await authService.loginUser({ email, password });

    return res.status(200).json({
      message: "Login successful",
      token,
      role,
      fullName,
      email,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(401).json({ error: error.message });
  }
};


const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    if (authService.isTokenBlacklisted(token)) {
      return res.status(400).json({ error: "Token is already blacklisted" });
    }

    authService.logoutUser(token);
    res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  loginUser,
  logoutUser,
};
