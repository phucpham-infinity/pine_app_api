"use strict";var t=require("express"),e=require("cors"),s=require("helmet"),r=require("morgan"),o=require("dotenv"),n=require("mongoose"),a=require("jsonwebtoken"),i=require("zod"),u=require("bcryptjs"),c=require("lodash"),d=require("date-fns"),p=require("path");function y(t){var e=Object.create(null);return t&&Object.keys(t).forEach((function(s){if("default"!==s){var r=Object.getOwnPropertyDescriptor(t,s);Object.defineProperty(e,s,r.get?r:{enumerable:!0,get:function(){return t[s]}})}})),e.default=t,Object.freeze(e)}y(o).config();const l=t=>{var e;return null===(e=process.env)||void 0===e?void 0:e[t]},m=t=>new n.Schema({...t,createdAt:{type:Date,default:new Date},updatedAt:{type:Date,default:new Date}}),f=t=>(e,s,r)=>{try{t.parse({body:e.body,query:e.query,params:e.params}),r()}catch(t){return s.status(400).json({status:400,error:t.issues})}},g=(t,e,s)=>{var r;const o=null===(r=t.header("Authorization"))||void 0===r?void 0:r.replace("Bearer ","");if(!o)return e.status(403).json({status:403,error:"A token is required for authentication"});try{const e=a.verify(o,process.env.TOKEN_SECRET||"MICRO_APP");t.user=e}catch(t){return e.status(401).json({status:401,error:"Invalid Token"})}return s()},b=i.z.object({body:i.z.object({phone:i.z.string(),password:i.z.string(),isUseTouchId:i.z.boolean().default(!1),isUseFaceId:i.z.boolean().default(!1)})}),j=i.z.object({body:i.z.object({phone:i.z.string(),isUseTouchId:i.z.boolean().default(!1),isUseFaceId:i.z.boolean().default(!1)})}),v=i.z.object({body:i.z.object({phone:i.z.string(),password:i.z.string()})}),I=m({phone:{type:String,required:!0,unique:!0},isUseFaceId:{type:Boolean,required:!1},isUseTouchId:{type:Boolean,required:!1},password:{type:String,required:!0}});I.method("doc",(function(){return c.omit(this._doc,["password"])})),I.pre("save",(function(t){var e=this;if(!e.isModified("password"))return t();u.genSalt(10,(function(s,r){if(s)return t(s);u.hash(e.password,r,(function(s,r){if(s)return t(s);e.password=r,t()}))}))})),I.method("comparePassword",(function(t,e){u.compare(t,this.password,(function(t,s){if(t)return e(t,!1);e(null,s)}))})),I.method("generateToken",(function(){return a.sign(this.doc(),process.env.MICRO_APP||"MICRO_APP",{expiresIn:"30d"})}));var N=n.model("User",I);const w=n.Types.ObjectId,h="/user/register",z="/user/check",q="/user/login-with-phone",A="/user/me",k="/user",S="/user/update-by-phone",O="/user/phone/:phone",_="/user/:id",T="/change/pin",D="/change/phone",E=t.Router();E.route(h).post([f(b),async(t,e)=>{const{phone:s,password:r,isUseFaceId:o=!1,isUseTouchId:n=!1}=t.body,a=new N({password:r,phone:s,isUseFaceId:o,isUseTouchId:n});try{const t=await a.save();return e.status(200).json({status:"ok",data:{...t.doc(),token:t.generateToken()}})}catch(t){return e.status(400).json({status:400,error:t})}}]),E.route(z).post([f(b),async(t,e)=>{const{password:s,phone:r}=(null==t?void 0:t.body)||{};try{const t=await N.findOne({phone:r});if(!t)return e.status(400).json({status:400,error:"User not found!"});t.comparePassword(s,((s,r)=>s?e.status(400).json({status:400,error:s.message}):r?e.status(200).json({status:"ok",data:{...t.doc()}}):e.status(400).json({status:400,error:"Password not match!"})))}catch(t){return e.status(400).json({status:400,error:t})}}]),E.route(q).post([f(v),async(t,e)=>{const{password:s,phone:r}=(null==t?void 0:t.body)||{};try{const t=await N.findOne({phone:r});if(!t)return e.status(400).json({status:400,error:"User not found!"});t.comparePassword(s,((s,r)=>s?e.status(400).json({status:400,error:s.message}):r?e.status(200).json({status:"ok",data:{...t.doc(),token:t.generateToken()}}):e.status(400).json({status:400,error:"Password not match!"})))}catch(t){return e.status(400).json({status:400,error:t})}}]),E.route(A).get([g,async(t,e)=>{const{_id:s}=t.user||{},r=new w(s),o=await N.aggregate([{$lookup:{from:"userprofilerefs",localField:"_id",foreignField:"userId",as:"profile"}},{$lookup:{from:"profiles",localField:"profile.profileId",foreignField:"_id",as:"profile"}},{$unwind:{path:"$profile",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"usercompanyrefs",localField:"_id",foreignField:"userId",as:"company"}},{$lookup:{from:"companies",localField:"company.companyId",foreignField:"_id",as:"company"}},{$unwind:{path:"$company",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"requestcompanies",localField:"_id",foreignField:"userId",as:"requestCompany"}},{$unwind:{path:"$requestCompany",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"userraterefs",localField:"_id",foreignField:"userId",as:"rate"}},{$unwind:{path:"$rate",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"settings",localField:"_id",foreignField:"userId",as:"setting"}},{$unwind:{path:"$setting",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"accounts",localField:"_id",foreignField:"userId",as:"accounts"}},{$unwind:{path:"$profile.rate",preserveNullAndEmptyArrays:!0}},{$match:{_id:r}}]);return o?e.status(200).json({status:"ok",data:c.omit(null==o?void 0:o[0],["password","__v"])}):e.status(400).json({status:400,error:"User not found!"})}]),E.route(O).get([async(t,e)=>{const{phone:s}=t.params||{};try{const t=await N.findOne({phone:s});return t?e.status(200).json({status:"ok",data:null==t?void 0:t.doc()}):e.status(400).json({status:400,error:"User not found!"})}catch(t){return e.status(400).json({status:400,error:t})}}]),E.route(S).post([f(j),async(t,e)=>{const{isUseFaceId:s,isUseTouchId:r,phone:o}=t.body;try{const t=await N.findOneAndUpdate({phone:o},{$set:{isUseFaceId:s,isUseTouchId:r}},{new:!0});return t||e.status(400).json({status:400,error:"User not found!"}),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),E.route(k).get([g,async(t,e)=>{try{const t=await N.find();return e.status(200).json({status:"ok",data:null==t?void 0:t.map((t=>t.doc()))})}catch(t){return e.status(400).json({status:400,error:t})}}]),E.route(_).get([g,async(t,e)=>{const{id:s}=t.params;try{const t=await N.findById(s);return c.isEmpty(t)?e.status(400).json({status:400,error:"User not found!"}):e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),E.route(T).post([g,async(t,e)=>{const{password:s,newPassword:r}=(null==t?void 0:t.body)||{},{_id:o}=t.user||{};try{const t=await N.findById(o);if(!t)return e.status(400).json({status:400,error:"User not found!"});t.comparePassword(s,(async(s,o)=>{if(s)return e.status(400).json({status:400,error:s.message});if(!o)return e.status(400).json({status:400,error:"Password not match!"});t.password=r;const n=await t.save();return e.status(200).json({status:"ok",data:null==n?void 0:n.doc()})}))}catch(t){return e.status(400).json({status:400,error:t})}}]),E.route(D).post([g,async(t,e)=>{const{newPhone:s}=(null==t?void 0:t.body)||{},{phone:r}=t.user||{};try{const t=await N.findOne({phone:r});if(!t)return e.status(400).json({status:400,error:"User not found!"});t.phone=s;const o=await t.save();return e.status(200).json({status:"ok",data:null==o?void 0:o.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const F=t.Router();F.route("/ping").get(((t,e)=>{e.json({data:"pong",env:l("DB_URL")})}));const U=i.z.object({body:i.z.object({businessActivity:i.z.string(),companyName:i.z.string(),email:i.z.string(),legalType:i.z.string(),numberOfEmployees:i.z.number(),licenseNumber:i.z.string().optional(),backupEmail:i.z.string().optional(),coverUrl:i.z.string().optional()})}),P=i.z.object({body:i.z.object({businessActivity:i.z.string().optional(),email:i.z.string().optional(),backupEmail:i.z.string().optional(),legalType:i.z.string().optional(),numberOfEmployees:i.z.number().optional(),licenseNumber:i.z.string().optional(),coverUrl:i.z.string().optional()})}),$=m({companyName:{type:String,required:!0,unique:!0},email:{type:String,required:!0,unique:!0},businessActivity:{type:String,required:!0},legalType:{type:String,required:!0},numberOfEmployees:{type:Number,required:!0},licenseNumber:{type:String,required:!1,default:""},backupEmail:{type:String,required:!1,default:""},coverUrl:{type:String,required:!1},status:{type:String,required:!1,default:"PROCESSING"}});$.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var R=n.model("Company",$);const B=m({userId:{type:n.Types.ObjectId,ref:"User",required:!0},companyId:{type:n.Types.ObjectId,ref:"Company",required:!0}});B.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var C=n.model("UserCompanyRef",B);const M="/company",x="/company/:id",L="/company/by/:name",V="/company/join",G="/company/check",J=t.Router();J.route(M).post([g,f(U),async(t,e)=>{var s,r;const{businessActivity:o,companyName:n,email:a,legalType:i,numberOfEmployees:u,licenseNumber:d,backupEmail:p,coverUrl:y}=t.body,l=new R({businessActivity:o,companyName:n,email:a,legalType:i,numberOfEmployees:u,licenseNumber:d,backupEmail:p,coverUrl:y});try{const t=await l.save();return e.status(200).json({status:"ok",data:t.doc()})}catch(t){return console.log("error",t),11e3===t.code?e.status(400).json({status:400,message:`This ${null===(s=c.keys(null==t?void 0:t.keyPattern))||void 0===s?void 0:s[0]} is unavailable`,error:null===(r=c.keys(null==t?void 0:t.keyPattern))||void 0===r?void 0:r[0]}):e.status(400).json({status:400,error:t})}}]),J.route(L).get([g,async(t,e)=>{const{name:s}=t.params||{};try{const t=await R.findOne({companyName:s});return t||e.status(400).json({status:400,error:"Company not found!"}),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),J.route(V).post([g,async(t,e)=>{const{companyId:s}=t.query||{},{_id:r}=t.user||{};try{if(await C.findOne({userId:r})){const t=await C.findOneAndUpdate({userId:r},{$set:{companyId:s}},{new:!0});return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}const t=new C({userId:r,companyId:s}),o=await t.save();return e.status(200).json({status:"ok",data:null==o?void 0:o.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),J.route(G).get([g,async(t,e)=>{const{companyId:s}=t.query||{};console.log("companyId",s);try{const t=await R.findById(s);if(!t)return e.status(400).json({status:400,error:"Company not found!"});if("PROCESSING"===t.status)return t.status="VERIFIED",await t.save(),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()});if("VERIFIED"===t.status)return t.status="DELIVERY",await t.save(),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()});if("DELIVERY"===t.status)return t.status="DONE",await t.save(),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()});if("DONE"==t.status)return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),J.route(x).put([g,f(P),async(t,e)=>{const{businessActivity:s,email:r,legalType:o,numberOfEmployees:n,licenseNumber:a,backupEmail:i,coverUrl:u}=t.body,{id:c}=t.params;try{const t=await R.findByIdAndUpdate(c,{$set:{businessActivity:s,email:r,legalType:o,numberOfEmployees:n,licenseNumber:a,backupEmail:i,coverUrl:u}},{new:!0});return t||e.status(400).json({status:400,error:"Company not found!"}),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const Y=i.z.object({body:i.z.object({firstName:i.z.string(),lastName:i.z.string(),nationality:i.z.string(),IDNumber:i.z.string().optional(),passportNumber:i.z.string().optional(),issueDate:i.z.string().optional(),expiryDate:i.z.string().optional()})}),K=i.z.object({body:i.z.object({firstName:i.z.string().optional(),lastName:i.z.string().optional(),nationality:i.z.string().optional(),IDNumber:i.z.string().optional(),passportNumber:i.z.string().optional(),issueDate:i.z.string().optional(),expiryDate:i.z.string().optional()})}),H=m({firstName:{type:String,required:!0},lastName:{type:String,required:!0},nationality:{type:String,required:!0},IDNumber:{type:String,required:!1},passportNumber:{type:String,required:!1},issueDate:{type:Date,required:!1},expiryDate:{type:Date,required:!1}});H.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var Q=n.model("Profile",H);const W=m({userId:{type:n.Types.ObjectId,ref:"User",required:!0},profileId:{type:n.Types.ObjectId,ref:"Profile",unique:!0}});W.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var X=n.model("UserProfileRef",W);const Z="/profile",tt="/profile/:id",et=t.Router();et.route(Z).post([g,f(Y),async(t,e)=>{const{IDNumber:s,firstName:r,expiryDate:o,issueDate:n,lastName:a,nationality:i,passportNumber:u}=t.body,{_id:c}=(null==t?void 0:t.user)||{};try{const t=new Q({IDNumber:s,firstName:r,expiryDate:o,issueDate:n,lastName:a,nationality:i,passportNumber:u}),d=await t.save(),p=new X({userId:c,profileId:d.id});return await p.save(),e.status(200).json({status:"ok",data:d.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),et.route(tt).put([g,f(K),async(t,e)=>{const{IDNumber:s,firstName:r,expiryDate:o,issueDate:n,lastName:a,nationality:i,passportNumber:u}=t.body,{id:c}=t.params||{};try{const t=await Q.findByIdAndUpdate(c,{$set:{IDNumber:s,firstName:r,expiryDate:o,issueDate:n,lastName:a,nationality:i,passportNumber:u}},{new:!0});return t||e.status(400).json({status:400,error:"Profile not found!"}),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const st=t.Router();st.route("/analytics/summary").get(((t,e)=>e.json({status:"ok",data:{income:12e3,expenses:8e3,account_balances:[{account_id:"12345",balance:"15000"},{account_id:"67890",balance:"5000"}]}}))),st.route("/analytics/income-expense").get(((t,e)=>e.json({status:"ok",data:{income:[{category:"Sales",amount:1e4,subcategories:[{subcategory:"Product A",amount:6e3},{subcategory:"Product B",amount:4e3}]},{category:"Investments",amount:2e3}],expenses:[{category:"Salaries",amount:5e3},{category:"Rent",amount:3e3},{category:"Utilities",amount:1e3}]}})));const rt=i.z.object({body:i.z.object({companyName:i.z.string(),licenseNo:i.z.string(),registerNo:i.z.string(),companyEmail:i.z.string(),userEmail:i.z.string()})});i.z.object({body:i.z.object({companyName:i.z.string().optional(),licenseNo:i.z.string().optional(),registerNo:i.z.string().optional(),companyEmail:i.z.string().optional()})});const ot=m({companyName:{type:String,required:!0},licenseNo:{type:String,required:!0},registerNo:{type:String,required:!0},companyEmail:{type:String,required:!0},userEmail:{type:String,required:!0,unique:!0},userId:{type:n.Types.ObjectId,ref:"User",required:!0,unique:!0},status:{type:String,enum:["PENDING","APPROVAL","REJECT"],default:"PENDING"}});ot.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var nt=n.model("RequestCompany",ot);const at="/request-company",it="/request-company/approval",ut="/request-company",ct=t.Router();ct.route(at).post([g,f(rt),async(t,e)=>{const{companyName:s,companyEmail:r,licenseNo:o,registerNo:n,userEmail:a}=t.body,{_id:i}=t.user||{},u=new nt({companyName:s,companyEmail:r,licenseNo:o,registerNo:n,userEmail:a,userId:i});try{const t=await u.save();return e.status(200).json({status:"ok",data:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),ct.route(it).put([g,async(t,e)=>{const{email:s}=t.query||{};try{const t=await nt.findOneAndUpdate({userEmail:s},{$set:{status:"APPROVAL"}},{new:!0});return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]),ct.route(ut).get([g,async(t,e)=>{const s=c.pick(t.query,["status"]);try{const t=await nt.find(s);return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]);const dt=i.z.object({body:i.z.object({name:i.z.string(),fee:i.z.string(),transactions:i.z.string(),atmDeposits:i.z.string(),addOns:i.z.string(),books:i.z.string()})}),pt=i.z.object({body:i.z.object({fee:i.z.string().optional(),transactions:i.z.string().optional(),atmDeposits:i.z.string().optional(),addOns:i.z.string().optional(),books:i.z.string().optional()})}),yt=m({name:{type:String,required:!0,unique:!0},fee:{type:String,required:!0},transactions:{type:String,required:!0},atmDeposits:{type:String,required:!0},addOns:{type:String,required:!0},books:{type:String,required:!0}});yt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var lt=n.model("Rate",yt);const mt=m({userId:{type:n.Types.ObjectId,ref:"User",required:!0},rateName:{type:String,required:!0}});mt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var ft=n.model("UserRateRef",mt);const gt="/rate",bt="/rate/:name",jt="/rate",vt="/rate/:name",It="/rate/join",Nt=t.Router();Nt.route(jt).get([g,async(t,e)=>{try{const t=await lt.find();return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]),Nt.route(vt).get([g,async(t,e)=>{const{name:s}=t.params;try{const t=await lt.findOne({name:s});return t?e.status(200).json({status:"ok",data:null==t?void 0:t.doc()}):e.status(400).json({status:400,error:"Rate not found!"})}catch(t){return e.status(400).json({status:400,error:t})}}]),Nt.route(It).post([g,async(t,e)=>{const{rateName:s}=t.query||{},{_id:r}=t.user||{};try{if(await ft.findOne({userId:r})){const t=await ft.findOneAndUpdate({userId:r},{$set:{rateName:s}},{new:!0});return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}const t=new ft({userId:r,rateName:s}),o=await t.save();return e.status(200).json({status:"ok",data:null==o?void 0:o.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Nt.route(gt).post([g,f(dt),async(t,e)=>{const{name:s,fee:r,transactions:o,atmDeposits:n,addOns:a,books:i}=t.body;try{const t=new lt({name:s,fee:r,transactions:o,atmDeposits:n,addOns:a,books:i}),u=await t.save();return e.status(200).json({status:"ok",data:u.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Nt.route(bt).put([g,f(pt),async(t,e)=>{const{fee:s,transactions:r,atmDeposits:o,addOns:n,books:a}=t.body,{name:i}=t.params;try{const t=await lt.findOneAndUpdate({name:i},{$set:{fee:s,transactions:r,atmDeposits:o,addOns:n,books:a}},{new:!0});return c.isEmpty(t)?e.status(400).json({status:400,error:"Rete not found!"}):e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const wt=t.Router();wt.route("/request-delivery").post([(t,e)=>e.status(200).json({status:"ok",data:t.body})]);const ht=i.z.object({body:i.z.object({userId:i.z.string()})});i.z.object({body:i.z.object({userId:i.z.string().optional()})});const zt=m({user:{type:n.Types.ObjectId,ref:"User",required:!0,unique:!0},status:{type:String,enum:["PENDING","APPROVAL","REJECT"],default:"PENDING"}});zt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var qt=n.model("RequestAccount",zt);const At="/request-account",kt="/request-account/approval",St="/request-account",Ot=t.Router();Ot.route(At).post([g,f(ht),async(t,e)=>{const{userId:s,status:r}=t.body,o=new qt({status:r,user:s});try{if(!await N.findById(s))return e.status(400).json({status:400,error:"User not found!"});const t=await o.save();return e.status(200).json({status:"ok",data:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Ot.route(kt).put([g,async(t,e)=>{const{userId:s}=t.query||{};try{const t=await qt.findOneAndUpdate({user:s},{$set:{status:"APPROVAL"}},{new:!0});return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]),Ot.route(St).get([g,async(t,e)=>{const s=c.pick(t.query,["status"]);try{const t=await qt.find(s);return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]);const _t=i.z.object({body:i.z.object({accountName:i.z.string(),accountNumber:i.z.string(),iban:i.z.string(),swiftCode:i.z.string(),isMain:i.z.boolean().optional()})}),Tt=i.z.object({body:i.z.object({accountName:i.z.string().optional(),accountNumber:i.z.string().optional(),iban:i.z.string().optional(),swiftCode:i.z.string().optional(),isMain:i.z.boolean().optional()})}),Dt=m({accountName:{type:String,required:!0,unique:!0},accountNumber:{type:String,required:!0,unique:!0},iban:{type:String,required:!0,unique:!0},swiftCode:{type:String,required:!0},balance:{type:Number,required:!0,default:0},isMain:{type:Boolean,required:!1,default:!1},userId:{type:n.Types.ObjectId,ref:"User",required:!0}});Dt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var Et=n.model("Account",Dt);const Ft="/account",Ut="/account/:id",Pt="/account/:id",$t=t.Router();$t.route(Ft).post([g,f(_t),async(t,e)=>{const{accountName:s,accountNumber:r,iban:o,swiftCode:n,isMain:a}=t.body,{_id:i}=t.user||{};try{const t=new Et({accountName:s,accountNumber:r,iban:o,swiftCode:n,isMain:a,userId:i}),u=await t.save();return e.status(200).json({status:"ok",data:u.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),$t.route(Ut).put([g,f(Tt),async(t,e)=>{const{accountName:s,accountNumber:r,iban:o,swiftCode:n,isMain:a}=t.body,{id:i}=t.params;try{const t=await Et.findByIdAndUpdate(i,{$set:{accountName:s,accountNumber:r,iban:o,swiftCode:n,isMain:a}},{new:!0});return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),$t.route(Pt).delete([g,async(t,e)=>{const{id:s}=t.params;try{const t=await Et.findByIdAndRemove(s,{returnOriginal:!0});return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const Rt=m({accountId:{type:n.Types.ObjectId,ref:"Account",required:!0},createdBy:{type:n.Types.ObjectId,ref:"User",required:!0},companyId:{type:n.Types.ObjectId,ref:"Company",required:!0},amount:{type:Number,required:!0},category:{type:String,required:!0},description:{type:String,required:!0},date:{type:String,required:!0},type:{type:String,required:!0},cardNumber:{type:String,required:!1}});Rt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var Bt=n.model("Transactions",Rt);const Ct=m({companyId:{type:n.Types.ObjectId,ref:"Company",required:!0},createdBy:{type:n.Types.ObjectId,ref:"User",required:!0},accountNumber:{type:String,required:!0},transactionsId:{type:n.Types.ObjectId,ref:"Transactions",required:!0},recipientType:{type:String,required:!0},recipientName:{type:String,required:!0},recipientEmail:{type:String,required:!0},recipientPhone:{type:String,required:!0},detailDueDate:{type:String,required:!0},detailType:{type:String,required:!0},detailAmount:{type:String,required:!0},invoiceNumber:{type:String,required:!0,unique:!0}});Ct.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var Mt=n.model("Invoice",Ct);const xt=m({companyId:{type:n.Types.ObjectId,ref:"Company",required:!0},createdBy:{type:n.Types.ObjectId,ref:"User",required:!0},accountNumber:{type:String,required:!0},transactionsId:{type:n.Types.ObjectId,ref:"Transactions",required:!0},toCompanyName:{type:String,required:!0},toIban:{type:String,required:!0},toSwiftCode:{type:String,required:!0},detailType:{type:String,required:!0},detailAmount:{type:String,required:!0},transferNumber:{type:String,required:!0,unique:!0}});xt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var Lt=n.model("Transfer",xt);const Vt=n.Types.ObjectId,Gt=n.Types.ObjectId,Jt=i.z.object({body:i.z.object({accountId:i.z.string(),type:i.z.string().optional(),amount:i.z.string(),category:i.z.string(),description:i.z.string(),companyId:i.z.string(),cardNumber:i.z.string().optional(),accountNumber:i.z.string().optional(),recipientType:i.z.string().optional(),recipientName:i.z.string().optional(),recipientEmail:i.z.string().optional(),recipientPhone:i.z.string().optional(),detailDueDate:i.z.string().optional(),detailType:i.z.string().optional(),invoiceNumber:i.z.string().optional(),transactionsId:i.z.string().optional(),toCompanyName:i.z.string().optional(),toIban:i.z.string().optional(),toSwiftCode:i.z.string().optional(),detailAmount:i.z.string().optional(),transferNumber:i.z.string().optional()})}),Yt="/transaction",Kt="/transaction/account/:accountId",Ht="/transaction/company/:companyId",Qt="/transaction/deposit",Wt="/transaction/invoice",Xt="/transaction/transfer",Zt=t.Router();Zt.route(Yt).post([g,f(Jt),async(t,e)=>{const{accountId:s,type:r,amount:o,category:n,description:a,cardNumber:i}=t.body,{_id:u}=(null==t?void 0:t.user)||{};try{const t=new Bt({createdBy:u,accountId:s,amount:o,category:n,description:a,type:r,cardNumber:i,date:new Date}),c=await t.save();return e.status(200).json({status:"ok",data:c.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Zt.route(Qt).post([g,f(Jt),async(t,e)=>{const{accountId:s,amount:r,category:o,description:n,cardNumber:a,companyId:i}=t.body,{_id:u}=t.user||{};try{const t=await Et.findById(s);if(!t)return e.status(400).json({status:400,error:"Account not found!"});if(!c.isNumber(+r))return e.status(400).json({status:400,error:"Amount invalid!"});t.balance=Number(null==t?void 0:t.balance)+Number(r),await t.save();const d=(new Date).toISOString(),p=new Bt({accountId:s,amount:Number(r),category:o,description:n,type:"DEPOSIT",date:d,createdBy:u,cardNumber:a,companyId:i,createdAt:d,updatedAt:d}),y=await p.save();return e.status(200).json({status:"ok",data:y.doc()})}catch(t){return e.status(400).json({status:400,error:JSON.stringify(t)})}}]),Zt.route(Wt).post([g,f(Jt),async(t,e)=>{const{accountId:s,amount:r,category:o,description:n,cardNumber:a,companyId:i,accountNumber:u,recipientType:d,recipientName:p,recipientEmail:y,recipientPhone:l,detailDueDate:m,detailType:f,invoiceNumber:g}=t.body,{_id:b}=t.user||{};try{const t=await Et.findById(s);if(!t)return e.status(400).json({status:400,error:"Account not found!"});if(!c.isNumber(+r))return e.status(400).json({status:400,error:"Amount invalid!"});t.balance=Number(null==t?void 0:t.balance)+Number(r),await t.save();const j=(new Date).toISOString(),v=new Bt({accountId:s,amount:Number(r),category:o,description:n,type:"INVOICE",date:new Date,createdBy:b,cardNumber:a,companyId:i,createdAt:j,updatedAt:j}),I=await v.save(),N=new Mt({accountNumber:u,companyId:i,createdBy:b,detailAmount:Number(r),detailDueDate:m,detailType:f,recipientEmail:y,recipientName:p,recipientPhone:l,recipientType:d,transactionsId:I._id,invoiceNumber:g,createdAt:j,updatedAt:j}),w=await N.save();return e.status(200).json({status:"ok",data:{...I.doc(),invoice:w.doc()}})}catch(t){return e.status(400).json({status:400,error:JSON.stringify(t)})}}]),Zt.route(Xt).post([g,f(Jt),async(t,e)=>{const{accountId:s,amount:r,category:o,description:n,cardNumber:a,companyId:i,accountNumber:u,toCompanyName:d,toIban:p,toSwiftCode:y,detailType:l,transferNumber:m}=t.body,{_id:f}=t.user||{};try{const t=await Et.findById(s);if(!t)return e.status(400).json({status:400,error:"Account not found!"});if(!c.isNumber(+r))return e.status(400).json({status:400,error:"Amount invalid!"});t.balance=Number(null==t?void 0:t.balance)-Number(r),await t.save();const g=(new Date).toISOString(),b=new Bt({accountId:s,amount:Number(r),category:o,description:n,type:"TRANSFER",date:new Date,createdBy:f,cardNumber:a,companyId:i,createdAt:g,updatedAt:g}),j=await b.save(),v=new Lt({accountNumber:u,companyId:i,createdBy:f,detailAmount:Number(r),detailType:l,transactionsId:j._id,toCompanyName:d,toIban:p,toSwiftCode:y,transferNumber:m,createdAt:g,updatedAt:g}),I=await v.save();return e.status(200).json({status:"ok",data:{...j.doc(),invoice:I.doc()}})}catch(t){return e.status(400).json({status:400,error:JSON.stringify(t)})}}]),Zt.route(Kt).get([g,async(t,e)=>{const{_id:s}=(null==t?void 0:t.user)||{},{accountId:r}=t.params||{},{invoiceType:o,transferType:n,type:a,fromDate:i,toDate:u}=t.query||{},p=new Vt(s),y=new Vt(r);if(u&&i&&!d.isAfter(new Date(u),new Date(i)))return e.status(400).json({status:400,error:"Invalid date range"});const l=c.pickBy({accountId:y,createdBy:p,"invoice.detailType":o,"transfer.detailType":n,type:a,createdAt:!!i&&!!u&&{$gte:new Date(i),$lte:new Date(u)}},c.identity);console.log("ưherw",l);try{const t=await Bt.aggregate([{$lookup:{from:"invoices",localField:"_id",foreignField:"transactionsId",as:"invoice"}},{$unwind:{path:"$invoice",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"transfers",localField:"_id",foreignField:"transactionsId",as:"transfer"}},{$unwind:{path:"$transfer",preserveNullAndEmptyArrays:!0}},{$match:l}]).sort({createdAt:-1});return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]),Zt.route(Ht).get([g,async(t,e)=>{const{_id:s}=(null==t?void 0:t.user)||{},{companyId:r}=t.params||{},{invoiceType:o,transferType:n,type:a,fromDate:i,toDate:u}=t.query||{},p=new Gt(s),y=new Gt(r);if(u&&i&&!d.isAfter(new Date(u),new Date(i)))return e.status(400).json({status:400,error:"Invalid date range"});const l=c.pickBy({companyId:y,createdBy:p,"invoice.detailType":o,"transfer.detailType":n,type:a,createdAt:!!i&&!!u&&{$gte:new Date(i),$lte:new Date(u)}},c.identity);console.log("ưherw",l);try{const t=await Bt.aggregate([{$lookup:{from:"invoices",localField:"_id",foreignField:"transactionsId",as:"invoice"}},{$unwind:{path:"$invoice",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"transfers",localField:"_id",foreignField:"transactionsId",as:"transfer"}},{$unwind:{path:"$transfer",preserveNullAndEmptyArrays:!0}},{$match:l},{$sort:{createdAt:-1}}]);return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]);const te=m({cardType:{type:String,required:!0},nicname:{type:String,required:!0},status:{type:String,required:!0},cardNumber:{type:String,required:!0},accountNumber:{type:String,required:!0},isMain:{type:Boolean,required:!1,default:!1}});te.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var ee=n.model("Card",te);const se=i.z.object({body:i.z.object({cardType:i.z.string(),nicname:i.z.string(),status:i.z.string(),cardNumber:i.z.string(),accountNumber:i.z.string(),isMain:i.z.boolean().optional()})});i.z.object({body:i.z.object({cardType:i.z.string().optional(),nicname:i.z.string().optional(),status:i.z.string().optional(),cardNumber:i.z.string().optional(),accountNumber:i.z.string().optional(),isMain:i.z.boolean().optional()})});const re="/card",oe="/card",ne="/card/:id",ae="/card/account/:accountNumber",ie=t.Router();ie.route(oe).post([g,f(se),async(t,e)=>{const{cardType:s,nicname:r,status:o,cardNumber:n,accountNumber:a,isMain:i}=t.body;try{const t=new ee({accountNumber:a,cardNumber:n,cardType:s,nicname:r,status:o,isMain:i}),u=await t.save();return e.status(200).json({status:"ok",data:u.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),ie.route(ne).get([g,async(t,e)=>{const{id:s}=t.params;try{const t=await ee.findById(s);return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),ie.route(re).get([g,async(t,e)=>{try{const t=await ee.find();return e.status(200).json({status:"ok",data:null==t?void 0:t.map((t=>null==t?void 0:t.doc()))})}catch(t){return e.status(400).json({status:400,error:t})}}]),ie.route(ae).get([g,async(t,e)=>{const{accountNumber:s}=t.params;console.log("accountNumber",s);try{const t=await ee.find({accountNumber:s});return e.status(200).json({status:"ok",data:null==t?void 0:t.map((t=>null==t?void 0:t.doc()))})}catch(t){return e.status(400).json({status:400,error:t})}}]);const ue=i.z.object({body:i.z.object({enableBiometric:i.z.boolean().optional(),confirmationMethods:i.z.string().optional(),receiveNotificationsForPaymentsAndTransfers:i.z.boolean().optional(),receiveNotificationsForDeposits:i.z.boolean().optional(),receiveNotificationsForOutstandingInvoices:i.z.boolean().optional(),receiveNotificationsForExceedingSetLimits:i.z.boolean().optional(),notificationMethods:i.z.string().optional(),mainAccountId:i.z.string().optional()})}),ce=i.z.object({body:i.z.object({enableBiometric:i.z.boolean().optional(),confirmationMethods:i.z.string().optional(),receiveNotificationsForPaymentsAndTransfers:i.z.boolean().optional(),receiveNotificationsForDeposits:i.z.boolean().optional(),receiveNotificationsForOutstandingInvoices:i.z.boolean().optional(),receiveNotificationsForExceedingSetLimits:i.z.boolean().optional(),notificationMethods:i.z.string().optional(),mainAccountId:i.z.string().optional()})}),de=m({userId:{type:n.Types.ObjectId,ref:"User",required:!0,unique:!0},mainAccountId:{type:n.Types.ObjectId,ref:"Account",required:!1},enableBiometric:{type:Boolean,required:!0,default:!1},confirmationMethods:{type:String,required:!0,default:"FACE_ID"},receiveNotificationsForPaymentsAndTransfers:{type:Boolean,required:!0,default:!1},receiveNotificationsForDeposits:{type:Boolean,required:!0,default:!1},receiveNotificationsForOutstandingInvoices:{type:Boolean,required:!0,default:!1},receiveNotificationsForExceedingSetLimits:{type:Boolean,required:!0,default:!1},notificationMethods:{type:String,required:!0,default:"EMAIL"}});de.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var pe=n.model("Setting",de);const ye=n.Types.ObjectId,le=n.Types.ObjectId,me="/setting",fe="/setting",ge="/setting/me",be="/setting/:id",je=t.Router();je.route(me).post([g,f(ue),async(t,e)=>{const{confirmationMethods:s,enableBiometric:r,notificationMethods:o,receiveNotificationsForDeposits:n,receiveNotificationsForExceedingSetLimits:a,receiveNotificationsForOutstandingInvoices:i,receiveNotificationsForPaymentsAndTransfers:u,mainAccountId:c}=t.body,{_id:d}=t.user||{};try{const t=new pe({userId:d,confirmationMethods:s,enableBiometric:r,notificationMethods:o,receiveNotificationsForDeposits:n,receiveNotificationsForExceedingSetLimits:a,receiveNotificationsForOutstandingInvoices:i,receiveNotificationsForPaymentsAndTransfers:u,mainAccountId:c}),p=await t.save();return e.status(200).json({status:"ok",data:p.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),je.route(fe).put([g,f(ce),async(t,e)=>{const{confirmationMethods:s,enableBiometric:r,notificationMethods:o,receiveNotificationsForDeposits:n,receiveNotificationsForExceedingSetLimits:a,receiveNotificationsForOutstandingInvoices:i,receiveNotificationsForPaymentsAndTransfers:u,mainAccountId:c}=t.body,{_id:d}=t.user||{},p=new ye(d);try{const t=await pe.findOneAndUpdate({userId:p},{$set:{confirmationMethods:s,enableBiometric:r,notificationMethods:o,receiveNotificationsForDeposits:n,receiveNotificationsForExceedingSetLimits:a,receiveNotificationsForOutstandingInvoices:i,receiveNotificationsForPaymentsAndTransfers:u,mainAccountId:c}},{new:!0});if(!t){const t=new pe({userId:d,confirmationMethods:s,enableBiometric:r,notificationMethods:o,receiveNotificationsForDeposits:n,receiveNotificationsForExceedingSetLimits:a,receiveNotificationsForOutstandingInvoices:i,receiveNotificationsForPaymentsAndTransfers:u,mainAccountId:c}),p=await t.save();return e.status(200).json({status:"ok",data:p.doc()})}return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),je.route(ge).get([g,async(t,e)=>{const{_id:s}=t.user||{},r=new le(s);try{const t=await pe.findOne({userId:r});return t?e.status(200).json({status:"ok",data:null==t?void 0:t.doc()}):e.status(400).json({status:400,error:"Setting not found!"})}catch(t){return e.status(400).json({status:400,error:t})}}]),je.route(be).get([g,async(t,e)=>{const{id:s}=t.params;try{const t=await pe.findById(s);return t?e.status(200).json({status:"ok",data:null==t?void 0:t.doc()}):e.status(400).json({status:400,error:"Setting not found!"})}catch(t){return e.status(400).json({status:400,error:t})}}]);const ve=i.z.object({body:i.z.object({companyId:i.z.string(),url:i.z.string(),type:i.z.string(),name:i.z.string()})}),Ie=i.z.object({body:i.z.object({url:i.z.string().optional(),type:i.z.string().optional(),name:i.z.string().optional()})}),Ne=m({companyId:{type:n.Types.ObjectId,ref:"Company",required:!0},url:{type:String,required:!1},type:{type:String,required:!1},name:{type:String,required:!1}});Ne.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var we=n.model("Atachment",Ne);const he=n.Types.ObjectId,ze="/atachment",qe="/atachment/:id",Ae="/atachment/:id",ke="/atachment/compnay/:id",Se=t.Router();Se.route(ze).post([g,f(ve),async(t,e)=>{const{name:s,type:r,companyId:o,url:n}=t.body;try{const t=new we({name:s,type:r,companyId:o,url:n}),a=await t.save();return e.status(200).json({status:"ok",data:a.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Se.route(qe).post([g,f(Ie),async(t,e)=>{const{name:s,type:r,url:o}=t.body,{id:n}=t.params;try{const t=await we.findByIdAndUpdate(n,{$set:{name:s,type:r,url:o}},{new:!0});return t||e.status(400).json({status:400,error:"Atachment not found!"}),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Se.route(Ae).delete([g,async(t,e)=>{const{id:s}=t.params;try{const t=await we.findByIdAndDelete(s,{returnOriginal:!0});return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Se.route(ke).get([g,async(t,e)=>{const{id:s}=t.params,r=new he(s);try{const t=await we.find({companyId:r});return e.status(200).json({status:"ok",data:null==t?void 0:t.map((t=>null==t?void 0:t.doc()))})}catch(t){return e.status(400).json({status:400,error:t})}}]);const Oe=i.z.object({body:i.z.object({message:i.z.string()})});i.z.object({body:i.z.object({message:i.z.string().optional(),isRead:i.z.boolean().optional()})});const _e=m({userId:{type:n.Types.ObjectId,ref:"User",required:!0},message:{type:String,required:!1},isRead:{type:String,required:!1,default:!1},receiverId:{type:n.Types.ObjectId,ref:"User",required:!1}});_e.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var Te=n.model("Chat",_e);const De=n.Types.ObjectId,Ee="/chat/send",Fe="/chat/me",Ue=t.Router();Ue.route(Ee).post([g,f(Oe),async(t,e)=>{const{message:s,receiverId:r}=t.body,{_id:o}=t.user||{};try{const t=new Te({userId:o,message:s,receiverId:r}),n=await t.save();return e.status(200).json({status:"ok",data:n.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Ue.route(Fe).get([g,async(t,e)=>{const{_id:s}=t.user||{},r=new De(s);try{const t=await Te.find({userId:r});return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]);const Pe=+l("PORT"),$e=l("DB_URL");Pe&&$e||(console.error("Missing env!"),process.exit(1));const Re=t();Re.use(r("combined")),Re.use(s({contentSecurityPolicy:!1,frameguard:!1,crossOriginEmbedderPolicy:!1,crossOriginOpenerPolicy:!1,crossOriginResourcePolicy:!1})),Re.use(e({origin:"*"})),Re.use(t.json()),Re.use(t.urlencoded({extended:!1})),Re.use(t.static(p.join(__dirname+"/public"))),Re.use("/api",[F,E,J,et,st,ct,Nt,wt,Ot,$t,Zt,ie,je,Se,Ue]),Re.get("*",(async(t,e)=>e.sendFile(p.join(__dirname+"/public/index.html")))),Re.listen(Pe,(()=>{console.log(`Server started on port ${Pe}: http://localhost:${Pe}`),(({db:t})=>{const e=()=>{n.connect(t,{dbName:"pina_app"}).then((t=>console.info(`Successfully connected to ${t.connection.name}`))).catch((t=>(console.error("Error connecting to database: ",t),process.exit(1))))};e(),n.connection.on("disconnected",e)})({db:$e})})).on("error",(t=>{console.log("ERROR: ",t)})),exports.app=Re;
