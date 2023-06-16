"use strict";var t=require("express"),e=require("cors"),r=require("helmet"),s=require("morgan"),o=require("dotenv"),n=require("mongoose"),a=require("jsonwebtoken"),i=require("zod"),u=require("bcryptjs"),c=require("lodash"),d=require("date-fns"),p=require("path");function y(t){var e=Object.create(null);return t&&Object.keys(t).forEach((function(r){if("default"!==r){var s=Object.getOwnPropertyDescriptor(t,r);Object.defineProperty(e,r,s.get?s:{enumerable:!0,get:function(){return t[r]}})}})),e.default=t,Object.freeze(e)}y(o).config();const l=t=>{var e;return null===(e=process.env)||void 0===e?void 0:e[t]},m=t=>new n.Schema({...t,createdAt:{type:Date,default:new Date},updatedAt:{type:Date,default:new Date}}),g=t=>(e,r,s)=>{try{t.parse({body:e.body,query:e.query,params:e.params}),s()}catch(t){return r.status(400).json({status:400,error:t.issues})}},b=(t,e,r)=>{var s;const o=null===(s=t.header("Authorization"))||void 0===s?void 0:s.replace("Bearer ","");if(!o)return e.status(403).json({status:403,error:"A token is required for authentication"});try{const e=a.verify(o,process.env.TOKEN_SECRET||"MICRO_APP");t.user=e}catch(t){return e.status(401).json({status:401,error:"Invalid Token"})}return r()},f=i.z.object({body:i.z.object({phone:i.z.string(),password:i.z.string(),isUseTouchId:i.z.boolean().default(!1),isUseFaceId:i.z.boolean().default(!1)})}),j=i.z.object({body:i.z.object({phone:i.z.string(),isUseTouchId:i.z.boolean().default(!1),isUseFaceId:i.z.boolean().default(!1)})}),v=i.z.object({body:i.z.object({phone:i.z.string(),password:i.z.string()})}),N=m({phone:{type:String,required:!0,unique:!0},isUseFaceId:{type:Boolean,required:!1},isUseTouchId:{type:Boolean,required:!1},password:{type:String,required:!0}});N.method("doc",(function(){return c.omit(this._doc,["password"])})),N.pre("save",(function(t){var e=this;if(!e.isModified("password"))return t();u.genSalt(10,(function(r,s){if(r)return t(r);u.hash(e.password,s,(function(r,s){if(r)return t(r);e.password=s,t()}))}))})),N.method("comparePassword",(function(t,e){u.compare(t,this.password,(function(t,r){if(t)return e(t,!1);e(null,r)}))})),N.method("generateToken",(function(){return a.sign(this.doc(),process.env.MICRO_APP||"MICRO_APP",{expiresIn:"30d"})}));var w=n.model("User",N);const h=n.Types.ObjectId,z="/user/register",I="/user/login-with-phone",q="/user/me",_="/user",S="/user/update-by-phone",k="/user/phone/:phone",O="/user/:id",A="/change/pin",T="/change/phone",D=t.Router();D.route(z).post([g(f),async(t,e)=>{const{phone:r,password:s,isUseFaceId:o=!1,isUseTouchId:n=!1}=t.body,a=new w({password:s,phone:r,isUseFaceId:o,isUseTouchId:n});try{const t=await a.save();return e.status(200).json({status:"ok",data:{...t.doc(),token:t.generateToken()}})}catch(t){return e.status(400).json({status:400,error:t})}}]),D.route(I).post([g(v),async(t,e)=>{const{password:r,phone:s}=(null==t?void 0:t.body)||{};try{const t=await w.findOne({phone:s});if(!t)return e.status(400).json({status:400,error:"User not found!"});t.comparePassword(r,((r,s)=>r?e.status(400).json({status:400,error:r.message}):s?e.status(200).json({status:"ok",data:{...t.doc(),token:t.generateToken()}}):e.status(400).json({status:400,error:"Password not match!"})))}catch(t){return e.status(400).json({status:400,error:t})}}]),D.route(q).get([b,async(t,e)=>{const{_id:r}=t.user||{},s=new h(r),o=await w.aggregate([{$lookup:{from:"userprofilerefs",localField:"_id",foreignField:"userId",as:"profile"}},{$lookup:{from:"profiles",localField:"profile.profileId",foreignField:"_id",as:"profile"}},{$unwind:{path:"$profile",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"usercompanyrefs",localField:"_id",foreignField:"userId",as:"company"}},{$lookup:{from:"companies",localField:"company.companyId",foreignField:"_id",as:"company"}},{$unwind:{path:"$company",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"requestcompanies",localField:"_id",foreignField:"userId",as:"requestCompany"}},{$unwind:{path:"$requestCompany",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"userraterefs",localField:"_id",foreignField:"userId",as:"rate"}},{$unwind:{path:"$rate",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"settings",localField:"_id",foreignField:"userId",as:"setting"}},{$unwind:{path:"$setting",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"accounts",localField:"_id",foreignField:"userId",as:"accounts"}},{$unwind:{path:"$profile.rate",preserveNullAndEmptyArrays:!0}},{$match:{_id:s}}]);return o?e.status(200).json({status:"ok",data:c.omit(null==o?void 0:o[0],["password","__v"])}):e.status(400).json({status:400,error:"User not found!"})}]),D.route(k).get([async(t,e)=>{const{phone:r}=t.params||{};try{const t=await w.findOne({phone:r});return t?e.status(200).json({status:"ok",data:null==t?void 0:t.doc()}):e.status(400).json({status:400,error:"User not found!"})}catch(t){return e.status(400).json({status:400,error:t})}}]),D.route(S).post([g(j),async(t,e)=>{const{isUseFaceId:r,isUseTouchId:s,phone:o}=t.body;try{const t=await w.findOneAndUpdate({phone:o},{$set:{isUseFaceId:r,isUseTouchId:s}},{new:!0});return t||e.status(400).json({status:400,error:"User not found!"}),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),D.route(_).get([b,async(t,e)=>{try{const t=await w.find();return e.status(200).json({status:"ok",data:null==t?void 0:t.map((t=>t.doc()))})}catch(t){return e.status(400).json({status:400,error:t})}}]),D.route(O).get([b,async(t,e)=>{const{id:r}=t.params;try{const t=await w.findById(r);return c.isEmpty(t)?e.status(400).json({status:400,error:"User not found!"}):e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),D.route(A).post([b,async(t,e)=>{const{password:r,newPassword:s}=(null==t?void 0:t.body)||{},{_id:o}=t.user||{};try{const t=await w.findById(o);if(!t)return e.status(400).json({status:400,error:"User not found!"});t.comparePassword(r,(async(r,o)=>{if(r)return e.status(400).json({status:400,error:r.message});if(!o)return e.status(400).json({status:400,error:"Password not match!"});t.password=s;const n=await t.save();return e.status(200).json({status:"ok",data:null==n?void 0:n.doc()})}))}catch(t){return e.status(400).json({status:400,error:t})}}]),D.route(T).post([b,async(t,e)=>{const{newPhone:r}=(null==t?void 0:t.body)||{},{phone:s}=t.user||{};try{const t=await w.findOne({phone:s});if(!t)return e.status(400).json({status:400,error:"User not found!"});t.phone=r;const o=await t.save();return e.status(200).json({status:"ok",data:null==o?void 0:o.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const E=t.Router();E.route("/ping").get(((t,e)=>{e.json({data:"pong",env:l("DB_URL")})}));const F=i.z.object({body:i.z.object({businessActivity:i.z.string(),companyName:i.z.string(),email:i.z.string(),legalType:i.z.string(),numberOfEmployees:i.z.number(),licenseNumber:i.z.string().optional(),backupEmail:i.z.string().optional(),coverUrl:i.z.string().optional()})}),U=i.z.object({body:i.z.object({businessActivity:i.z.string().optional(),email:i.z.string().optional(),backupEmail:i.z.string().optional(),legalType:i.z.string().optional(),numberOfEmployees:i.z.number().optional(),licenseNumber:i.z.string().optional(),coverUrl:i.z.string().optional()})}),$=m({companyName:{type:String,required:!0,unique:!0},email:{type:String,required:!0,unique:!0},businessActivity:{type:String,required:!0},legalType:{type:String,required:!0},numberOfEmployees:{type:Number,required:!0},licenseNumber:{type:String,required:!1,default:""},backupEmail:{type:String,required:!1,default:""},coverUrl:{type:String,required:!1}});$.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var P=n.model("Company",$);const B=m({userId:{type:n.Types.ObjectId,ref:"User",required:!0},companyId:{type:n.Types.ObjectId,ref:"Company",required:!0}});B.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var R=n.model("UserCompanyRef",B);const C="/company",M="/company/:id",x="/company/:name",L="/company/join",J=t.Router();J.route(C).post([b,g(F),async(t,e)=>{const{businessActivity:r,companyName:s,email:o,legalType:n,numberOfEmployees:a,licenseNumber:i,backupEmail:u,coverUrl:c}=t.body,d=new P({businessActivity:r,companyName:s,email:o,legalType:n,numberOfEmployees:a,licenseNumber:i,backupEmail:u,coverUrl:c});try{const t=await d.save();return e.status(200).json({status:"ok",data:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),J.route(x).get([b,async(t,e)=>{const{name:r}=t.params||{};try{const t=await P.findOne({companyName:r});return t||e.status(400).json({status:400,error:"Company not found!"}),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),J.route(L).post([b,async(t,e)=>{const{companyId:r}=t.query||{},{_id:s}=t.user||{};try{if(await R.findOne({userId:s})){const t=await R.findOneAndUpdate({userId:s},{$set:{companyId:r}},{new:!0});return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}const t=new R({userId:s,companyId:r}),o=await t.save();return e.status(200).json({status:"ok",data:null==o?void 0:o.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),J.route(M).put([b,g(U),async(t,e)=>{const{businessActivity:r,email:s,legalType:o,numberOfEmployees:n,licenseNumber:a,backupEmail:i,coverUrl:u}=t.body,{id:c}=t.params;try{const t=await P.findByIdAndUpdate(c,{$set:{businessActivity:r,email:s,legalType:o,numberOfEmployees:n,licenseNumber:a,backupEmail:i,coverUrl:u}},{new:!0});return t||e.status(400).json({status:400,error:"Company not found!"}),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const V=i.z.object({body:i.z.object({firstName:i.z.string(),lastName:i.z.string(),nationality:i.z.string(),IDNumber:i.z.string().optional(),passportNumber:i.z.string().optional(),issueDate:i.z.string().optional(),expiryDate:i.z.string().optional()})}),G=i.z.object({body:i.z.object({firstName:i.z.string().optional(),lastName:i.z.string().optional(),nationality:i.z.string().optional(),IDNumber:i.z.string().optional(),passportNumber:i.z.string().optional(),issueDate:i.z.string().optional(),expiryDate:i.z.string().optional()})}),K=m({firstName:{type:String,required:!0},lastName:{type:String,required:!0},nationality:{type:String,required:!0},IDNumber:{type:String,required:!1},passportNumber:{type:String,required:!1},issueDate:{type:Date,required:!1},expiryDate:{type:Date,required:!1}});K.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var H=n.model("Profile",K);const Q=m({userId:{type:n.Types.ObjectId,ref:"User",required:!0},profileId:{type:n.Types.ObjectId,ref:"Profile",unique:!0}});Q.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var W=n.model("UserProfileRef",Q);const X="/profile",Y="/profile/:id",Z=t.Router();Z.route(X).post([b,g(V),async(t,e)=>{const{IDNumber:r,firstName:s,expiryDate:o,issueDate:n,lastName:a,nationality:i,passportNumber:u}=t.body,{_id:c}=(null==t?void 0:t.user)||{};try{const t=new H({IDNumber:r,firstName:s,expiryDate:o,issueDate:n,lastName:a,nationality:i,passportNumber:u}),d=await t.save(),p=new W({userId:c,profileId:d.id});return await p.save(),e.status(200).json({status:"ok",data:d.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Z.route(Y).put([b,g(G),async(t,e)=>{const{IDNumber:r,firstName:s,expiryDate:o,issueDate:n,lastName:a,nationality:i,passportNumber:u}=t.body,{id:c}=t.params||{};try{const t=await H.findByIdAndUpdate(c,{$set:{IDNumber:r,firstName:s,expiryDate:o,issueDate:n,lastName:a,nationality:i,passportNumber:u}},{new:!0});return t||e.status(400).json({status:400,error:"Profile not found!"}),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const tt=t.Router();tt.route("/analytics/summary").get(((t,e)=>e.json({status:"ok",data:{income:12e3,expenses:8e3,account_balances:[{account_id:"12345",balance:"15000"},{account_id:"67890",balance:"5000"}]}}))),tt.route("/analytics/income-expense").get(((t,e)=>e.json({status:"ok",data:{income:[{category:"Sales",amount:1e4,subcategories:[{subcategory:"Product A",amount:6e3},{subcategory:"Product B",amount:4e3}]},{category:"Investments",amount:2e3}],expenses:[{category:"Salaries",amount:5e3},{category:"Rent",amount:3e3},{category:"Utilities",amount:1e3}]}})));const et=i.z.object({body:i.z.object({companyName:i.z.string(),licenseNo:i.z.string(),registerNo:i.z.string(),companyEmail:i.z.string(),userEmail:i.z.string()})});i.z.object({body:i.z.object({companyName:i.z.string().optional(),licenseNo:i.z.string().optional(),registerNo:i.z.string().optional(),companyEmail:i.z.string().optional()})});const rt=m({companyName:{type:String,required:!0},licenseNo:{type:String,required:!0},registerNo:{type:String,required:!0},companyEmail:{type:String,required:!0},userEmail:{type:String,required:!0,unique:!0},userId:{type:n.Types.ObjectId,ref:"User",required:!0,unique:!0},status:{type:String,enum:["PENDING","APPROVAL","REJECT"],default:"PENDING"}});rt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var st=n.model("RequestCompany",rt);const ot="/request-company",nt="/request-company/approval",at="/request-company",it=t.Router();it.route(ot).post([b,g(et),async(t,e)=>{const{companyName:r,companyEmail:s,licenseNo:o,registerNo:n,userEmail:a}=t.body,{_id:i}=t.user||{},u=new st({companyName:r,companyEmail:s,licenseNo:o,registerNo:n,userEmail:a,userId:i});try{const t=await u.save();return e.status(200).json({status:"ok",data:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),it.route(nt).put([b,async(t,e)=>{const{email:r}=t.query||{};try{const t=await st.findOneAndUpdate({userEmail:r},{$set:{status:"APPROVAL"}},{new:!0});return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]),it.route(at).get([b,async(t,e)=>{const r=c.pick(t.query,["status"]);try{const t=await st.find(r);return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]);const ut=i.z.object({body:i.z.object({name:i.z.string(),fee:i.z.string(),transactions:i.z.string(),atmDeposits:i.z.string(),addOns:i.z.string(),books:i.z.string()})}),ct=i.z.object({body:i.z.object({fee:i.z.string().optional(),transactions:i.z.string().optional(),atmDeposits:i.z.string().optional(),addOns:i.z.string().optional(),books:i.z.string().optional()})}),dt=m({name:{type:String,required:!0,unique:!0},fee:{type:String,required:!0},transactions:{type:String,required:!0},atmDeposits:{type:String,required:!0},addOns:{type:String,required:!0},books:{type:String,required:!0}});dt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var pt=n.model("Rate",dt);const yt=m({userId:{type:n.Types.ObjectId,ref:"User",required:!0},rateName:{type:String,required:!0}});yt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var lt=n.model("UserRateRef",yt);const mt="/rate",gt="/rate/:name",bt="/rate",ft="/rate/:name",jt="/rate/join",vt=t.Router();vt.route(bt).get([b,async(t,e)=>{try{const t=await pt.find();return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]),vt.route(ft).get([b,async(t,e)=>{const{name:r}=t.params;try{const t=await pt.findOne({name:r});return t?e.status(200).json({status:"ok",data:null==t?void 0:t.doc()}):e.status(400).json({status:400,error:"Rate not found!"})}catch(t){return e.status(400).json({status:400,error:t})}}]),vt.route(jt).post([b,async(t,e)=>{const{rateName:r}=t.query||{},{_id:s}=t.user||{};try{if(await lt.findOne({userId:s})){const t=await lt.findOneAndUpdate({userId:s},{$set:{rateName:r}},{new:!0});return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}const t=new lt({userId:s,rateName:r}),o=await t.save();return e.status(200).json({status:"ok",data:null==o?void 0:o.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),vt.route(mt).post([b,g(ut),async(t,e)=>{const{name:r,fee:s,transactions:o,atmDeposits:n,addOns:a,books:i}=t.body;try{const t=new pt({name:r,fee:s,transactions:o,atmDeposits:n,addOns:a,books:i}),u=await t.save();return e.status(200).json({status:"ok",data:u.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),vt.route(gt).put([b,g(ct),async(t,e)=>{const{fee:r,transactions:s,atmDeposits:o,addOns:n,books:a}=t.body,{name:i}=t.params;try{const t=await pt.findOneAndUpdate({name:i},{$set:{fee:r,transactions:s,atmDeposits:o,addOns:n,books:a}},{new:!0});return c.isEmpty(t)?e.status(400).json({status:400,error:"Rete not found!"}):e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const Nt=t.Router();Nt.route("/request-delivery").post([(t,e)=>e.status(200).json({status:"ok",data:t.body})]);const wt=i.z.object({body:i.z.object({userId:i.z.string()})});i.z.object({body:i.z.object({userId:i.z.string().optional()})});const ht=m({user:{type:n.Types.ObjectId,ref:"User",required:!0,unique:!0},status:{type:String,enum:["PENDING","APPROVAL","REJECT"],default:"PENDING"}});ht.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var zt=n.model("RequestAccount",ht);const It="/request-account",qt="/request-account/approval",_t="/request-account",St=t.Router();St.route(It).post([b,g(wt),async(t,e)=>{const{userId:r,status:s}=t.body,o=new zt({status:s,user:r});try{if(!await w.findById(r))return e.status(400).json({status:400,error:"User not found!"});const t=await o.save();return e.status(200).json({status:"ok",data:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),St.route(qt).put([b,async(t,e)=>{const{userId:r}=t.query||{};try{const t=await zt.findOneAndUpdate({user:r},{$set:{status:"APPROVAL"}},{new:!0});return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]),St.route(_t).get([b,async(t,e)=>{const r=c.pick(t.query,["status"]);try{const t=await zt.find(r);return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]);const kt=i.z.object({body:i.z.object({accountName:i.z.string(),accountNumber:i.z.string(),iban:i.z.string(),swiftCode:i.z.string(),isMain:i.z.boolean().optional()})}),Ot=i.z.object({body:i.z.object({accountName:i.z.string().optional(),accountNumber:i.z.string().optional(),iban:i.z.string().optional(),swiftCode:i.z.string().optional(),isMain:i.z.boolean().optional()})}),At=m({accountName:{type:String,required:!0,unique:!0},accountNumber:{type:String,required:!0,unique:!0},iban:{type:String,required:!0,unique:!0},swiftCode:{type:String,required:!0},balance:{type:Number,required:!0,default:0},isMain:{type:Boolean,required:!1,default:!1},userId:{type:n.Types.ObjectId,ref:"User",required:!0}});At.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var Tt=n.model("Account",At);const Dt="/account",Et="/account/:id",Ft=t.Router();Ft.route(Dt).post([b,g(kt),async(t,e)=>{const{accountName:r,accountNumber:s,iban:o,swiftCode:n,isMain:a}=t.body,{_id:i}=t.user||{};try{const t=new Tt({accountName:r,accountNumber:s,iban:o,swiftCode:n,isMain:a,userId:i}),u=await t.save();return e.status(200).json({status:"ok",data:u.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Ft.route(Et).put([b,g(Ot),async(t,e)=>{const{accountName:r,accountNumber:s,iban:o,swiftCode:n,isMain:a}=t.body,{id:i}=t.params;try{const t=await Tt.findByIdAndUpdate(i,{$set:{accountName:r,accountNumber:s,iban:o,swiftCode:n,isMain:a}},{new:!0});return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const Ut=m({accountId:{type:n.Types.ObjectId,ref:"Account",required:!0},createdBy:{type:n.Types.ObjectId,ref:"User",required:!0},companyId:{type:n.Types.ObjectId,ref:"Company",required:!0},amount:{type:Number,required:!0},category:{type:String,required:!0},description:{type:String,required:!0},date:{type:String,required:!0},type:{type:String,required:!0},cardNumber:{type:String,required:!1}});Ut.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var $t=n.model("Transactions",Ut);const Pt=m({companyId:{type:n.Types.ObjectId,ref:"Company",required:!0},createdBy:{type:n.Types.ObjectId,ref:"User",required:!0},accountNumber:{type:String,required:!0},transactionsId:{type:n.Types.ObjectId,ref:"Transactions",required:!0},recipientType:{type:String,required:!0},recipientName:{type:String,required:!0},recipientEmail:{type:String,required:!0},recipientPhone:{type:String,required:!0},detailDueDate:{type:String,required:!0},detailType:{type:String,required:!0},detailAmount:{type:String,required:!0},invoiceNumber:{type:String,required:!0,unique:!0}});Pt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var Bt=n.model("Invoice",Pt);const Rt=m({companyId:{type:n.Types.ObjectId,ref:"Company",required:!0},createdBy:{type:n.Types.ObjectId,ref:"User",required:!0},accountNumber:{type:String,required:!0},transactionsId:{type:n.Types.ObjectId,ref:"Transactions",required:!0},toCompanyName:{type:String,required:!0},toIban:{type:String,required:!0},toSwiftCode:{type:String,required:!0},detailType:{type:String,required:!0},detailAmount:{type:String,required:!0},transferNumber:{type:String,required:!0,unique:!0}});Rt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var Ct=n.model("Transfer",Rt);const Mt=n.Types.ObjectId,xt=n.Types.ObjectId,Lt=i.z.object({body:i.z.object({accountId:i.z.string(),type:i.z.string().optional(),amount:i.z.string(),category:i.z.string(),description:i.z.string(),companyId:i.z.string(),cardNumber:i.z.string().optional(),accountNumber:i.z.string().optional(),recipientType:i.z.string().optional(),recipientName:i.z.string().optional(),recipientEmail:i.z.string().optional(),recipientPhone:i.z.string().optional(),detailDueDate:i.z.string().optional(),detailType:i.z.string().optional(),invoiceNumber:i.z.string().optional(),transactionsId:i.z.string().optional(),toCompanyName:i.z.string().optional(),toIban:i.z.string().optional(),toSwiftCode:i.z.string().optional(),detailAmount:i.z.string().optional(),transferNumber:i.z.string().optional()})}),Jt="/transaction",Vt="/transaction/account/:accountId",Gt="/transaction/company/:companyId",Kt="/transaction/deposit",Ht="/transaction/invoice",Qt="/transaction/transfer",Wt=t.Router();Wt.route(Jt).post([b,g(Lt),async(t,e)=>{const{accountId:r,type:s,amount:o,category:n,description:a,cardNumber:i}=t.body,{_id:u}=(null==t?void 0:t.user)||{};try{const t=new $t({createdBy:u,accountId:r,amount:o,category:n,description:a,type:s,cardNumber:i,date:new Date}),c=await t.save();return e.status(200).json({status:"ok",data:c.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Wt.route(Kt).post([b,g(Lt),async(t,e)=>{const{accountId:r,amount:s,category:o,description:n,cardNumber:a,companyId:i}=t.body,{_id:u}=t.user||{};try{const t=await Tt.findById(r);if(!t)return e.status(400).json({status:400,error:"Account not found!"});if(!c.isNumber(+s))return e.status(400).json({status:400,error:"Amount invalid!"});t.balance=Number(null==t?void 0:t.balance)+Number(s),await t.save();const d=(new Date).toISOString();console.log("now=>>>>>>>",d);const p=new $t({accountId:r,amount:Number(s),category:o,description:n,type:"DEPOSIT",date:d,createdBy:u,cardNumber:a,companyId:i,createdAt:d,updatedAt:d}),y=await p.save();return e.status(200).json({status:"ok",data:y.doc()})}catch(t){return e.status(400).json({status:400,error:JSON.stringify(t)})}}]),Wt.route(Ht).post([b,g(Lt),async(t,e)=>{const{accountId:r,amount:s,category:o,description:n,cardNumber:a,companyId:i,accountNumber:u,recipientType:d,recipientName:p,recipientEmail:y,recipientPhone:l,detailDueDate:m,detailType:g,invoiceNumber:b}=t.body,{_id:f}=t.user||{};try{const t=await Tt.findById(r);if(!t)return e.status(400).json({status:400,error:"Account not found!"});if(!c.isNumber(+s))return e.status(400).json({status:400,error:"Amount invalid!"});t.balance=Number(null==t?void 0:t.balance)-Number(s),await t.save();const j=new $t({accountId:r,amount:Number(s),category:o,description:n,type:"INVOICE",date:new Date,createdBy:f,cardNumber:a,companyId:i}),v=await j.save(),N=new Bt({accountNumber:u,companyId:i,createdBy:f,detailAmount:Number(s),detailDueDate:m,detailType:g,recipientEmail:y,recipientName:p,recipientPhone:l,recipientType:d,transactionsId:v._id,invoiceNumber:b}),w=await N.save();return e.status(200).json({status:"ok",data:{...v.doc(),invoice:w.doc()}})}catch(t){return e.status(400).json({status:400,error:JSON.stringify(t)})}}]),Wt.route(Qt).post([b,g(Lt),async(t,e)=>{const{accountId:r,amount:s,category:o,description:n,cardNumber:a,companyId:i,accountNumber:u,toCompanyName:d,toIban:p,toSwiftCode:y,detailType:l,transferNumber:m}=t.body,{_id:g}=t.user||{};try{const t=await Tt.findById(r);if(!t)return e.status(400).json({status:400,error:"Account not found!"});if(!c.isNumber(+s))return e.status(400).json({status:400,error:"Amount invalid!"});t.balance=Number(null==t?void 0:t.balance)-Number(s),await t.save();const b=new $t({accountId:r,amount:Number(s),category:o,description:n,type:"TRANSFER",date:new Date,createdBy:g,cardNumber:a,companyId:i}),f=await b.save(),j=new Ct({accountNumber:u,companyId:i,createdBy:g,detailAmount:Number(s),detailType:l,transactionsId:f._id,toCompanyName:d,toIban:p,toSwiftCode:y,transferNumber:m}),v=await j.save();return e.status(200).json({status:"ok",data:{...f.doc(),invoice:v.doc()}})}catch(t){return e.status(400).json({status:400,error:JSON.stringify(t)})}}]),Wt.route(Vt).get([b,async(t,e)=>{const{_id:r}=(null==t?void 0:t.user)||{},{accountId:s}=t.params||{},{invoiceType:o,transferType:n,type:a,fromDate:i,toDate:u}=t.query||{},p=new Mt(r),y=new Mt(s);if(u&&i&&!d.isAfter(new Date(u),new Date(i)))return e.status(400).json({status:400,error:"Invalid date range"});const l=c.pickBy({accountId:y,createdBy:p,"invoice.detailType":o,"transfer.detailType":n,type:a,createdAt:!!i&&!!u&&{$gte:new Date(i),$lte:new Date(u)}},c.identity);console.log("ưherw",l);try{const t=await $t.aggregate([{$lookup:{from:"invoices",localField:"_id",foreignField:"transactionsId",as:"invoice"}},{$unwind:{path:"$invoice",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"transfers",localField:"_id",foreignField:"transactionsId",as:"transfer"}},{$unwind:{path:"$transfer",preserveNullAndEmptyArrays:!0}},{$match:l}]).sort({createdAt:-1});return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]),Wt.route(Gt).get([b,async(t,e)=>{const{_id:r}=(null==t?void 0:t.user)||{},{companyId:s}=t.params||{},{invoiceType:o,transferType:n,type:a,fromDate:i,toDate:u}=t.query||{},p=new xt(r),y=new xt(s);if(u&&i&&!d.isAfter(new Date(u),new Date(i)))return e.status(400).json({status:400,error:"Invalid date range"});const l=c.pickBy({companyId:y,createdBy:p,"invoice.detailType":o,"transfer.detailType":n,type:a,createdAt:!!i&&!!u&&{$gte:new Date(i),$lte:new Date(u)}},c.identity);console.log("ưherw",l);try{const t=await $t.aggregate([{$lookup:{from:"invoices",localField:"_id",foreignField:"transactionsId",as:"invoice"}},{$unwind:{path:"$invoice",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"transfers",localField:"_id",foreignField:"transactionsId",as:"transfer"}},{$unwind:{path:"$transfer",preserveNullAndEmptyArrays:!0}},{$match:l},{$sort:{createdAt:-1}}]);return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]);const Xt=m({cardType:{type:String,required:!0},nicname:{type:String,required:!0},status:{type:String,required:!0},cardNumber:{type:String,required:!0},accountNumber:{type:String,required:!0},isMain:{type:Boolean,required:!1,default:!1}});Xt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var Yt=n.model("Card",Xt);const Zt=i.z.object({body:i.z.object({cardType:i.z.string(),nicname:i.z.string(),status:i.z.string(),cardNumber:i.z.string(),accountNumber:i.z.string(),isMain:i.z.boolean().optional()})});i.z.object({body:i.z.object({cardType:i.z.string().optional(),nicname:i.z.string().optional(),status:i.z.string().optional(),cardNumber:i.z.string().optional(),accountNumber:i.z.string().optional(),isMain:i.z.boolean().optional()})});const te="/card",ee="/card",re="/card/:id",se="/card/account/:accountNumber",oe=t.Router();oe.route(ee).post([b,g(Zt),async(t,e)=>{const{cardType:r,nicname:s,status:o,cardNumber:n,accountNumber:a,isMain:i}=t.body;try{const t=new Yt({accountNumber:a,cardNumber:n,cardType:r,nicname:s,status:o,isMain:i}),u=await t.save();return e.status(200).json({status:"ok",data:u.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),oe.route(re).get([b,async(t,e)=>{const{id:r}=t.params;try{const t=await Yt.findById(r);return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),oe.route(te).get([b,async(t,e)=>{try{const t=await Yt.find();return e.status(200).json({status:"ok",data:null==t?void 0:t.map((t=>null==t?void 0:t.doc()))})}catch(t){return e.status(400).json({status:400,error:t})}}]),oe.route(se).get([b,async(t,e)=>{const{accountNumber:r}=t.params;console.log("accountNumber",r);try{const t=await Yt.find({accountNumber:r});return e.status(200).json({status:"ok",data:null==t?void 0:t.map((t=>null==t?void 0:t.doc()))})}catch(t){return e.status(400).json({status:400,error:t})}}]);const ne=i.z.object({body:i.z.object({enableBiometric:i.z.boolean().optional(),confirmationMethods:i.z.string().optional(),receiveNotificationsForPaymentsAndTransfers:i.z.boolean().optional(),receiveNotificationsForDeposits:i.z.boolean().optional(),receiveNotificationsForOutstandingInvoices:i.z.boolean().optional(),receiveNotificationsForExceedingSetLimits:i.z.boolean().optional(),notificationMethods:i.z.string().optional()})}),ae=i.z.object({body:i.z.object({enableBiometric:i.z.boolean().optional(),confirmationMethods:i.z.string().optional(),receiveNotificationsForPaymentsAndTransfers:i.z.boolean().optional(),receiveNotificationsForDeposits:i.z.boolean().optional(),receiveNotificationsForOutstandingInvoices:i.z.boolean().optional(),receiveNotificationsForExceedingSetLimits:i.z.boolean().optional(),notificationMethods:i.z.string().optional()})}),ie=m({userId:{type:n.Types.ObjectId,ref:"User",required:!0,unique:!0},enableBiometric:{type:Boolean,required:!0,default:!1},confirmationMethods:{type:String,required:!0,default:"FACE_ID"},receiveNotificationsForPaymentsAndTransfers:{type:Boolean,required:!0,default:!1},receiveNotificationsForDeposits:{type:Boolean,required:!0,default:!1},receiveNotificationsForOutstandingInvoices:{type:Boolean,required:!0,default:!1},receiveNotificationsForExceedingSetLimits:{type:Boolean,required:!0,default:!1},notificationMethods:{type:String,required:!0,default:"EMAIL"}});ie.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var ue=n.model("Setting",ie);const ce=n.Types.ObjectId,de=n.Types.ObjectId,pe="/setting",ye="/setting",le="/setting/me",me="/setting/:id",ge=t.Router();ge.route(pe).post([b,g(ne),async(t,e)=>{const{confirmationMethods:r,enableBiometric:s,notificationMethods:o,receiveNotificationsForDeposits:n,receiveNotificationsForExceedingSetLimits:a,receiveNotificationsForOutstandingInvoices:i,receiveNotificationsForPaymentsAndTransfers:u}=t.body,{_id:c}=t.user||{};try{const t=new ue({userId:c,confirmationMethods:r,enableBiometric:s,notificationMethods:o,receiveNotificationsForDeposits:n,receiveNotificationsForExceedingSetLimits:a,receiveNotificationsForOutstandingInvoices:i,receiveNotificationsForPaymentsAndTransfers:u}),d=await t.save();return e.status(200).json({status:"ok",data:d.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),ge.route(ye).put([b,g(ae),async(t,e)=>{const{confirmationMethods:r,enableBiometric:s,notificationMethods:o,receiveNotificationsForDeposits:n,receiveNotificationsForExceedingSetLimits:a,receiveNotificationsForOutstandingInvoices:i,receiveNotificationsForPaymentsAndTransfers:u}=t.body,{_id:c}=t.user||{},d=new ce(c);try{const t=await ue.findOneAndUpdate({userId:d},{$set:{confirmationMethods:r,enableBiometric:s,notificationMethods:o,receiveNotificationsForDeposits:n,receiveNotificationsForExceedingSetLimits:a,receiveNotificationsForOutstandingInvoices:i,receiveNotificationsForPaymentsAndTransfers:u}},{new:!0});return t?e.status(200).json({status:"ok",data:null==t?void 0:t.doc()}):e.status(400).json({status:400,error:"Data not found!"})}catch(t){return e.status(400).json({status:400,error:t})}}]),ge.route(le).get([b,async(t,e)=>{const{_id:r}=t.user||{},s=new de(r);try{const t=await ue.findOne({userId:s});return t?e.status(200).json({status:"ok",data:null==t?void 0:t.doc()}):e.status(400).json({status:400,error:"Setting not found!"})}catch(t){return e.status(400).json({status:400,error:t})}}]),ge.route(me).get([b,async(t,e)=>{const{id:r}=t.params;try{const t=await ue.findById(r);return t?e.status(200).json({status:"ok",data:null==t?void 0:t.doc()}):e.status(400).json({status:400,error:"Setting not found!"})}catch(t){return e.status(400).json({status:400,error:t})}}]);const be=i.z.object({body:i.z.object({companyId:i.z.string(),url:i.z.string(),type:i.z.string(),name:i.z.string()})}),fe=i.z.object({body:i.z.object({url:i.z.string().optional(),type:i.z.string().optional(),name:i.z.string().optional()})}),je=m({companyId:{type:n.Types.ObjectId,ref:"Company",required:!0},url:{type:String,required:!1},type:{type:String,required:!1},name:{type:String,required:!1}});je.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var ve=n.model("Atachment",je);const Ne=n.Types.ObjectId,we="/atachment",he="/atachment/:id",ze="/atachment/:id",Ie="/atachment/compnay/:id",qe=t.Router();qe.route(we).post([b,g(be),async(t,e)=>{const{name:r,type:s,companyId:o,url:n}=t.body;try{const t=new ve({name:r,type:s,companyId:o,url:n}),a=await t.save();return e.status(200).json({status:"ok",data:a.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),qe.route(he).post([b,g(fe),async(t,e)=>{const{name:r,type:s,url:o}=t.body,{id:n}=t.params;try{const t=await ve.findByIdAndUpdate(n,{$set:{name:r,type:s,url:o}},{new:!0});return t||e.status(400).json({status:400,error:"Atachment not found!"}),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),qe.route(ze).delete([b,async(t,e)=>{const{id:r}=t.params;try{const t=await ve.findByIdAndDelete(r,{returnOriginal:!0});return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),qe.route(Ie).get([b,async(t,e)=>{const{id:r}=t.params,s=new Ne(r);try{const t=await ve.find({companyId:s});return e.status(200).json({status:"ok",data:null==t?void 0:t.map((t=>null==t?void 0:t.doc()))})}catch(t){return e.status(400).json({status:400,error:t})}}]);const _e=i.z.object({body:i.z.object({message:i.z.string()})});i.z.object({body:i.z.object({message:i.z.string().optional(),isRead:i.z.boolean().optional()})});const Se=m({userId:{type:n.Types.ObjectId,ref:"User",required:!0},message:{type:String,required:!1},isRead:{type:String,required:!1,default:!1},receiverId:{type:n.Types.ObjectId,ref:"User",required:!1}});Se.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var ke=n.model("Chat",Se);const Oe=n.Types.ObjectId,Ae="/chat/send",Te="/chat/me",De=t.Router();De.route(Ae).post([b,g(_e),async(t,e)=>{const{message:r,receiverId:s}=t.body,{_id:o}=t.user||{};try{const t=new ke({userId:o,message:r,receiverId:s}),n=await t.save();return e.status(200).json({status:"ok",data:n.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),De.route(Te).get([b,async(t,e)=>{const{_id:r}=t.user||{},s=new Oe(r);try{const t=await ke.find({userId:s});return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]);const Ee=+l("PORT"),Fe=l("DB_URL");Ee&&Fe||(console.error("Missing env!"),process.exit(1));const Ue=t();Ue.use(s("combined")),Ue.use(r({contentSecurityPolicy:!1,frameguard:!1,crossOriginEmbedderPolicy:!1,crossOriginOpenerPolicy:!1,crossOriginResourcePolicy:!1})),Ue.use(e({origin:"*"})),Ue.use(t.json()),Ue.use(t.urlencoded({extended:!1})),Ue.use(t.static(p.join(__dirname+"/public"))),Ue.use("/api",[E,D,J,Z,tt,it,vt,Nt,St,Ft,Wt,oe,ge,qe,De]),Ue.get("*",(async(t,e)=>e.sendFile(p.join(__dirname+"/public/index.html")))),Ue.listen(Ee,(()=>{console.log(`Server started on port ${Ee}: http://localhost:${Ee}`),(({db:t})=>{const e=()=>{n.connect(t,{dbName:"pina_app"}).then((t=>console.info(`Successfully connected to ${t.connection.name}`))).catch((t=>(console.error("Error connecting to database: ",t),process.exit(1))))};e(),n.connection.on("disconnected",e)})({db:Fe})})).on("error",(t=>{console.log("ERROR: ",t)})),exports.app=Ue;
