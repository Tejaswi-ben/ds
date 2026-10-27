import {Routes,Route} from 'react-router-dom'
import Layout from './components/Layout'
import Experiments from './pages/Experiments'
import Detail from './pages/Detail'
import Modules from './pages/Modules'
import ModuleDetail from './pages/ModuleDetail'
import Tools from './pages/Tools'
import Resume from './pages/Resume'
import {Login,Admin,NotFound} from './pages/Misc'
export default function App(){return <Layout><Routes>
<Route path="/" element={<Experiments/>}/>
<Route path="/experiments/:id" element={<Detail kind="experiments"/>}/>
<Route path="/experiments/:id/sub/:sid" element={<Detail kind="subexperiments"/>}/>
<Route path="/modules" element={<Modules/>}/><Route path="/modules/:id" element={<ModuleDetail/>}/><Route path="/tools" element={<Tools/>}/><Route path="/resume" element={<Resume/>}/>
<Route path="/login" element={<Login/>}/><Route path="/admin" element={<Admin/>}/><Route path="*" element={<NotFound/>}/></Routes></Layout>}
