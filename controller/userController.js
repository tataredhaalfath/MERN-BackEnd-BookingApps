const User = require("../models/User");

module.exports = {
  create: async (req, res) => {
    try {
      const { userName, email, password, passwordConfirm, phoneNumber } =
        req.body;

      if (password !== passwordConfirm) {
        throw Error("Password not same with Password Confirm!");
      }

      const checkUserName = await User.findOne({ userName: userName });
      const checkEmail = await User.findOne({ email: email });
      const checkPhone = await User.findOne({ phoneNumber: phoneNumber });
      if (checkUserName) {
        throw Error("Username Already Exist");
      }

      if (checkEmail) {
        throw Error("Email Already Exist");
      }

      if (checkPhone) {
        throw Error("Phone Number Already Exist");
      }

      const user = new User({
        ...req.body,
      });
      await user.save();
      return res.status(200).json({ message: "Registration Success" });
    } catch (error) {
      switch (error.message) {
        case "Username Already Exist":
        case "Email Already Exist":
        case "Phone Number Already Exist":
          return res.status(400).json({ message: error.message });
        case "Password not same with Password Confirm!":
          return res.status(403).json({ message: error.message });
        default:
          return res.status(500).json({ message: error.message });
      }
    }
  },

  get: async (req, res) => {
    try {
      const users = await User.find();
      return users.length === 0
        ? res.status(404).json({ message: "Data User is Empty" })
        : res.status(200).json({ users });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdated = [
        "userName",
        "email",
        "password",
        "passwordConfirm",
        "phoneNumber",
        "role",
      ];
      const isValidOperation = updates.every((update) => {
        return allowedUpdated.includes(update);
      });

      if (!isValidOperation) {
        return res.status(403).json({
          message: `Invalid Key Parameter`,
        });
      }

      const user = await User.findById(req.params.id);
      if (!user) {
        throw Error("User Not Found!");
      }

      // validation when update userName, email, phoneNumber
      if (req.body.userName || req.body.email || req.body.phoneNumber) {
        const checkUserName = await User.findOne({
          userName: req.body.userName,
        });
        const checkEmail = await User.findOne({ email: req.body.email });
        const checkPhoneNumber = await User.findOne({
          phoneNumber: req.body.phoneNumber,
        });

        if (checkUserName) {
          if (user._id.toString() !== checkUserName._id.toString()) {
            throw Error("Username Already Exist");
          }
        }

        if (checkEmail) {
          if (user._id.toString() !== checkEmail._id.toString()) {
            throw Error("Email Already Exist");
          }
        }

        if (checkPhoneNumber) {
          if (user._id.toString() !== checkPhoneNumber._id.toString()) {
            throw Error("Phone Number Already Exist");
          }
        }
      }

      if (req.body.password) {
        if (req.body.password !== req.body.passwordConfirm) {
          throw Error("Password not same with Password Confirm!");
        }
      }
      updates.forEach((update) => {
        user[update] = req.body[update];
      }); //update user

      await user.save();

      return res.status(200).json(user);
    } catch (error) {
      switch (error.message) {
        case "User Not Found!":
          return res.status(404).json({ message: error.message });
        case "Username Already Exist":
        case "Email Already Exist":
        case "Phone Number Already Exist":
        case "Password not same with Password Confirm!":
          return res.status(403).json({ message: error.message });

        default:
          return res.status(500).json({ message: error.message });
      }
    }
  },

  delete: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);

      return user
        ? res.status(200).json({ message: "User Deleted" })
        : res.status(404).json({ message: "User Not Found!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  logIn: async (req, res) => {
    try {
      const user = await User.findbyCredentials(
        req.body.email,
        req.body.password
      );
      const token = await user.generateAuthToken();
      const username = user.userName;

      return res.status(200).json({ username, token });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  logOut: async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter(
        (token) => token.token !== req.user.token
      );

      await req.user.save();
      return res.status(200).json({ message: "Logout Success" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  logOutAll: async (req, res) => {
    try {
      req.user.tokens = [];

      await req.user.save();
      return res.status(200).json({ message: "Logout Success" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  detailUser: async (req, res) => {
    return res.status(200).json(req.user);
  },
};
