import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { omit } from "lodash";
import jwt from "jsonwebtoken";

interface IUser {
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (
    candidatePassword: string,
    cb: (err: any, isMatch: boolean) => any
  ) => any;
  generateToken: () => string;
  doc: () => Partial<IUser>;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

UserSchema.method("doc", function () {
  return omit(this._doc, ["password", "__v"]);
});

UserSchema.pre("save", function (next) {
  var user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.method(
  "comparePassword",
  function (
    candidatePassword: string,
    cb: (err: any, isMatch: boolean) => any
  ) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) return cb(err, false);
      cb(null, isMatch);
    });
  }
);

UserSchema.method("generateToken", function () {
  return jwt.sign(this.doc(), process.env.MICRO_APP || "MICRO_APP", {
    expiresIn: "30d",
  });
});

export default mongoose.model<IUser>("User", UserSchema);
