import {useState} from 'react'
import {Link,Navigate,useNavigate} from 'react-router-dom'
import {useApp} from '../context'
import {useCol} from '../hooks'
export function Login(){const [e,setE]=useState(''),[p,setP]=useState(''),[b,setB]=useState(false),{notify,isAdmin,login}=useApp(),nav=useNavigate()
  if(isAdmin)return <Navigate to="/admin"/>
  const go=async ev=>{ev.preventDefault();setB(true);try{await login(e,p);nav('/admin')}catch(er){notify(er.message==='Failed to fetch'?'Cannot reach the server. Is it running on port 4000?':er.message,1)}setB(false)}
  return <form onSubmit={go} className="glass mx-auto max-w-sm space-y-3 p-6"><h2 className="text-xl font-bold">Admin Login</h2>
    <label className="block text-sm">Email<input className="inp" type="email" required value={e} onChange={x=>setE(x.target.value)}/></label>
    <label className="block text-sm">Password<input className="inp" type="password" required value={p} onChange={x=>setP(x.target.value)}/></label>
    <button className="btn w-full" disabled={b}>{b?'Signing in…':'Sign in'}</button></form>}
export function Admin(){const {isAdmin,user}=useApp(),ex=useCol('experiments'),sub=useCol('subexperiments'),mo=useCol('modules'),to=useCol('tools')
  if(user===undefined)return <p>Loading…</p>
  if(!isAdmin)return <Navigate to="/login"/>
  const files=(mo||[]).reduce((n,m)=>n+(m.pdf?1:0)+(m.ppt?1:0),0)
  return <div><h2 className="mb-4 text-2xl font-bold">Dashboard</h2><div className="grid grid-cols-2 gap-4 md:grid-cols-3">
    {[['Experiments',ex?.length,'/'],['Sub-experiments',sub?.length,'/'],['Modules',mo?.length,'/modules'],['Tools',to?.length,'/tools'],['Uploaded files',files,'/modules'],['Resume & profile','✎','/resume']].map(([a,n,l])=>
    <Link key={a} to={l} className="glass p-5 hover:-translate-y-1"><p className="text-3xl font-bold text-primary">{n??'…'}</p><p>{a}</p></Link>)}</div>
    <p className="mt-4 text-sm opacity-70">Edit content directly on each public page (controls only appear for you). Edit the ID card from the sidebar.</p></div>}
export const NotFound=()=><div className="glass p-8 text-center"><h2 className="text-3xl font-bold">404</h2><p>Page not found.</p><Link className="btn mt-3" to="/">Go home</Link></div>
