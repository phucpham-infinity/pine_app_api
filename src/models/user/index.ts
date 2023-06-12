import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { omit } from "lodash";
import jwt from "jsonwebtoken";

import { IBaseModal, createSchema } from "@/helpers";

export interface IUser extends IBaseModal {
  email?: string;
  username?: string;
  password: string;
  phone: string;
  isUseFaceId?: boolean;
  isUseTouchId?: boolean;
  status: "PENDING" | "APPROVAL" | "REJECT";
  comparePassword: (
    candidatePassword: string,
    cb: (err: any, isMatch: boolean) => any
  ) => any;
  generateToken: () => string;
}

const UserSchema = createSchema({
  phone: { type: String, required: true, unique: true },
  isUseFaceId: { type: Boolean, required: false },
  isUseTouchId: { type: Boolean, required: false },
  password: { type: String, required: true },
});

UserSchema.method("doc", function () {
  return omit(this._doc, ["password"]);
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
