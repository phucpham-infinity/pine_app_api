"use strict";
var e = require("express"),
  t = require("cors"),
  s = require("helmet"),
  o = require("morgan"),
  r = require("dotenv"),
  n = require("mongoose"),
  a = require("jsonwebtoken"),
  i = require("zod"),
  u = require("bcryptjs"),
  c = require("lodash");
function d(e) {
  var t = Object.create(null);
  return (
    e &&
      Object.keys(e).forEach(function (s) {
        if ("default" !== s) {
          var o = Object.getOwnPropertyDescriptor(e, s);
          Object.defineProperty(
            t,
            s,
            o.get
              ? o
              : {
                  enumerable: !0,
                  get: function () {
                    return e[s];
                  },
                }
          );
        }
      }),
    (t.default = e),
    Object.freeze(t)
  );
}
d(r).config();
const p = (e) => {
    var t;
    return null === (t = process.env) || void 0 === t ? void 0 : t[e];
  },
  l = (e) =>
    new n.Schema({
      ...e,
      createdAt: { type: Date, default: new Date() },
      updatedAt: { type: Date, default: new Date() },
    }),
  y = (e) => (t, s, o) => {
    try {
      e.parse({ body: t.body, query: t.query, params: t.params }), o();
    } catch (e) {
      return s.status(400).json({ status: 400, error: e.issues });
    }
  },
  m = (e, t, s) => {
    var o;
    const r =
      null === (o = e.header("Authorization")) || void 0 === o
        ? void 0
        : o.replace("Bearer ", "");
    if (!r)
      return t
        .status(403)
        .json({ status: 403, error: "A token is required for authentication" });
    try {
      const t = a.verify(r, process.env.TOKEN_SECRET || "MICRO_APP");
      e.user = t;
    } catch (e) {
      return t.status(401).json({ status: 401, error: "Invalid Token" });
    }
    return s();
  },
  g = i.z.object({
    body: i.z.object({
      phone: i.z.string(),
      password: i.z.string(),
      isUseTouchId: i.z.boolean().default(!1),
      isUseFaceId: i.z.boolean().default(!1),
    }),
  }),
  f = i.z.object({
    body: i.z.object({
      phone: i.z.string(),
      isUseTouchId: i.z.boolean().default(!1),
      isUseFaceId: i.z.boolean().default(!1),
    }),
  }),
  b = i.z.object({
    body: i.z.object({ phone: i.z.string(), password: i.z.string() }),
  }),
  h = l({
    phone: { type: String, required: !0, unique: !0 },
    isUseFaceId: { type: Boolean, required: !1 },
    isUseTouchId: { type: Boolean, required: !1 },
    password: { type: String, required: !0 },
    profile: { type: n.Types.ObjectId, ref: "Profile" },
  });
h.method("doc", function () {
  return c.omit(this._doc, ["password", "__v"]);
}),
  h.pre("save", function (e) {
    var t = this;
    if (!t.isModified("password")) return e();
    u.genSalt(10, function (s, o) {
      if (s) return e(s);
      u.hash(t.password, o, function (s, o) {
        if (s) return e(s);
        (t.password = o), e();
      });
    });
  }),
  h.method("comparePassword", function (e, t) {
    u.compare(e, this.password, function (e, s) {
      if (e) return t(e, !1);
      t(null, s);
    });
  }),
  h.method("generateToken", function () {
    return a.sign(this.doc(), process.env.MICRO_APP || "MICRO_APP", {
      expiresIn: "30d",
    });
  });
var j = n.model("User", h);
const z = "/user/register",
  v = "/user/login-with-phone",
  N = "/user/me",
  w = "/user/update-by-phone",
  q = e.Router();
q
  .use(z, y(g))
  .route(z)
  .post(async (e, t) => {
    const {
        phone: s,
        password: o,
        isUseFaceId: r = !1,
        isUseTouchId: n = !1,
      } = e.body,
      a = new j({ password: o, phone: s, isUseFaceId: r, isUseTouchId: n });
    try {
      const e = await a.save();
      return t.status(200).json({ status: "ok", data: e.doc() });
    } catch (e) {
      return t.status(400).json({ status: 400, error: e });
    }
  }),
  q
    .use(v, y(b))
    .route(v)
    .post(async (e, t) => {
      const { password: s, phone: o } = (null == e ? void 0 : e.body) || {};
      try {
        const e = await j.findOne({ phone: o });
        if (!e)
          return t.status(400).json({ status: 400, error: "User not found!" });
        e.comparePassword(s, (s, o) =>
          s
            ? t.status(400).json({ status: 400, error: s.message })
            : o
            ? t
                .status(200)
                .json({
                  status: "ok",
                  data: { ...e.doc(), token: e.generateToken() },
                })
            : t.status(400).json({ status: 400, error: "Password not match!" })
        );
      } catch (e) {
        return t.status(400).json({ status: 400, error: e });
      }
    }),
  q
    .use(N, m)
    .route(N)
    .get(async (e, t) => {
      const { user: s } = e;
      console.log("user", s);
      const o = await j.aggregate([
        {
          $lookup: {
            from: "profiles",
            localField: "_id",
            foreignField: "user",
            as: "profile",
          },
        },
        { $unwind: { path: "$profile", preserveNullAndEmptyArrays: !0 } },
        {
          $lookup: {
            from: "companies",
            localField: "profile.company",
            foreignField: "_id",
            as: "profile.company",
          },
        },
        {
          $unwind: { path: "$profile.company", preserveNullAndEmptyArrays: !0 },
        },
        { $match: { phone: s.phone } },
      ]);
      return o
        ? t
            .status(200)
            .json({
              status: "ok",
              data: c.omit(null == o ? void 0 : o[0], ["password", "__v"]),
            })
        : t.status(400).json({ status: 400, error: "User not found!" });
    }),
  q
    .use(w, y(f))
    .route(w)
    .post(async (e, t) => {
      const { isUseFaceId: s, isUseTouchId: o, phone: r } = e.body;
      try {
        const e = await j.findOneAndUpdate(
          { phone: r },
          { $set: { isUseFaceId: s, isUseTouchId: o } },
          { new: !0 }
        );
        return (
          e || t.status(400).json({ status: 400, error: "User not found!" }),
          t
            .status(200)
            .json({ status: "ok", data: null == e ? void 0 : e.doc() })
        );
      } catch (e) {
        return t.status(400).json({ status: 400, error: e });
      }
    });
const I = e.Router();
I.route("/ping").get((e, t) => {
  t.send("pong");
});
const O = i.z.object({
    body: i.z.object({
      businessActivity: i.z.string(),
      companyName: i.z.string(),
      email: i.z.string(),
      legalType: i.z.string(),
      numberOfEmployees: i.z.number(),
    }),
  }),
  D = l({
    companyName: { type: String, required: !0, unique: !0 },
    email: { type: String, required: !0, unique: !0 },
    businessActivity: { type: String, required: !0 },
    legalType: { type: String, required: !0 },
    numberOfEmployees: { type: Number, required: !0 },
  });
D.method("doc", function () {
  return c.omit(this._doc, ["password", "__v"]);
});
var U = n.model("Company", D);
const _ = "/company",
  P = e.Router();
P.use(_, [m, y(O)])
  .route(_)
  .post(async (e, t) => {
    const {
        businessActivity: s,
        companyName: o,
        email: r,
        legalType: n,
        numberOfEmployees: a,
      } = e.body,
      i = new U({
        businessActivity: s,
        companyName: o,
        email: r,
        legalType: n,
        numberOfEmployees: a,
      });
    try {
      const e = await i.save();
      return t.status(200).json({ status: "ok", data: e.doc() });
    } catch (e) {
      return t.status(400).json({ status: 400, error: e });
    }
  });
const T = i.z.object({
    body: i.z.object({
      phone: i.z.string(),
      firstName: i.z.string(),
      lastName: i.z.string(),
      nationality: i.z.string(),
      IDNumber: i.z.string().optional(),
      passportNumber: i.z.string().optional(),
      issueDate: i.z.string().optional(),
      expiryDate: i.z.string().optional(),
      companyId: i.z.string().optional(),
    }),
  }),
  S = i.z.object({
    body: i.z.object({
      firstName: i.z.string().optional(),
      lastName: i.z.string().optional(),
      nationality: i.z.string().optional(),
      IDNumber: i.z.string().optional(),
      passportNumber: i.z.string().optional(),
      issueDate: i.z.string().optional(),
      expiryDate: i.z.string().optional(),
      companyName: i.z.string().optional(),
      phone: i.z.string(),
    }),
  }),
  k = l({
    firstName: { type: String, required: !0 },
    lastName: { type: String, required: !0 },
    nationality: { type: String, required: !0 },
    IDNumber: { type: String, required: !1 },
    passportNumber: { type: String, required: !1 },
    issueDate: { type: Date, required: !1 },
    expiryDate: { type: Date, required: !1 },
    company: { type: n.Types.ObjectId, ref: "Company", required: !1 },
    user: { type: n.Types.ObjectId, ref: "User", required: !0, unique: !0 },
  });
k.method("doc", function () {
  return c.omit(this._doc, ["password", "__v"]);
});
var A = n.model("Profile", k);
const x = "/profile",
  R = "/profile",
  E = e.Router();
E.route(x).post([
  m,
  y(T),
  async (e, t) => {
    const {
      IDNumber: s,
      firstName: o,
      expiryDate: r,
      issueDate: n,
      lastName: a,
      nationality: i,
      passportNumber: u,
      phone: c,
      companyName: d,
    } = e.body;
    try {
      const e = await j.findOne({ phone: c });
      if (!e)
        return t.status(400).json({ status: 400, error: "User not found!" });
      let p = {};
      d && (p = await U.findOne({ companyName: d }));
      const l = new A({
          user: null == e ? void 0 : e.id,
          company: null == p ? void 0 : p.id,
          IDNumber: s,
          firstName: o,
          expiryDate: r,
          issueDate: n,
          lastName: a,
          nationality: i,
          passportNumber: u,
        }),
        y = await l.save();
      return t.status(200).json({ status: "ok", data: y.doc() });
    } catch (e) {
      return t.status(400).json({ status: 400, error: e });
    }
  },
]),
  E.route(R).put([
    m,
    y(S),
    async (e, t) => {
      const {
        IDNumber: s,
        firstName: o,
        expiryDate: r,
        issueDate: n,
        lastName: a,
        nationality: i,
        passportNumber: u,
        phone: c,
        companyName: d,
      } = e.body;
      try {
        const e = await j.findOne({ phone: c });
        if (!e)
          return t.status(400).json({ status: 400, error: "User not found!" });
        let p = {};
        if (d && ((p = await U.findOne({ companyName: d })), !p))
          return t
            .status(400)
            .json({ status: 400, error: "Company not found" });
        const l = await A.findOneAndUpdate(
          { user: e.id },
          {
            $set: {
              IDNumber: s,
              firstName: o,
              expiryDate: r,
              issueDate: n,
              lastName: a,
              nationality: i,
              passportNumber: u,
              company: null == p ? void 0 : p.id,
            },
          },
          { new: !0 }
        );
        return t
          .status(200)
          .json({ status: "ok", data: null == l ? void 0 : l.doc() });
      } catch (e) {
        return t.status(400).json({ status: 400, error: e });
      }
    },
  ]);
const $ = e.Router();
$.route("/analytics/summary").get((e, t) =>
  t.json({
    status: "ok",
    data: {
      income: 12e3,
      expenses: 8e3,
      account_balances: [
        { account_id: "12345", balance: "15000" },
        { account_id: "67890", balance: "5000" },
      ],
    },
  })
),
  $.route("/analytics/income-expense").get((e, t) =>
    t.json({
      status: "ok",
      data: {
        income: [
          {
            category: "Sales",
            amount: 1e4,
            subcategories: [
              { subcategory: "Product A", amount: 6e3 },
              { subcategory: "Product B", amount: 4e3 },
            ],
          },
          { category: "Investments", amount: 2e3 },
        ],
        expenses: [
          { category: "Salaries", amount: 5e3 },
          { category: "Rent", amount: 2e3 },
          { category: "Utilities", amount: 1e3 },
        ],
      },
    })
  );
const F = +p("PORT"),
  C = p("DB_URL");
(F && C) || (console.error("Missing env!"), process.exit(1));
const B = e();
B.use(o("combined")),
  B.use(
    s({
      contentSecurityPolicy: !1,
      frameguard: !1,
      crossOriginEmbedderPolicy: !1,
      crossOriginOpenerPolicy: !1,
      crossOriginResourcePolicy: !1,
    })
  ),
  B.use(t({ origin: "*" })),
  B.use(e.json()),
  B.use(e.urlencoded({ extended: !1 })),
  B.use("/api", [I, q, P, E, $]),
  B.listen(F, () => {
    console.log(`Server started on port ${F}: http://localhost:${F}`),
      (({ db: e }) => {
        const t = () => {
          n.connect(e, { dbName: "pina_app" })
            .then((e) =>
              console.info(`Successfully connected to ${e.connection.name}`)
            )
            .catch(
              (e) => (
                console.error("Error connecting to database: ", e),
                process.exit(1)
              )
            );
        };
        t(), n.connection.on("disconnected", t);
      })({ db: C });
  }).on("error", (e) => {
    console.log("ERROR: ", e);
  }),
  (exports.app = B);
