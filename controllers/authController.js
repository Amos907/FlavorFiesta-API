const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
  let errors = {
    email: "",
    password: "",
  };

  if (err.message == "Invalid Email") {
    errors.email = "Incorect Email!";
  }

  if (err.message == "Wrong Password") {
    errors.password = "Incorect Pasword!";
  }
  if (err.code === 11000) {
    errors.email = "Email already registered!";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 60 * 60 * 24;
const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.secret_key, {
    expiresIn: maxAge,
  });

  return token;
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login({ email, password });
    const token = generateToken(user._id);

    res.cookie("jwt", token, {
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ user });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = generateToken(user._id);

    res.cookie("jwt", token, {
      maxAge: maxAge * 1000,
    });
    res.status(201).json({ user });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
