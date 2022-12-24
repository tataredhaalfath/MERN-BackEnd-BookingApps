const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Please Input Username!"],
    },
    email: {
      type: String,
      required: [true, "Please Input Email!"],
      trim: true,
      unique:true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw Error("Please Privide a valid Email Address!");
        }
      },
    },
    role: {
      type: String,
      enum: ["owner", "admin"],
      default: "owner",
    },
    password: {
      type: String,
      required: [true, "Please Input Password!"],
      minlength: 5,
      trim: true,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please Input Password Confirm!"],
    },
    phoneNumber: {
      type: String,
      unique:true,
      required: [true, "Please Input Phone Number!"],
      validate(value) {
        if (this.password !== this.passwordConfirm) {
          return true;
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

// generate token jwt
userSchema.method.generateAuthToken = async () => {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "BookingApp", {
    expiresIn: "1d",
  });

  user.tokens = user.token.concat({ token });
  await user.save();
  return token;
};

// mengamankan agar data password, passwordConfirm dan token tidak tergenerate saat table user dipanggil
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject;

  delete userObject.password;
  delete userObject.passwordConfirm;
  delete userObject.tokens;

  return userObject;
};

// login check
userSchema.static.findbyCredentials = async (email, password) => {
  const user = await User.findByOne({ email });
  if (!user) {
    throw Error("User Not Found!");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw Error("Wrong Password!");
  }

  return user;
};

// hasing password
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  if (user.isMondified("passwordConfirm")) {
    user.passwordConfirm = await bcrypt.hash(user.passwordConfirm, 8);
  }

  next();
});
module.exports = mongoose.model("User", userSchema);
