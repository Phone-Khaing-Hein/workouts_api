const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.statics.signup = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled.");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is invalid.");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is weak.");
  }

  const exist = await this.findOne({ email });

  if (exist) {
    throw Error("Email has already existed.");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};

UserSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled.");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect Email.");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect Password.");
  }

  return user;
};

module.exports = mongoose.model("User", UserSchema);
