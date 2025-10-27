const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");
const createError = require("../utils/createError"); // optional helper

// REGISTER USER
exports.registerUser = async (req, res, next) => {
  try {
    const { email, password,} = req.body;

    // basic validations
    if (!email || !email.includes("@")) {
      throw createError("Invalid email address", 400, "INVALID_EMAIL");
    }

    if (!password || password.length < 8) {
      throw createError(
        "Password must be at least 8 characters",
        400,
        "WEAK_PASSWORD"
      );
    }

    // check for duplicates
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError("Email already in use", 409, "EMAIL_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "Registered successfully",
      user: {
        id: savedUser._id,
        email: savedUser.email,
      },
      access: accessToken,
    });
  } catch (err) {
    next(err);
  }
};

// LOGIN USER
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.includes("@")) {
      throw createError("Invalid email", 400, "INVALID_EMAIL");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw createError("Email not found", 404, "EMAIL_NOT_FOUND");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw createError("Email and password do not match", 401, "INVALID_CREDENTIALS");
    }

    const accessToken = auth.createAccessToken(user);

    res.status(200).json({ access: accessToken });
  } catch (err) {
    next(err);
  }
};

// GET PROFILE
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      throw createError("User not found", 404, "USER_NOT_FOUND");
    }

    // Remove password before sending
    const { password, ...userData } = user.toObject();

    res.status(200).json({ user: userData });
  } catch (err) {
    next(err);
  }
};