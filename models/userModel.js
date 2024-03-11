const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Missing email!"],
    unique: true,
    validate: [isEmail, "Invalid email!!"],
  },

  password: {
    type: String,
    required: [true, "Missing Password!"],
    minLength: [6, "Password must have at least 6 characters!"],
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function ({ email, password }) {
  try {
    const user = await this.findOne({ email });

    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }

      throw Error("Wrong Password");
    }
  } catch (err) {
    throw Error("Invalid Email");
  }
};

const User = mongoose.model("user", userSchema);

module.exports = User;
