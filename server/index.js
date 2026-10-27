import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'
import {makeModel} from './store.js'
import {TOOLS} from './seed.js'
const {MONGO_URI,JWT_SECRET,ADMIN_EMAIL,ADMIN_PASSWORD,CLIENT_ORIGIN='http://localhost:5173',PORT=4000}=process.env
if(!JWT_SECRET||!ADMIN_EMAIL||!ADMIN_PASSWORD){console.error('Fill in server/.env first (copy .env.example)');process.exit(1)}
const local=!MONGO_URI||MONGO_URI==='local'
if(!local)await mongoose.connect(MONGO_URI)
const app=express();app.use(cors({origin:CLIENT_ORIGIN}),express.json({limit:'1mb'}))
const M={}
for(const c of ['experiments','subexperiments','modules','tools','settings']){
  const s=new mongoose.Schema(c==='settings'?{_id:String}:{},{strict:false,timestamps:true})
  s.set('toJSON',{transform:(_,o)=>{o.id=String(o._id);delete o._id;delete o.__v;return o}})
  M[c]=local?makeModel(c):mongoose.model(c,s)}
if(!(await M.settings.findById('toolsSeed'))){for(const t of TOOLS)await M.tools.create(t);await M.settings.findByIdAndUpdate('toolsSeed',{$set:{done:true}},{upsert:true})}
const eq=(a,b)=>{const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&crypto.timingSafeEqual(x,y)}
const tries={}
app.post('/api/login',(req,res)=>{const t=tries[req.ip]=(tries[req.ip]||[]).filter(x=>Date.now()-x<9e5)
  if(t.length>=8)return res.status(429).json({error:'Too many attempts. Try again later.'})
  const {email='',password=''}=req.body
  if(eq(String(email),ADMIN_EMAIL)&&eq(String(password),ADMIN_PASSWORD))return res.json({token:jwt.sign({admin:true},JWT_SECRET,{expiresIn:'7d'})})
  t.push(Date.now());res.status(401).json({error:'Invalid credentials'})})
const auth=(req,res,next)=>{try{jwt.verify((req.headers.authorization||'').slice(7),JWT_SECRET);next()}catch{res.status(401).json({error:'Not authorized'})}}
app.get('/api/me',auth,(q,r)=>r.json({ok:true}))
const EXT=['pdf','ppt','pptx','png','jpg','jpeg','webp']
fs.mkdirSync('uploads',{recursive:true})
const up=multer({storage:multer.diskStorage({destination:'uploads',filename:(r,f,cb)=>cb(null,crypto.randomUUID()+path.extname(f.originalname).toLowerCase())}),
  limits:{fileSize:25*1048576},fileFilter:(r,f,cb)=>cb(EXT.includes(path.extname(f.originalname).slice(1).toLowerCase())?null:new Error('File type not allowed'),true)})
app.post('/api/upload',auth,up.single('file'),(req,res)=>res.json({url:'/uploads/'+req.file.filename,name:req.file.originalname,size:req.file.size}))
app.use('/uploads',express.static('uploads',{setHeaders:r=>r.setHeader('X-Content-Type-Options','nosniff')}))
const model=(req,res,next)=>{req.M=M[req.params.col];req.M?next():res.status(404).json({error:'Unknown collection'})}
const clean=b=>{const o={...b};for(const k of ['_id','id','__v','createdAt','updatedAt'])delete o[k];return o}
app.get('/api/:col',model,async(req,res)=>res.json(await req.M.find()))
app.get('/api/:col/:id',model,async(req,res)=>{const d=await req.M.findById(req.params.id).catch(()=>null);d?res.json(d):res.status(404).json({error:'Not found'})})
app.post('/api/:col',auth,model,async(req,res)=>res.status(201).json(await req.M.create(clean(req.body))))
app.put('/api/:col/:id',auth,model,async(req,res)=>{const d=await req.M.findByIdAndUpdate(req.params.id,{$set:clean(req.body)},{new:true,upsert:req.params.col==='settings'}).catch(()=>null);d?res.json(d):res.status(404).json({error:'Not found'})})
app.delete('/api/:col/:id',auth,model,async(req,res)=>{await req.M.findByIdAndDelete(req.params.id).catch(()=>null)
  if(req.params.col==='experiments')await M.subexperiments.deleteMany({experimentId:req.params.id});res.json({ok:true})})
app.use((err,req,res,next)=>res.status(400).json({error:err.message}))
// app.listen(PORT,()=>console.log('API running on http://localhost:'+PORT))
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`)
})
