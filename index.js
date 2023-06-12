"use strict";var t=require("express"),e=require("cors"),s=require("helmet"),o=require("morgan"),r=require("dotenv"),n=require("mongoose"),a=require("jsonwebtoken"),i=require("zod"),u=require("bcryptjs"),c=require("lodash"),d=require("path");function p(t){var e=Object.create(null);return t&&Object.keys(t).forEach((function(s){if("default"!==s){var o=Object.getOwnPropertyDescriptor(t,s);Object.defineProperty(e,s,o.get?o:{enumerable:!0,get:function(){return t[s]}})}})),e.default=t,Object.freeze(e)}p(r).config();const l=t=>{var e;return null===(e=process.env)||void 0===e?void 0:e[t]},m=t=>new n.Schema({...t,createdAt:{type:Date,default:new Date},updatedAt:{type:Date,default:new Date}}),y=t=>(e,s,o)=>{try{t.parse({body:e.body,query:e.query,params:e.params}),o()}catch(t){return s.status(400).json({status:400,error:t.issues})}},g=(t,e,s)=>{var o;const r=null===(o=t.header("Authorization"))||void 0===o?void 0:o.replace("Bearer ","");if(!r)return e.status(403).json({status:403,error:"A token is required for authentication"});try{const e=a.verify(r,process.env.TOKEN_SECRET||"MICRO_APP");t.user=e}catch(t){return e.status(401).json({status:401,error:"Invalid Token"})}return s()},b=i.z.object({body:i.z.object({phone:i.z.string(),password:i.z.string(),isUseTouchId:i.z.boolean().default(!1),isUseFaceId:i.z.boolean().default(!1)})}),f=i.z.object({body:i.z.object({phone:i.z.string(),isUseTouchId:i.z.boolean().default(!1),isUseFaceId:i.z.boolean().default(!1)})}),h=i.z.object({body:i.z.object({phone:i.z.string(),password:i.z.string()})}),j=m({phone:{type:String,required:!0,unique:!0},isUseFaceId:{type:Boolean,required:!1},isUseTouchId:{type:Boolean,required:!1},password:{type:String,required:!0}});j.method("doc",(function(){return c.omit(this._doc,["password","__v"])})),j.pre("save",(function(t){var e=this;if(!e.isModified("password"))return t();u.genSalt(10,(function(s,o){if(s)return t(s);u.hash(e.password,o,(function(s,o){if(s)return t(s);e.password=o,t()}))}))})),j.method("comparePassword",(function(t,e){u.compare(t,this.password,(function(t,s){if(t)return e(t,!1);e(null,s)}))})),j.method("generateToken",(function(){return a.sign(this.doc(),process.env.MICRO_APP||"MICRO_APP",{expiresIn:"30d"})}));var z=n.model("User",j);const N="/user/register",w="/user/login-with-phone",q="/user/me",v="/user/update-by-phone",k="/user/phone/:phone",I=t.Router();I.route(N).post([y(b),async(t,e)=>{const{phone:s,password:o,isUseFaceId:r=!1,isUseTouchId:n=!1}=t.body,a=new z({password:o,phone:s,isUseFaceId:r,isUseTouchId:n});try{const t=await a.save();return e.status(200).json({status:"ok",data:{...t.doc(),token:t.generateToken()}})}catch(t){return e.status(400).json({status:400,error:t})}}]),I.route(w).post([y(h),async(t,e)=>{const{password:s,phone:o}=(null==t?void 0:t.body)||{};try{const t=await z.findOne({phone:o});if(!t)return e.status(400).json({status:400,error:"User not found!"});t.comparePassword(s,((s,o)=>s?e.status(400).json({status:400,error:s.message}):o?e.status(200).json({status:"ok",data:{...t.doc(),token:t.generateToken()}}):e.status(400).json({status:400,error:"Password not match!"})))}catch(t){return e.status(400).json({status:400,error:t})}}]),I.route(q).get([g,async(t,e)=>{const{user:s}=t,o=await z.aggregate([{$unwind:{path:"$profile.company",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"userprofilerefs",localField:"phone",foreignField:"phone",as:"profile"}},{$lookup:{from:"profiles",localField:"profile.profileId",foreignField:"_id",as:"profile"}},{$unwind:{path:"$profile",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"usercompanyrefs",localField:"phone",foreignField:"phone",as:"company"}},{$lookup:{from:"companies",localField:"company.companyName",foreignField:"companyName",as:"company"}},{$unwind:{path:"$company",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"requestcompanies",localField:"phone",foreignField:"phone",as:"requestCompany"}},{$unwind:{path:"$requestCompany",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"userraterefs",localField:"phone",foreignField:"phone",as:"rate"}},{$unwind:{path:"$rate",preserveNullAndEmptyArrays:!0}},{$lookup:{from:"accounts",localField:"phone",foreignField:"phone",as:"accounts"}},{$unwind:{path:"$profile.rate",preserveNullAndEmptyArrays:!0}},{$match:{phone:s.phone}}]);return o?e.status(200).json({status:"ok",data:c.omit(null==o?void 0:o[0],["password","__v"])}):e.status(400).json({status:400,error:"User not found!"})}]),I.route(k).get([async(t,e)=>{const{phone:s}=t.params||{};try{const t=await z.findOne({phone:s});return t?e.status(200).json({status:"ok",data:null==t?void 0:t.doc()}):e.status(400).json({status:400,error:"User not found!"})}catch(t){return e.status(400).json({status:400,error:t})}}]),I.route(v).post([y(f),async(t,e)=>{const{isUseFaceId:s,isUseTouchId:o,phone:r}=t.body;try{const t=await z.findOneAndUpdate({phone:r},{$set:{isUseFaceId:s,isUseTouchId:o}},{new:!0});return t||e.status(400).json({status:400,error:"User not found!"}),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const S=t.Router();S.route("/ping").get(((t,e)=>{e.json({data:"pong",env:l("DB_URL")})}));const _=i.z.object({body:i.z.object({businessActivity:i.z.string(),companyName:i.z.string(),email:i.z.string(),legalType:i.z.string(),numberOfEmployees:i.z.number(),licenseNumber:i.z.string().optional(),backupEmail:i.z.string().optional()})}),O=i.z.object({body:i.z.object({businessActivity:i.z.string().optional(),email:i.z.string().optional(),backupEmail:i.z.string().optional(),legalType:i.z.string().optional(),numberOfEmployees:i.z.number().optional(),licenseNumber:i.z.string().optional()})}),A=m({companyName:{type:String,required:!0,unique:!0},email:{type:String,required:!0,unique:!0},businessActivity:{type:String,required:!0},legalType:{type:String,required:!0},numberOfEmployees:{type:Number,required:!0},licenseNumber:{type:String,required:!1,default:""},backupEmail:{type:String,required:!1,default:""}});A.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var E=n.model("Company",A);const D=m({phone:{type:String,required:!0,unique:!0},companyName:{type:String,required:!0}});D.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var R=n.model("UserCompanyRef",D);const U="/company",P="/company/:name",$="/company/:name",T="/company/join",F=t.Router();F.route(U).post([g,y(_),async(t,e)=>{const{businessActivity:s,companyName:o,email:r,legalType:n,numberOfEmployees:a,licenseNumber:i,backupEmail:u}=t.body,c=new E({businessActivity:s,companyName:o,email:r,legalType:n,numberOfEmployees:a,licenseNumber:i,backupEmail:u});try{const t=await c.save();return e.status(200).json({status:"ok",data:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),F.route($).get([g,async(t,e)=>{const{name:s}=t.params||{};try{const t=await E.findOne({companyName:s});return t||e.status(400).json({status:400,error:"Company not found!"}),e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),F.route(T).post([g,async(t,e)=>{const{companyName:s}=t.query||{},{phone:o}=t.user||{};try{const t=new R({phone:o,companyName:s}),r=await t.save();return e.status(200).json({status:"ok",data:null==r?void 0:r.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),F.route(P).put([g,y(O),async(t,e)=>{const{businessActivity:s,email:o,legalType:r,numberOfEmployees:n,licenseNumber:a,backupEmail:i}=t.body,{name:u}=t.params;try{const t=await E.findOneAndUpdate({companyName:u},{$set:{businessActivity:s,email:o,legalType:r,numberOfEmployees:n,licenseNumber:a,backupEmail:i}},{new:!0});return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const C=i.z.object({body:i.z.object({firstName:i.z.string(),lastName:i.z.string(),nationality:i.z.string(),IDNumber:i.z.string().optional(),passportNumber:i.z.string().optional(),issueDate:i.z.string().optional(),expiryDate:i.z.string().optional()})}),x=i.z.object({body:i.z.object({firstName:i.z.string().optional(),lastName:i.z.string().optional(),nationality:i.z.string().optional(),IDNumber:i.z.string().optional(),passportNumber:i.z.string().optional(),issueDate:i.z.string().optional(),expiryDate:i.z.string().optional()})}),M=m({firstName:{type:String,required:!0},lastName:{type:String,required:!0},nationality:{type:String,required:!0},IDNumber:{type:String,required:!1},passportNumber:{type:String,required:!1},issueDate:{type:Date,required:!1},expiryDate:{type:Date,required:!1}});M.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var B=n.model("Profile",M);const L=m({phone:{type:String,required:!0,unique:!0},profileId:{type:n.Types.ObjectId,ref:"Profile",unique:!0}});L.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var G=n.model("UserProfileRef",L);const V="/profile",J="/profile",K=t.Router();K.route(V).post([g,y(C),async(t,e)=>{const{IDNumber:s,firstName:o,expiryDate:r,issueDate:n,lastName:a,nationality:i,passportNumber:u}=t.body,{phone:c}=(null==t?void 0:t.user)||{};try{const t=new B({IDNumber:s,firstName:o,expiryDate:r,issueDate:n,lastName:a,nationality:i,passportNumber:u}),d=await t.save(),p=new G({phone:c,profileId:d.id});return await p.save(),e.status(200).json({status:"ok",data:d.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),K.route(J).put([g,y(x),async(t,e)=>{const{IDNumber:s,firstName:o,expiryDate:r,issueDate:n,lastName:a,nationality:i,passportNumber:u,id:c}=t.body;try{const t=await B.findByIdAndUpdate(c,{$set:{IDNumber:s,firstName:o,expiryDate:r,issueDate:n,lastName:a,nationality:i,passportNumber:u}},{new:!0});return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const H=t.Router();H.route("/analytics/summary").get(((t,e)=>e.json({status:"ok",data:{income:12e3,expenses:8e3,account_balances:[{account_id:"12345",balance:"15000"},{account_id:"67890",balance:"5000"}]}}))),H.route("/analytics/income-expense").get(((t,e)=>e.json({status:"ok",data:{income:[{category:"Sales",amount:1e4,subcategories:[{subcategory:"Product A",amount:6e3},{subcategory:"Product B",amount:4e3}]},{category:"Investments",amount:2e3}],expenses:[{category:"Salaries",amount:5e3},{category:"Rent",amount:3e3},{category:"Utilities",amount:1e3}]}})));const Q=i.z.object({body:i.z.object({companyName:i.z.string(),licenseNo:i.z.string(),registerNo:i.z.string(),companyEmail:i.z.string(),userEmail:i.z.string()})});i.z.object({body:i.z.object({companyName:i.z.string().optional(),licenseNo:i.z.string().optional(),registerNo:i.z.string().optional(),companyEmail:i.z.string().optional()})});const W=m({companyName:{type:String,required:!0},licenseNo:{type:String,required:!0},registerNo:{type:String,required:!0},companyEmail:{type:String,required:!0},userEmail:{type:String,required:!0,unique:!0},phone:{type:String,required:!0,unique:!0},status:{type:String,enum:["PENDING","APPROVAL","REJECT"],default:"PENDING"}});W.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var X=n.model("RequestCompany",W);const Y="/request-company",Z="/request-company/approval",tt="/request-company",et=t.Router();et.route(Y).post([g,y(Q),async(t,e)=>{const{companyName:s,companyEmail:o,licenseNo:r,registerNo:n,userEmail:a}=t.body,{phone:i}=t.user||{},u=new X({companyName:s,companyEmail:o,licenseNo:r,registerNo:n,userEmail:a,phone:i});try{const t=await u.save();return e.status(200).json({status:"ok",data:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),et.route(Z).put([g,async(t,e)=>{const{email:s}=t.query||{};console.log("email",s);try{const t=await X.findOneAndUpdate({userEmail:s},{$set:{status:"APPROVAL"}},{new:!0});return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]),et.route(tt).get([g,async(t,e)=>{const s=c.pick(t.query,["status"]);try{const t=await X.find(s);return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]);const st=i.z.object({body:i.z.object({name:i.z.string(),fee:i.z.string(),transactions:i.z.string(),atmDeposits:i.z.string(),addOns:i.z.string(),books:i.z.string()})}),ot=i.z.object({body:i.z.object({fee:i.z.string().optional(),transactions:i.z.string().optional(),atmDeposits:i.z.string().optional(),addOns:i.z.string().optional(),books:i.z.string().optional()})}),rt=m({name:{type:String,required:!0,unique:!0},fee:{type:String,required:!0},transactions:{type:String,required:!0},atmDeposits:{type:String,required:!0},addOns:{type:String,required:!0},books:{type:String,required:!0}});rt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var nt=n.model("Rate",rt);const at=m({phone:{type:String,required:!0,unique:!0},rateName:{type:String,required:!0}});at.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var it=n.model("UserRateRef",at);const ut="/rate",ct="/rate/:name",dt="/rate",pt="/rate/:name",lt="/rate/join",mt=t.Router();mt.route(dt).get([g,async(t,e)=>{try{const t=await nt.find();return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]),mt.route(pt).get([g,async(t,e)=>{const{name:s}=t.params;try{const t=await nt.findOne({name:s});return t?e.status(200).json({status:"ok",data:null==t?void 0:t.doc()}):e.status(400).json({status:400,error:"Rate not found!"})}catch(t){return e.status(400).json({status:400,error:t})}}]),mt.route(lt).post([g,async(t,e)=>{const{rateName:s}=t.query||{},{phone:o}=t.user||{};try{if(await it.findOne({phone:o})){const t=await it.findOneAndUpdate({phone:o},{$set:{rateName:s}},{new:!0});return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}const t=new it({phone:o,rateName:s}),r=await t.save();return e.status(200).json({status:"ok",data:null==r?void 0:r.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),mt.route(ut).post([g,y(st),async(t,e)=>{const{name:s,fee:o,transactions:r,atmDeposits:n,addOns:a,books:i}=t.body;try{const t=new nt({name:s,fee:o,transactions:r,atmDeposits:n,addOns:a,books:i}),u=await t.save();return e.status(200).json({status:"ok",data:u.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),mt.route(ct).put([g,y(ot),async(t,e)=>{const{fee:s,transactions:o,atmDeposits:r,addOns:n,books:a}=t.body,{name:i}=t.params;try{const t=await nt.findOneAndUpdate({name:i},{$set:{fee:s,transactions:o,atmDeposits:r,addOns:n,books:a}},{new:!0});return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const yt=t.Router();yt.route("/request-delivery").post([(t,e)=>e.status(200).json({status:"ok",data:t.body})]);const gt=i.z.object({body:i.z.object({userId:i.z.string()})});i.z.object({body:i.z.object({userId:i.z.string().optional()})});const bt=m({user:{type:n.Types.ObjectId,ref:"User",required:!0,unique:!0},status:{type:String,enum:["PENDING","APPROVAL","REJECT"],default:"PENDING"}});bt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var ft=n.model("RequestAccount",bt);const ht="/request-account",jt="/request-account/approval",zt="/request-account",Nt=t.Router();Nt.route(ht).post([g,y(gt),async(t,e)=>{const{userId:s,status:o}=t.body,r=new ft({status:o,user:s});try{if(!await z.findById(s))return e.status(400).json({status:400,error:"User not found!"});const t=await r.save();return e.status(200).json({status:"ok",data:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Nt.route(jt).put([g,async(t,e)=>{const{userId:s}=t.query||{};try{const t=await ft.findOneAndUpdate({user:s},{$set:{status:"APPROVAL"}},{new:!0});return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]),Nt.route(zt).get([g,async(t,e)=>{const s=c.pick(t.query,["status"]);try{const t=await ft.find(s);return e.status(200).json({status:"ok",data:t})}catch(t){return e.status(400).json({status:400,error:t})}}]);const wt=i.z.object({body:i.z.object({accountName:i.z.string(),accountNumber:i.z.string(),iban:i.z.string(),swiftCode:i.z.string(),isMain:i.z.boolean()})}),qt=i.z.object({body:i.z.object({accountName:i.z.string().optional(),accountNumber:i.z.string().optional(),iban:i.z.string().optional(),swiftCode:i.z.string().optional(),isMain:i.z.boolean().optional()})}),vt=m({accountName:{type:String,required:!0,unique:!0},accountNumber:{type:String,required:!0,unique:!0},iban:{type:String,required:!0,unique:!0},swiftCode:{type:String,required:!0},phone:{type:String,required:!0},balance:{type:Number,required:!0,default:0},isMain:{type:Boolean,required:!1,default:!1}});vt.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var kt=n.model("Account",vt);const It="/account",St="/account/:id",_t=t.Router();_t.route(It).post([g,y(wt),async(t,e)=>{const{accountName:s,accountNumber:o,iban:r,swiftCode:n,isMain:a}=t.body,{user:i}=t||{};try{const t=new kt({accountName:s,accountNumber:o,iban:r,swiftCode:n,isMain:a,phone:i.phone}),u=await t.save();return e.status(200).json({status:"ok",data:u.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),_t.route(St).put([g,y(qt),async(t,e)=>{const{accountName:s,accountNumber:o,iban:r,swiftCode:n,isMain:a}=t.body,{id:i}=t.params;try{const t=await kt.findByIdAndUpdate(i,{$set:{accountName:s,accountNumber:o,iban:r,swiftCode:n,isMain:a}},{new:!0});return e.status(200).json({status:"ok",data:null==t?void 0:t.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const Ot=m({accountId:{type:n.Types.ObjectId,ref:"Account"},type:{type:String,required:!0},phone:{type:String,required:!0},amount:{type:Number,required:!0},category:{type:String,required:!0},description:{type:String,required:!0},date:{type:String,required:!0}});Ot.method("doc",(function(){return c.omit(this._doc,["password","__v"])}));var At=n.model("Transactions",Ot);const Et=i.z.object({body:i.z.object({accountId:i.z.string(),type:i.z.string().optional(),amount:i.z.string(),category:i.z.string(),description:i.z.string()})}),Dt="/transaction",Rt="/transaction/deposit",Ut=t.Router();Ut.route(Dt).post([g,y(Et),async(t,e)=>{const{accountId:s,type:o,amount:r,category:n,description:a}=t.body;try{const t=new At({accountId:s,amount:r,category:n,description:a,type:o,date:new Date}),i=await t.save();return e.status(200).json({status:"ok",data:i.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]),Ut.route(Rt).post([g,y(Et),async(t,e)=>{const{accountId:s,amount:o,category:r,description:n}=t.body,{phone:a}=t.user||{};try{const t=await kt.findById(s);if(!t)return e.status(400).json({status:400,error:"Account not found!"});if(!c.isNumber(+o))return e.status(400).json({status:400,error:"Amount invalid!"});t.balance=Number(null==t?void 0:t.balance)+Number(o),await t.save();const i=new At({accountId:s,amount:Number(o),category:r,description:n,type:"DEPOSIT",date:new Date,phone:a}),u=await i.save();return e.status(200).json({status:"ok",data:u.doc()})}catch(t){return e.status(400).json({status:400,error:t})}}]);const Pt=+l("PORT"),$t=l("DB_URL");Pt&&$t||(console.error("Missing env!"),process.exit(1));const Tt=t();Tt.use(o("combined")),Tt.use(s({contentSecurityPolicy:!1,frameguard:!1,crossOriginEmbedderPolicy:!1,crossOriginOpenerPolicy:!1,crossOriginResourcePolicy:!1})),Tt.use(e({origin:"*"})),Tt.use(t.json()),Tt.use(t.urlencoded({extended:!1})),Tt.use(t.static(d.join(__dirname+"/public"))),Tt.use("/api",[S,I,F,K,H,et,mt,yt,Nt,_t,Ut]),Tt.get("*",(async(t,e)=>e.sendFile(d.join(__dirname+"/public/index.html")))),Tt.listen(Pt,(()=>{console.log(`Server started on port ${Pt}: http://localhost:${Pt}`),(({db:t})=>{const e=()=>{n.connect(t,{dbName:"pina_app"}).then((t=>console.info(`Successfully connected to ${t.connection.name}`))).catch((t=>(console.error("Error connecting to database: ",t),process.exit(1))))};e(),n.connection.on("disconnected",e)})({db:$t})})).on("error",(t=>{console.log("ERROR: ",t)})),exports.app=Tt;
