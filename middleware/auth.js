const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Auth

const auth = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) {
      throw new Error("Authorization Not Found!");
    }
    const token = await req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, "BookingApp");

    const user = await User.findOne({
      _id: decode._id,
      "tokens.token": token,
    }).select("userName email role phoneNumber tokens");
    if (!user) {
      throw new Error("Invalid Token!");
    }

    req.user = user;
    req.user.token = token;

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = auth;
