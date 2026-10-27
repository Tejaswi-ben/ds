import fs from 'fs'
import crypto from 'crypto'
const FILE='data.json'
let db={};try{db=JSON.parse(fs.readFileSync(FILE,'utf8'))}catch{}
const save=()=>fs.writeFileSync(FILE,JSON.stringify(db))
const now=()=>new Date().toISOString()
export const makeModel=name=>{const t=()=>db[name]||(db[name]=[]);return{
  find:async()=>[...t()],
  findById:async id=>t().find(x=>x.id===id)||null,
  create:async d=>{const o={...d,id:crypto.randomUUID(),createdAt:now(),updatedAt:now()};t().push(o);save();return o},
  findByIdAndUpdate:async(id,{$set},{upsert})=>{let o=t().find(x=>x.id===id);if(!o){if(!upsert)return null;o={id,createdAt:now()};t().push(o)}Object.assign(o,$set,{updatedAt:now()});save();return o},
  findByIdAndDelete:async id=>{db[name]=t().filter(x=>x.id!==id);save()},
  deleteMany:async q=>{const[k,v]=Object.entries(q)[0];db[name]=t().filter(x=>x[k]!==v);save()}}}
