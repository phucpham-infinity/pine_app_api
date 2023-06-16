"use strict";var t=require("express"),e=require("cors"),s=require("helmet"),r=require("morgan"),o=require("dotenv"),n=require("mongoose"),a=require("jsonwebtoken"),i=require("zod"),u=require("bcryptjs"),c=require("lodash"),d=require("date-fns"),p=require("path");function y(t){var e=Object.create(null);return t&&Object.keys(t).forEach((function(s){if("default"!==s){var r=Object.getOwnPropertyDescriptor(t,s);Object.defineProperty(e,s,r.get?r:{enumerable:!0,get:function(){return t[s]}})}})),e.default=t,Object.freeze(e)}y(o).config();const l=t=>{var e;return null===(e=process.env)||void 0===e?void 0:e[t]},m=t=>new n.Schema({...t,createdAt:{type:Date,default:new Date},updatedAt:{type:Date,default:new Date}}),g=t=>(e,s,r)=>{try{t.parse({body:e.body,query:e.query,params:e.params}),r()}catch(t){return s.status(400).json({status:400,error:t.issues})}},f=(t,e,s)=>{var r;const o=null===(r=t.header("Authorization"))||void 0===r?void 0:r.replace("Bearer ","");if(!o)return e.status(403).json({status:403,error:"A token is required for authentication"});try{const e=a.verify(o,process.env.TOKEN_SECRET||"MICRO_APP");t.user=e}catch(t){return e.status(401).json({status:401,error:"Invalid Token"})}return s()},b=i.z.object({body:i.z.object({phone:i.z.string(),password:i.z.string(),isUseTouchId:i.z.boolean().default(!1),isUseFaceId:i.z.boolean().default(!1)})}),j=i.z.object({body:i.z.object({phone:i.z.string(),isUseTouchId:i.z.boolean().default(!1),isUseFaceId:i.z.boolean().default(!1)})}),v=i.z.object({body:i.z.object({phone:i.z.string(),password:i.z.string()})}),N=m({phone:{type:String,required:!0,unique:!0},isUseFaceId:{type:Boolean,required:!1},isUseTouchId:{type:Boolean,required:!1},password:{type:String,required:!0}});N.method("doc",(function(){return c.omit(this._doc,["password"])})),N.pre("save",(function(t){var e=this;if(!e.isModified("password"))return t();u.genSalt(10,(function(s,r){if(s)return t(s);u.hash(e.password,r,(function(s,r){if(s)return t(s);e.password=r,t()}))}))})),N.method("comparePassword",(function(t,e){u.compare(t,this.password,(function(t,s){if(t)return e(t,!1);e(null,s)}))})),N.method("generateToken",(function(){return a.sign(this.doc(),process.env.MICRO_APP||"MICRO_APP",{expiresIn:"30d"})}));var w=n.model("User",N);const I=n.Types.ObjectId,h="/user/register",z="/user/login-with-phone",q="/user/me",S="/user",k="/user/update-by-phone",_="/user/phone/:phone",A="/user/:id",O="/change/pin",T="/change/phone",D=t.Router();D.route(h).post([g(b),async(t,e)=>{const{phone:s,password:r,isUseFaceId:o=!1,isUseTouchId:n=!1}=t.body,a=new w({password:r,phone:s,isUseFaceId:o,isUseTouchId:n});try{const t=await a.save();return e.status(200).json({status:"ok",data:{...t.doc(),token:t.generateToken()}})}catch(t){return e.status(400).json({status:400,error:t})}}]),D.route(z).post([g(v),async(t,e)=>{const{password:s,phone:r}=(null==t?void 0:t.body)||{};try{const t=await w.findOne({phone:r});if(!t)return e.status(400).json({status:400,error:"User not found!"});t.comparePassword(s,((s,r)=>s?e.status(400).json({status:400,error:s.message}):r?e.status(200).json({status:"ok",data:{...t.doc(),token:t.generateToken()}}):e.status(400).json({status:400,error:"Password not match!"})))}catch(t){return e.status(400).json({status:400,error:t})}}]),D.route(q).get([f,async(t,e)=>{const{_id:s}=t.user||{},r=new I(s),o=await w.aggregate([{$lookup:{from:"userprofilerefs",localField:"_id",foreignField:"userId",as:"profile"}},{$lookup:{from:"profiles",localField:"profile.profileId",foreignField:"_id",as:"profile"}},{$unwind:{path:"$profile",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"usercompanyrefs",localField:"_id",foreignField:"userId",as:"company"}},{$lookup:{from:"companies",localField:"company.companyId",foreignField:"_id",as:"company"}},{$unwind:{path:"$company",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"requestcompanies",localField:"_id",foreignField:"userId",as:"requestCompany"}},{$unwind:{path:"$requestCompany",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"userraterefs",localField:"_id",foreignField:"userId",as:"rate"}},{$unwind:{path:"$rate",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"settings",localField:"_id",foreignField:"userId",as:"setting"}},{$unwind:{path:"$setting",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"accounts",localField:"_id",foreignField:"userId",as:"accounts"}},{$unwind:{path:"$profile.rate",preserveNullAndEmptyArrays:!0}},{$match:{_id:r}}]);return o?e.status(200).json({status:"ok",data:c.omit(null==o?void 0:o[0],["password","__v"])}):e.status(400).json({status:400,error:"User not found!"})}]),D.route(_).get([async(t,e)=>{const{phone:s}=t.params||{};try{const t=await w.findOne({phone:s});return t?e.status(200).json({status:"ok",data:null==t?void 0:t.doc()}):e.status(400).json({status:400,error:"User not found!"})}catch(t){return e.status(400).json({status:400,error:t})}}]),D.route(k).post([g(j),async(t,e)=>{const{isUseFaceId:s,isUseTouchId:r,phone:o}=t.body;try{const t=await w.findOneAndUpdate({phone:o},{$set:{isUseFaceId:s,isUseTouchId:r}},{new:!0});return t||e.status(400).json({status:400,error:"User not found!"}),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),D.route(S).get([f,async(t,e)=>{try{const t=await w.find();return e.status(200).json({status:"ok",data:null==t?void 0:t.map((t=>t.doc()))})}catch(t){return e.status(400).json({status:400,error:t})}}]),D.route(A).get([f,async(t,e)=>{const{id:s}=t.params;try{const t=await w.findById(s);return c.isEmpty(t)?e.status(400).json({status:400,error:"User not found!"}):e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),D.route(O).post([f,async(t,e)=>{const{password:s,newPassword:r}=(null==t?void 0:t.body)||{},{_id:o}=t.user||{};try{const t=await w.findById(o);if(!t)return e.status(400).json({status:400,error:"User not found!"});t.comparePassword(s,(async(s,o)=>{if(s)return e.status(400).json({status:400,error:s.message});if(!o)return e.status(400).json({status:400,error:"Password not match!"});t.password=r;const n=await t.save();return e.status(200).json({status:"ok",data:null==n?void 0:n.doc()})}))}catch(t){return e.status(400).json({status:400,error:t})}}]),D.route(T).post([f,async(t,e)=>{const{newPhone:s}=(null==t?void 0:t.body)||{},{phone:r}=t.user||{};try{const t=await w.findOne({phone:r});if(!t)return e.status(400).json({status:400,error:"User not found!"});t.phone=s;const o=await t.save();return e.status(200).json({status:"ok",data:null==o?void 0:o.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const E=t.Router();E.route("/ping").get(((t,e)=>{e.json({data:"pong",env:l("DB_URL")})}));const F=i.z.object({body:i.z.object({businessActivity:i.z.string(),companyName:i.z.string(),email:i.z.string(),legalType:i.z.string(),numberOfEmployees:i.z.number(),licenseNumber:i.z.string().optional(),backupEmail:i.z.string().optional(),coverUrl:i.z.string().optional()})}),U=i.z.object({body:i.z.object({businessActivity:i.z.string().optional(),email:i.z.string().optional(),backupEmail:i.z.string().optional(),legalType:i.z.string().optional(),numberOfEmployees:i.z.number().optional(),licenseNumber:i.z.string().optional(),coverUrl:i.z.string().optional()})}),$=m({companyName:{type:String,required:!0,unique:!0},email:{type:String,required:!0,unique:!0},businessActivity:{type:String,required:!0},legalType:{type:String,required:!0},numberOfEmployees:{type:Number,required:!0},licenseNumber:{type:String,required:!1,default:""},backupEmail:{type:String,required:!1,default:""},coverUrl:{type:String,required:!1},status:{type:String,required:!1,default:"PROCESSING"}});$.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var P=n.model("Company",$);const R=m({userId:{type:n.Types.ObjectId,ref:"User",required:!0},companyId:{type:n.Types.ObjectId,ref:"Company",required:!0}});R.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var B=n.model("UserCompanyRef",R);const C="/company",M="/company/:id",x="/company/by/:name",L="/company/join",V="/company/check",G=t.Router();G.route(C).post([f,g(F),async(t,e)=>{var s,r;const{businessActivity:o,companyName:n,email:a,legalType:i,numberOfEmployees:u,licenseNumber:d,backupEmail:p,coverUrl:y}=t.body,l=new P({businessActivity:o,companyName:n,email:a,legalType:i,numberOfEmployees:u,licenseNumber:d,backupEmail:p,coverUrl:y});try{const t=await l.save();return e.status(200).json({status:"ok",data:t.doc()})}catch(t){return console.log("error",t),11e3===t.code?e.status(400).json({status:400,message:`This ${null===(s=c.keys(null==t?void 0:t.keyPattern))||void 0===s?void 0:s[0]} is unavailable`,error:null===(r=c.keys(null==t?void 0:t.keyPattern))||void 0===r?void 0:r[0]}):e.status(400).json({status:400,error:t})}}]),G.route(x).get([f,async(t,e)=>{const{name:s}=t.params||{};try{const t=await P.findOne({companyName:s});return t||e.status(400).json({status:400,error:"Company not found!"}),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),G.route(L).post([f,async(t,e)=>{const{companyId:s}=t.query||{},{_id:r}=t.user||{};try{if(await B.findOne({userId:r})){const t=await B.findOneAndUpdate({userId:r},{$set:{companyId:s}},{new:!0});return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}const t=new B({userId:r,companyId:s}),o=await t.save();return e.status(200).json({status:"ok",data:null==o?void 0:o.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),G.route(V).get([f,async(t,e)=>{const{companyId:s}=t.query||{};console.log("companyId",s);try{const t=await P.findById(s);if(!t)return e.status(400).json({status:400,error:"Company not found!"});if("PROCESSING"===t.status)return t.status="VERIFIED",await t.save(),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()});if("VERIFIED"===t.status)return t.status="DELIVERY",await t.save(),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()});if("DELIVERY"===t.status)return t.status="DONE",await t.save(),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()});if("DONE"==t.status)return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),G.route(M).put([f,g(U),async(t,e)=>{const{businessActivity:s,email:r,legalType:o,numberOfEmployees:n,licenseNumber:a,backupEmail:i,coverUrl:u}=t.body,{id:c}=t.params;try{const t=await P.findByIdAndUpdate(c,{$set:{businessActivity:s,email:r,legalType:o,numberOfEmployees:n,licenseNumber:a,backupEmail:i,coverUrl:u}},{new:!0});return t||e.status(400).json({status:400,error:"Company not found!"}),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const J=i.z.object({body:i.z.object({firstName:i.z.string(),lastName:i.z.string(),nationality:i.z.string(),IDNumber:i.z.string().optional(),passportNumber:i.z.string().optional(),issueDate:i.z.string().optional(),expiryDate:i.z.string().optional()})}),Y=i.z.object({body:i.z.object({firstName:i.z.string().optional(),lastName:i.z.string().optional(),nationality:i.z.string().optional(),IDNumber:i.z.string().optional(),passportNumber:i.z.string().optional(),issueDate:i.z.string().optional(),expiryDate:i.z.string().optional()})}),K=m({firstName:{type:String,required:!0},lastName:{type:String,required:!0},nationality:{type:String,required:!0},IDNumber:{type:String,required:!1},passportNumber:{type:String,required:!1},issueDate:{type:Date,required:!1},expiryDate:{type:Date,required:!1}});K.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var H=n.model("Profile",K);const Q=m({userId:{type:n.Types.ObjectId,ref:"User",required:!0},profileId:{type:n.Types.ObjectId,ref:"Profile",unique:!0}});Q.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var W=n.model("UserProfileRef",Q);const X="/profile",Z="/profile/:id",tt=t.Router();tt.route(X).post([f,g(J),async(t,e)=>{const{IDNumber:s,firstName:r,expiryDate:o,issueDate:n,lastName:a,nationality:i,passportNumber:u}=t.body,{_id:c}=(null==t?void 0:t.user)||{};try{const t=new H({IDNumber:s,firstName:r,expiryDate:o,issueDate:n,lastName:a,nationality:i,passportNumber:u}),d=await t.save(),p=new W({userId:c,profileId:d.id});return await p.save(),e.status(200).json({status:"ok",data:d.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),tt.route(Z).put([f,g(Y),async(t,e)=>{const{IDNumber:s,firstName:r,expiryDate:o,issueDate:n,lastName:a,nationality:i,passportNumber:u}=t.body,{id:c}=t.params||{};try{const t=await H.findByIdAndUpdate(c,{$set:{IDNumber:s,firstName:r,expiryDate:o,issueDate:n,lastName:a,nationality:i,passportNumber:u}},{new:!0});return t||e.status(400).json({status:400,error:"Profile not found!"}),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const et=t.Router();et.route("/analytics/summary").get(((t,e)=>e.json({status:"ok",data:{income:12e3,expenses:8e3,account_balances:[{account_id:"12345",balance:"15000"},{account_id:"67890",balance:"5000"}]}}))),et.route("/analytics/income-expense").get(((t,e)=>e.json({status:"ok",data:{income:[{category:"Sales",amount:1e4,subcategories:[{subcategory:"Product A",amount:6e3},{subcategory:"Product B",amount:4e3}]},{category:"Investments",amount:2e3}],expenses:[{category:"Salaries",amount:5e3},{category:"Rent",amount:3e3},{category:"Utilities",amount:1e3}]}})));const st=i.z.object({body:i.z.object({companyName:i.z.string(),licenseNo:i.z.string(),registerNo:i.z.string(),companyEmail:i.z.string(),userEmail:i.z.string()})});i.z.object({body:i.z.object({companyName:i.z.string().optional(),licenseNo:i.z.string().optional(),registerNo:i.z.string().optional(),companyEmail:i.z.string().optional()})});const rt=m({companyName:{type:String,required:!0},licenseNo:{type:String,required:!0},registerNo:{type:String,required:!0},companyEmail:{type:String,required:!0},userEmail:{type:String,required:!0,unique:!0},userId:{type:n.Types.ObjectId,ref:"User",required:!0,unique:!0},status:{type:String,enum:["PENDING","APPROVAL","REJECT"],default:"PENDING"}});rt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var ot=n.model("RequestCompany",rt);const nt="/request-company",at="/request-company/approval",it="/request-company",ut=t.Router();ut.route(nt).post([f,g(st),async(t,e)=>{const{companyName:s,companyEmail:r,licenseNo:o,registerNo:n,userEmail:a}=t.body,{_id:i}=t.user||{},u=new ot({companyName:s,companyEmail:r,licenseNo:o,registerNo:n,userEmail:a,userId:i});try{const t=await u.save();return e.status(200).json({status:"ok",data:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),ut.route(at).put([f,async(t,e)=>{const{email:s}=t.query||{};try{const t=await ot.findOneAndUpdate({userEmail:s},{$set:{status:"APPROVAL"}},{new:!0});return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]),ut.route(it).get([f,async(t,e)=>{const s=c.pick(t.query,["status"]);try{const t=await ot.find(s);return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]);const ct=i.z.object({body:i.z.object({name:i.z.string(),fee:i.z.string(),transactions:i.z.string(),atmDeposits:i.z.string(),addOns:i.z.string(),books:i.z.string()})}),dt=i.z.object({body:i.z.object({fee:i.z.string().optional(),transactions:i.z.string().optional(),atmDeposits:i.z.string().optional(),addOns:i.z.string().optional(),books:i.z.string().optional()})}),pt=m({name:{type:String,required:!0,unique:!0},fee:{type:String,required:!0},transactions:{type:String,required:!0},atmDeposits:{type:String,required:!0},addOns:{type:String,required:!0},books:{type:String,required:!0}});pt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var yt=n.model("Rate",pt);const lt=m({userId:{type:n.Types.ObjectId,ref:"User",required:!0},rateName:{type:String,required:!0}});lt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var mt=n.model("UserRateRef",lt);const gt="/rate",ft="/rate/:name",bt="/rate",jt="/rate/:name",vt="/rate/join",Nt=t.Router();Nt.route(bt).get([f,async(t,e)=>{try{const t=await yt.find();return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]),Nt.route(jt).get([f,async(t,e)=>{const{name:s}=t.params;try{const t=await yt.findOne({name:s});return t?e.status(200).json({status:"ok",data:null==t?void 0:t.doc()}):e.status(400).json({status:400,error:"Rate not found!"})}catch(t){return e.status(400).json({status:400,error:t})}}]),Nt.route(vt).post([f,async(t,e)=>{const{rateName:s}=t.query||{},{_id:r}=t.user||{};try{if(await mt.findOne({userId:r})){const t=await mt.findOneAndUpdate({userId:r},{$set:{rateName:s}},{new:!0});return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}const t=new mt({userId:r,rateName:s}),o=await t.save();return e.status(200).json({status:"ok",data:null==o?void 0:o.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Nt.route(gt).post([f,g(ct),async(t,e)=>{const{name:s,fee:r,transactions:o,atmDeposits:n,addOns:a,books:i}=t.body;try{const t=new yt({name:s,fee:r,transactions:o,atmDeposits:n,addOns:a,books:i}),u=await t.save();return e.status(200).json({status:"ok",data:u.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Nt.route(ft).put([f,g(dt),async(t,e)=>{const{fee:s,transactions:r,atmDeposits:o,addOns:n,books:a}=t.body,{name:i}=t.params;try{const t=await yt.findOneAndUpdate({name:i},{$set:{fee:s,transactions:r,atmDeposits:o,addOns:n,books:a}},{new:!0});return c.isEmpty(t)?e.status(400).json({status:400,error:"Rete not found!"}):e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const wt=t.Router();wt.route("/request-delivery").post([(t,e)=>e.status(200).json({status:"ok",data:t.body})]);const It=i.z.object({body:i.z.object({userId:i.z.string()})});i.z.object({body:i.z.object({userId:i.z.string().optional()})});const ht=m({user:{type:n.Types.ObjectId,ref:"User",required:!0,unique:!0},status:{type:String,enum:["PENDING","APPROVAL","REJECT"],default:"PENDING"}});ht.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var zt=n.model("RequestAccount",ht);const qt="/request-account",St="/request-account/approval",kt="/request-account",_t=t.Router();_t.route(qt).post([f,g(It),async(t,e)=>{const{userId:s,status:r}=t.body,o=new zt({status:r,user:s});try{if(!await w.findById(s))return e.status(400).json({status:400,error:"User not found!"});const t=await o.save();return e.status(200).json({status:"ok",data:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),_t.route(St).put([f,async(t,e)=>{const{userId:s}=t.query||{};try{const t=await zt.findOneAndUpdate({user:s},{$set:{status:"APPROVAL"}},{new:!0});return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]),_t.route(kt).get([f,async(t,e)=>{const s=c.pick(t.query,["status"]);try{const t=await zt.find(s);return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]);const At=i.z.object({body:i.z.object({accountName:i.z.string(),accountNumber:i.z.string(),iban:i.z.string(),swiftCode:i.z.string(),isMain:i.z.boolean().optional()})}),Ot=i.z.object({body:i.z.object({accountName:i.z.string().optional(),accountNumber:i.z.string().optional(),iban:i.z.string().optional(),swiftCode:i.z.string().optional(),isMain:i.z.boolean().optional()})}),Tt=m({accountName:{type:String,required:!0,unique:!0},accountNumber:{type:String,required:!0,unique:!0},iban:{type:String,required:!0,unique:!0},swiftCode:{type:String,required:!0},balance:{type:Number,required:!0,default:0},isMain:{type:Boolean,required:!1,default:!1},userId:{type:n.Types.ObjectId,ref:"User",required:!0}});Tt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var Dt=n.model("Account",Tt);const Et="/account",Ft="/account/:id",Ut=t.Router();Ut.route(Et).post([f,g(At),async(t,e)=>{const{accountName:s,accountNumber:r,iban:o,swiftCode:n,isMain:a}=t.body,{_id:i}=t.user||{};try{const t=new Dt({accountName:s,accountNumber:r,iban:o,swiftCode:n,isMain:a,userId:i}),u=await t.save();return e.status(200).json({status:"ok",data:u.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Ut.route(Ft).put([f,g(Ot),async(t,e)=>{const{accountName:s,accountNumber:r,iban:o,swiftCode:n,isMain:a}=t.body,{id:i}=t.params;try{const t=await Dt.findByIdAndUpdate(i,{$set:{accountName:s,accountNumber:r,iban:o,swiftCode:n,isMain:a}},{new:!0});return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const $t=m({accountId:{type:n.Types.ObjectId,ref:"Account",required:!0},createdBy:{type:n.Types.ObjectId,ref:"User",required:!0},companyId:{type:n.Types.ObjectId,ref:"Company",required:!0},amount:{type:Number,required:!0},category:{type:String,required:!0},description:{type:String,required:!0},date:{type:String,required:!0},type:{type:String,required:!0},cardNumber:{type:String,required:!1}});$t.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var Pt=n.model("Transactions",$t);const Rt=m({companyId:{type:n.Types.ObjectId,ref:"Company",required:!0},createdBy:{type:n.Types.ObjectId,ref:"User",required:!0},accountNumber:{type:String,required:!0},transactionsId:{type:n.Types.ObjectId,ref:"Transactions",required:!0},recipientType:{type:String,required:!0},recipientName:{type:String,required:!0},recipientEmail:{type:String,required:!0},recipientPhone:{type:String,required:!0},detailDueDate:{type:String,required:!0},detailType:{type:String,required:!0},detailAmount:{type:String,required:!0},invoiceNumber:{type:String,required:!0,unique:!0}});Rt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var Bt=n.model("Invoice",Rt);const Ct=m({companyId:{type:n.Types.ObjectId,ref:"Company",required:!0},createdBy:{type:n.Types.ObjectId,ref:"User",required:!0},accountNumber:{type:String,required:!0},transactionsId:{type:n.Types.ObjectId,ref:"Transactions",required:!0},toCompanyName:{type:String,required:!0},toIban:{type:String,required:!0},toSwiftCode:{type:String,required:!0},detailType:{type:String,required:!0},detailAmount:{type:String,required:!0},transferNumber:{type:String,required:!0,unique:!0}});Ct.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var Mt=n.model("Transfer",Ct);const xt=n.Types.ObjectId,Lt=n.Types.ObjectId,Vt=i.z.object({body:i.z.object({accountId:i.z.string(),type:i.z.string().optional(),amount:i.z.string(),category:i.z.string(),description:i.z.string(),companyId:i.z.string(),cardNumber:i.z.string().optional(),accountNumber:i.z.string().optional(),recipientType:i.z.string().optional(),recipientName:i.z.string().optional(),recipientEmail:i.z.string().optional(),recipientPhone:i.z.string().optional(),detailDueDate:i.z.string().optional(),detailType:i.z.string().optional(),invoiceNumber:i.z.string().optional(),transactionsId:i.z.string().optional(),toCompanyName:i.z.string().optional(),toIban:i.z.string().optional(),toSwiftCode:i.z.string().optional(),detailAmount:i.z.string().optional(),transferNumber:i.z.string().optional()})}),Gt="/transaction",Jt="/transaction/account/:accountId",Yt="/transaction/company/:companyId",Kt="/transaction/deposit",Ht="/transaction/invoice",Qt="/transaction/transfer",Wt=t.Router();Wt.route(Gt).post([f,g(Vt),async(t,e)=>{const{accountId:s,type:r,amount:o,category:n,description:a,cardNumber:i}=t.body,{_id:u}=(null==t?void 0:t.user)||{};try{const t=new Pt({createdBy:u,accountId:s,amount:o,category:n,description:a,type:r,cardNumber:i,date:new Date}),c=await t.save();return e.status(200).json({status:"ok",data:c.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Wt.route(Kt).post([f,g(Vt),async(t,e)=>{const{accountId:s,amount:r,category:o,description:n,cardNumber:a,companyId:i}=t.body,{_id:u}=t.user||{};try{const t=await Dt.findById(s);if(!t)return e.status(400).json({status:400,error:"Account not found!"});if(!c.isNumber(+r))return e.status(400).json({status:400,error:"Amount invalid!"});t.balance=Number(null==t?void 0:t.balance)+Number(r),await t.save();const d=(new Date).toISOString(),p=new Pt({accountId:s,amount:Number(r),category:o,description:n,type:"DEPOSIT",date:d,createdBy:u,cardNumber:a,companyId:i,createdAt:d,updatedAt:d}),y=await p.save();return e.status(200).json({status:"ok",data:y.doc()})}catch(t){return e.status(400).json({status:400,error:JSON.stringify(t)})}}]),Wt.route(Ht).post([f,g(Vt),async(t,e)=>{const{accountId:s,amount:r,category:o,description:n,cardNumber:a,companyId:i,accountNumber:u,recipientType:d,recipientName:p,recipientEmail:y,recipientPhone:l,detailDueDate:m,detailType:g,invoiceNumber:f}=t.body,{_id:b}=t.user||{};try{const t=await Dt.findById(s);if(!t)return e.status(400).json({status:400,error:"Account not found!"});if(!c.isNumber(+r))return e.status(400).json({status:400,error:"Amount invalid!"});t.balance=Number(null==t?void 0:t.balance)-Number(r),await t.save();const j=(new Date).toISOString(),v=new Pt({accountId:s,amount:Number(r),category:o,description:n,type:"INVOICE",date:new Date,createdBy:b,cardNumber:a,companyId:i,createdAt:j,updatedAt:j}),N=await v.save(),w=new Bt({accountNumber:u,companyId:i,createdBy:b,detailAmount:Number(r),detailDueDate:m,detailType:g,recipientEmail:y,recipientName:p,recipientPhone:l,recipientType:d,transactionsId:N._id,invoiceNumber:f,createdAt:j,updatedAt:j}),I=await w.save();return e.status(200).json({status:"ok",data:{...N.doc(),invoice:I.doc()}})}catch(t){return e.status(400).json({status:400,error:JSON.stringify(t)})}}]),Wt.route(Qt).post([f,g(Vt),async(t,e)=>{const{accountId:s,amount:r,category:o,description:n,cardNumber:a,companyId:i,accountNumber:u,toCompanyName:d,toIban:p,toSwiftCode:y,detailType:l,transferNumber:m}=t.body,{_id:g}=t.user||{};try{const t=await Dt.findById(s);if(!t)return e.status(400).json({status:400,error:"Account not found!"});if(!c.isNumber(+r))return e.status(400).json({status:400,error:"Amount invalid!"});t.balance=Number(null==t?void 0:t.balance)-Number(r),await t.save();const f=(new Date).toISOString(),b=new Pt({accountId:s,amount:Number(r),category:o,description:n,type:"TRANSFER",date:new Date,createdBy:g,cardNumber:a,companyId:i,createdAt:f,updatedAt:f}),j=await b.save(),v=new Mt({accountNumber:u,companyId:i,createdBy:g,detailAmount:Number(r),detailType:l,transactionsId:j._id,toCompanyName:d,toIban:p,toSwiftCode:y,transferNumber:m,createdAt:f,updatedAt:f}),N=await v.save();return e.status(200).json({status:"ok",data:{...j.doc(),invoice:N.doc()}})}catch(t){return e.status(400).json({status:400,error:JSON.stringify(t)})}}]),Wt.route(Jt).get([f,async(t,e)=>{const{_id:s}=(null==t?void 0:t.user)||{},{accountId:r}=t.params||{},{invoiceType:o,transferType:n,type:a,fromDate:i,toDate:u}=t.query||{},p=new xt(s),y=new xt(r);if(u&&i&&!d.isAfter(new Date(u),new Date(i)))return e.status(400).json({status:400,error:"Invalid date range"});const l=c.pickBy({accountId:y,createdBy:p,"invoice.detailType":o,"transfer.detailType":n,type:a,createdAt:!!i&&!!u&&{$gte:new Date(i),$lte:new Date(u)}},c.identity);console.log("ưherw",l);try{const t=await Pt.aggregate([{$lookup:{from:"invoices",localField:"_id",foreignField:"transactionsId",as:"invoice"}},{$unwind:{path:"$invoice",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"transfers",localField:"_id",foreignField:"transactionsId",as:"transfer"}},{$unwind:{path:"$transfer",preserveNullAndEmptyArrays:!0}},{$match:l}]).sort({createdAt:-1});return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]),Wt.route(Yt).get([f,async(t,e)=>{const{_id:s}=(null==t?void 0:t.user)||{},{companyId:r}=t.params||{},{invoiceType:o,transferType:n,type:a,fromDate:i,toDate:u}=t.query||{},p=new Lt(s),y=new Lt(r);if(u&&i&&!d.isAfter(new Date(u),new Date(i)))return e.status(400).json({status:400,error:"Invalid date range"});const l=c.pickBy({companyId:y,createdBy:p,"invoice.detailType":o,"transfer.detailType":n,type:a,createdAt:!!i&&!!u&&{$gte:new Date(i),$lte:new Date(u)}},c.identity);console.log("ưherw",l);try{const t=await Pt.aggregate([{$lookup:{from:"invoices",localField:"_id",foreignField:"transactionsId",as:"invoice"}},{$unwind:{path:"$invoice",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"transfers",localField:"_id",foreignField:"transactionsId",as:"transfer"}},{$unwind:{path:"$transfer",preserveNullAndEmptyArrays:!0}},{$match:l},{$sort:{createdAt:-1}}]);return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]);const Xt=m({cardType:{type:String,required:!0},nicname:{type:String,required:!0},status:{type:String,required:!0},cardNumber:{type:String,required:!0},accountNumber:{type:String,required:!0},isMain:{type:Boolean,required:!1,default:!1}});Xt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var Zt=n.model("Card",Xt);const te=i.z.object({body:i.z.object({cardType:i.z.string(),nicname:i.z.string(),status:i.z.string(),cardNumber:i.z.string(),accountNumber:i.z.string(),isMain:i.z.boolean().optional()})});i.z.object({body:i.z.object({cardType:i.z.string().optional(),nicname:i.z.string().optional(),status:i.z.string().optional(),cardNumber:i.z.string().optional(),accountNumber:i.z.string().optional(),isMain:i.z.boolean().optional()})});const ee="/card",se="/card",re="/card/:id",oe="/card/account/:accountNumber",ne=t.Router();ne.route(se).post([f,g(te),async(t,e)=>{const{cardType:s,nicname:r,status:o,cardNumber:n,accountNumber:a,isMain:i}=t.body;try{const t=new Zt({accountNumber:a,cardNumber:n,cardType:s,nicname:r,status:o,isMain:i}),u=await t.save();return e.status(200).json({status:"ok",data:u.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),ne.route(re).get([f,async(t,e)=>{const{id:s}=t.params;try{const t=await Zt.findById(s);return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),ne.route(ee).get([f,async(t,e)=>{try{const t=await Zt.find();return e.status(200).json({status:"ok",data:null==t?void 0:t.map((t=>null==t?void 0:t.doc()))})}catch(t){return e.status(400).json({status:400,error:t})}}]),ne.route(oe).get([f,async(t,e)=>{const{accountNumber:s}=t.params;console.log("accountNumber",s);try{const t=await Zt.find({accountNumber:s});return e.status(200).json({status:"ok",data:null==t?void 0:t.map((t=>null==t?void 0:t.doc()))})}catch(t){return e.status(400).json({status:400,error:t})}}]);const ae=i.z.object({body:i.z.object({enableBiometric:i.z.boolean().optional(),confirmationMethods:i.z.string().optional(),receiveNotificationsForPaymentsAndTransfers:i.z.boolean().optional(),receiveNotificationsForDeposits:i.z.boolean().optional(),receiveNotificationsForOutstandingInvoices:i.z.boolean().optional(),receiveNotificationsForExceedingSetLimits:i.z.boolean().optional(),notificationMethods:i.z.string().optional()})}),ie=i.z.object({body:i.z.object({enableBiometric:i.z.boolean().optional(),confirmationMethods:i.z.string().optional(),receiveNotificationsForPaymentsAndTransfers:i.z.boolean().optional(),receiveNotificationsForDeposits:i.z.boolean().optional(),receiveNotificationsForOutstandingInvoices:i.z.boolean().optional(),receiveNotificationsForExceedingSetLimits:i.z.boolean().optional(),notificationMethods:i.z.string().optional()})}),ue=m({userId:{type:n.Types.ObjectId,ref:"User",required:!0,unique:!0},enableBiometric:{type:Boolean,required:!0,default:!1},confirmationMethods:{type:String,required:!0,default:"FACE_ID"},receiveNotificationsForPaymentsAndTransfers:{type:Boolean,required:!0,default:!1},receiveNotificationsForDeposits:{type:Boolean,required:!0,default:!1},receiveNotificationsForOutstandingInvoices:{type:Boolean,required:!0,default:!1},receiveNotificationsForExceedingSetLimits:{type:Boolean,required:!0,default:!1},notificationMethods:{type:String,required:!0,default:"EMAIL"}});ue.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var ce=n.model("Setting",ue);const de=n.Types.ObjectId,pe=n.Types.ObjectId,ye="/setting",le="/setting",me="/setting/me",ge="/setting/:id",fe=t.Router();fe.route(ye).post([f,g(ae),async(t,e)=>{const{confirmationMethods:s,enableBiometric:r,notificationMethods:o,receiveNotificationsForDeposits:n,receiveNotificationsForExceedingSetLimits:a,receiveNotificationsForOutstandingInvoices:i,receiveNotificationsForPaymentsAndTransfers:u}=t.body,{_id:c}=t.user||{};try{const t=new ce({userId:c,confirmationMethods:s,enableBiometric:r,notificationMethods:o,receiveNotificationsForDeposits:n,receiveNotificationsForExceedingSetLimits:a,receiveNotificationsForOutstandingInvoices:i,receiveNotificationsForPaymentsAndTransfers:u}),d=await t.save();return e.status(200).json({status:"ok",data:d.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),fe.route(le).put([f,g(ie),async(t,e)=>{const{confirmationMethods:s,enableBiometric:r,notificationMethods:o,receiveNotificationsForDeposits:n,receiveNotificationsForExceedingSetLimits:a,receiveNotificationsForOutstandingInvoices:i,receiveNotificationsForPaymentsAndTransfers:u}=t.body,{_id:c}=t.user||{},d=new de(c);try{const t=await ce.findOneAndUpdate({userId:d},{$set:{confirmationMethods:s,enableBiometric:r,notificationMethods:o,receiveNotificationsForDeposits:n,receiveNotificationsForExceedingSetLimits:a,receiveNotificationsForOutstandingInvoices:i,receiveNotificationsForPaymentsAndTransfers:u}},{new:!0});return t?e.status(200).json({status:"ok",data:null==t?void 0:t.doc()}):e.status(400).json({status:400,error:"Data not found!"})}catch(t){return e.status(400).json({status:400,error:t})}}]),fe.route(me).get([f,async(t,e)=>{const{_id:s}=t.user||{},r=new pe(s);try{const t=await ce.findOne({userId:r});return t?e.status(200).json({status:"ok",data:null==t?void 0:t.doc()}):e.status(400).json({status:400,error:"Setting not found!"})}catch(t){return e.status(400).json({status:400,error:t})}}]),fe.route(ge).get([f,async(t,e)=>{const{id:s}=t.params;try{const t=await ce.findById(s);return t?e.status(200).json({status:"ok",data:null==t?void 0:t.doc()}):e.status(400).json({status:400,error:"Setting not found!"})}catch(t){return e.status(400).json({status:400,error:t})}}]);const be=i.z.object({body:i.z.object({companyId:i.z.string(),url:i.z.string(),type:i.z.string(),name:i.z.string()})}),je=i.z.object({body:i.z.object({url:i.z.string().optional(),type:i.z.string().optional(),name:i.z.string().optional()})}),ve=m({companyId:{type:n.Types.ObjectId,ref:"Company",required:!0},url:{type:String,required:!1},type:{type:String,required:!1},name:{type:String,required:!1}});ve.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var Ne=n.model("Atachment",ve);const we=n.Types.ObjectId,Ie="/atachment",he="/atachment/:id",ze="/atachment/:id",qe="/atachment/compnay/:id",Se=t.Router();Se.route(Ie).post([f,g(be),async(t,e)=>{const{name:s,type:r,companyId:o,url:n}=t.body;try{const t=new Ne({name:s,type:r,companyId:o,url:n}),a=await t.save();return e.status(200).json({status:"ok",data:a.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Se.route(he).post([f,g(je),async(t,e)=>{const{name:s,type:r,url:o}=t.body,{id:n}=t.params;try{const t=await Ne.findByIdAndUpdate(n,{$set:{name:s,type:r,url:o}},{new:!0});return t||e.status(400).json({status:400,error:"Atachment not found!"}),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Se.route(ze).delete([f,async(t,e)=>{const{id:s}=t.params;try{const t=await Ne.findByIdAndDelete(s,{returnOriginal:!0});return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Se.route(qe).get([f,async(t,e)=>{const{id:s}=t.params,r=new we(s);try{const t=await Ne.find({companyId:r});return e.status(200).json({status:"ok",data:null==t?void 0:t.map((t=>null==t?void 0:t.doc()))})}catch(t){return e.status(400).json({status:400,error:t})}}]);const ke=i.z.object({body:i.z.object({message:i.z.string()})});i.z.object({body:i.z.object({message:i.z.string().optional(),isRead:i.z.boolean().optional()})});const _e=m({userId:{type:n.Types.ObjectId,ref:"User",required:!0},message:{type:String,required:!1},isRead:{type:String,required:!1,default:!1},receiverId:{type:n.Types.ObjectId,ref:"User",required:!1}});_e.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var Ae=n.model("Chat",_e);const Oe=n.Types.ObjectId,Te="/chat/send",De="/chat/me",Ee=t.Router();Ee.route(Te).post([f,g(ke),async(t,e)=>{const{message:s,receiverId:r}=t.body,{_id:o}=t.user||{};try{const t=new Ae({userId:o,message:s,receiverId:r}),n=await t.save();return e.status(200).json({status:"ok",data:n.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Ee.route(De).get([f,async(t,e)=>{const{_id:s}=t.user||{},r=new Oe(s);try{const t=await Ae.find({userId:r});return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]);const Fe=+l("PORT"),Ue=l("DB_URL");Fe&&Ue||(console.error("Missing env!"),process.exit(1));const $e=t();$e.use(r("combined")),$e.use(s({contentSecurityPolicy:!1,frameguard:!1,crossOriginEmbedderPolicy:!1,crossOriginOpenerPolicy:!1,crossOriginResourcePolicy:!1})),$e.use(e({origin:"*"})),$e.use(t.json()),$e.use(t.urlencoded({extended:!1})),$e.use(t.static(p.join(__dirname+"/public"))),$e.use("/api",[E,D,G,tt,et,ut,Nt,wt,_t,Ut,Wt,ne,fe,Se,Ee]),$e.get("*",(async(t,e)=>e.sendFile(p.join(__dirname+"/public/index.html")))),$e.listen(Fe,(()=>{console.log(`Server started on port ${Fe}: http://localhost:${Fe}`),(({db:t})=>{const e=()=>{n.connect(t,{dbName:"pina_app"}).then((t=>console.info(`Successfully connected to ${t.connection.name}`))).catch((t=>(console.error("Error connecting to database: ",t),process.exit(1))))};e(),n.connection.on("disconnected",e)})({db:Ue})})).on("error",(t=>{console.log("ERROR: ",t)})),exports.app=$e;
