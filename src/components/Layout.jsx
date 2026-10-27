import {Component,lazy,Suspense,useState} from 'react'
import {NavLink,Link} from 'react-router-dom'
import {useApp} from '../context'
import IdCard from './IdCard'
const Spline=lazy(()=>import('@splinetool/react-spline'))
class Safe extends Component{state={e:false};static getDerivedStateFromError(){return{e:true}};render(){return this.state.e?null:this.props.children}}
const slow=navigator.connection?.saveData||navigator.hardwareConcurrency<4
function Bg(){const u=import.meta.env.VITE_SPLINE_URL
  return <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-sky-50 via-white to-blue-100 dark:from-navy dark:via-slate-900 dark:to-blue-950">
    {u&&!slow&&<Safe><Suspense fallback={null}><Spline scene={u}/></Suspense></Safe>}
    <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/75"/></div>}
export default function Layout({children}){
  const {dark,setDark,user,isAdmin,logout}=useApp(); const [open,setOpen]=useState(false); const [idOpen,setIdOpen]=useState(false)
  const l=({isActive})=>`rounded-lg px-3 py-1.5 text-sm ${isActive?'bg-primary text-white':'hover:bg-sky-50 dark:hover:bg-slate-800'}`
  return <><Bg/>
  <header className="fixed inset-x-0 top-0 z-40 glass !rounded-none"><nav className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2" aria-label="Main">
    <Link to="/" className="flex items-center gap-2 font-bold"><span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-white">DSL</span><span className="hidden sm:block">Data Science Digital Lab</span></Link>
    <button className="btn2 md:hidden" aria-label="Menu" onClick={()=>setOpen(!open)}>☰</button>
    <div className={`${open?'flex':'hidden'} absolute left-0 top-full w-full flex-col gap-1 bg-white p-3 dark:bg-slate-900 md:static md:flex md:w-auto md:flex-row md:bg-transparent md:p-0 md:dark:bg-transparent`} onClick={()=>setOpen(false)}>
      <NavLink to="/" end className={l}>Experiments</NavLink><NavLink to="/modules" className={l}>Modules</NavLink>
      <NavLink to="/tools" className={l}>Tools</NavLink><NavLink to="/resume" className={l}>Resume</NavLink>
      {isAdmin&&<NavLink to="/admin" className={l}>Dashboard</NavLink>}
      {user?<button className="btn2" onClick={logout}>Logout</button>:<NavLink to="/login" className={l}>Admin Login</NavLink>}
      <button className="btn2" aria-label="Toggle dark mode" onClick={()=>setDark(!dark)}>{dark?'☀️ Light':'🌙 Dark'}</button></div></nav></header>
  <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-8 pt-20 lg:flex-row">
    <aside className="lg:sticky lg:top-20 lg:w-72 lg:shrink-0 lg:self-start">
      <button className="btn2 mb-2 w-full lg:hidden" onClick={()=>setIdOpen(!idOpen)}>🪪 Student ID</button>
      <div className={`${idOpen?'block':'hidden'} lg:block`}><IdCard/></div></aside>
    <main className="min-w-0 flex-1">{children}</main></div>
  <footer className="glass !rounded-none py-4 text-center text-sm"><p>© {new Date().getFullYear()} Data Science Digital Lab · <a className="text-primary underline" href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></p></footer></>}
