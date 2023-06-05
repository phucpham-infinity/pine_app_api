"use strict";var e=require("express"),r=require("cors"),t=require("helmet"),s=require("morgan"),o=require("dotenv"),n=require("mongoose"),a=require("bcryptjs"),i=require("lodash"),u=require("jsonwebtoken"),c=require("zod");function d(e){var r=Object.create(null);return e&&Object.keys(e).forEach((function(t){if("default"!==t){var s=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(r,t,s.get?s:{enumerable:!0,get:function(){return e[t]}})}})),r.default=e,Object.freeze(r)}d(o).config();const l=e=>{var r;return null===(r=process.env)||void 0===r?void 0:r[e]},p=new n.Schema({email:{type:String,required:!0,unique:!0},username:{type:String,required:!0},password:{type:String,required:!0},createdAt:{type:Date,default:new Date},updatedAt:{type:Date,default:new Date}});p.method("doc",(function(){return i.omit(this._doc,["password","__v"])})),p.pre("save",(function(e){var r=this;if(!r.isModified("password"))return e();a.genSalt(10,(function(t,s){if(t)return e(t);a.hash(r.password,s,(function(t,s){if(t)return e(t);r.password=s,e()}))}))})),p.method("comparePassword",(function(e,r){a.compare(e,this.password,(function(e,t){if(e)return r(e,!1);r(null,t)}))})),p.method("generateToken",(function(){return u.sign(this.doc(),process.env.MICRO_APP||"MICRO_APP",{expiresIn:"30d"})}));var m=n.model("User",p);const f=e=>(r,t,s)=>{try{e.parse({body:r.body,query:r.query,params:r.params}),s()}catch(e){return t.status(400).json({status:400,error:e.issues})}},g=e.Router(),y=c.z.object({body:c.z.object({email:c.z.string().email(),password:c.z.string().min(5)})});g.use(f(y)).route("/user/register").post((async(e,r)=>{const t=e.body,s=new m({username:t.username,password:t.password,email:t.email});try{const e=await s.save();return r.status(200).json({status:"ok",data:e.doc()})}catch(e){return r.status(400).json({status:400,error:e})}})),g.use(f(y)).route("/user/login-with-email-password").post((async(e,r)=>{const t=e.body,s=(null==t?void 0:t.password)||"",o=(null==t?void 0:t.email)||"";try{const e=await m.findOne({email:o});if(!e)return r.status(400).json({status:400,error:"User not found!"});e.comparePassword(s,((t,s)=>t?r.status(400).json({status:400,error:t.message}):s?r.status(200).json({status:"ok",data:{...e.doc(),token:e.generateToken()}}):r.status(400).json({status:400,error:"Password not match!"})))}catch(e){return r.status(400).json({status:400,error:e})}}));const w=e.Router();w.route("/ping").get(((e,r)=>{r.send("pong")}));const h=+l("PORT"),b=l("DB_URL");h&&b||(console.error("Missing env!"),process.exit(1));const j=e();j.use(s("combined")),j.use(t({contentSecurityPolicy:!1,frameguard:!1,crossOriginEmbedderPolicy:!1,crossOriginOpenerPolicy:!1,crossOriginResourcePolicy:!1})),j.use(r({origin:"*"})),j.use(e.json()),j.use(e.urlencoded({extended:!1})),j.use("/api",[w,g]),j.listen(h,(()=>{console.log(`Server started on port ${h}: http://localhost:${h}`),(({db:e})=>{const r=()=>{n.connect(e).then((e=>console.info(`Successfully connected to ${e.connection.name}`))).catch((e=>(console.error("Error connecting to database: ",e),process.exit(1))))};r(),n.connection.on("disconnected",r)})({db:b})})).on("error",(e=>{console.log("ERROR: ",e)})),exports.app=j;
