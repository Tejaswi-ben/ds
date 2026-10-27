import {useState} from 'react'
import Editor from '@monaco-editor/react'
import {useApp} from '../context'
const L={javascript:{label:'JavaScript',code:'console.log("Hello, Data Science!")'},python:{label:'Python',code:'print("Hello, Data Science!")'},
java:{label:'Java',code:'public class Main {\n  public static void main(String[] a) {\n    System.out.println("Hello, Data Science!");\n  }\n}'}}
let py
const loadPy=()=>py||(py=new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';s.onload=()=>window.loadPyodide().then(ok,no);s.onerror=()=>no(new Error('Could not load Python runtime (check internet)'));document.head.appendChild(s)}))
const runPy=async(code,files=[])=>{const p=await loadPy();let o='',imgs=[];for(const f of files)p.FS.writeFile(f.name,f.data);if(files.some(f=>/\.(png|jpe?g|webp|gif)$/i.test(f.name)))await p.loadPackage('pillow');p.setStdout({batched:t=>{o+=t+'\n'}});p.setStderr({batched:t=>{o+=t+'\n'}})
  try{await p.loadPackagesFromImports(code)
    if(/seaborn/.test(code)&&!p.runPython("import importlib.util as u\nu.find_spec('seaborn') is not None")){await p.loadPackage('micropip');await p.runPythonAsync("import micropip\nawait micropip.install('seaborn')")}
    const plot=/matplotlib|seaborn|plt\./.test(code)
    if(plot)await p.runPythonAsync("import matplotlib,warnings\nmatplotlib.use('agg')\nwarnings.filterwarnings('ignore',message='.*FigureCanvasAgg.*')")
    await p.runPythonAsync(code)
    if(plot)imgs=p.runPython("import io,base64\nimport matplotlib.pyplot as plt\nr=[]\nfor n in plt.get_fignums():\n    b=io.BytesIO()\n    plt.figure(n).savefig(b,format='png',bbox_inches='tight')\n    r.append(base64.b64encode(b.getvalue()).decode())\nplt.close('all')\nr").toJs()
  }catch(e){o+=String(e.message)}
  return {text:o||(imgs.length?'':'(no output)'),imgs}}
const runJS=code=>new Promise(res=>{const src=`const o=[];console.log=(...a)=>o.push(a.map(String).join(' '));console.error=console.log;try{eval(${JSON.stringify(code)})}catch(e){o.push('Error: '+e.message)}postMessage(o.join('\\n')||'(no output)')`
  const w=new Worker(URL.createObjectURL(new Blob([src])));const t=setTimeout(()=>{w.terminate();res('Error: timed out after 5 seconds')},5000);w.onmessage=e=>{clearTimeout(t);w.terminate();res(e.data)}})
export default function Playground({starter}){
  const {dark}=useApp(),[lang,setLang]=useState('python'),[code,setCode]=useState(starter||L.python.code),[out,setOut]=useState(''),[run,setRun]=useState(false),[imgs,setImgs]=useState([]),[files,setFiles]=useState([])
  const url=import.meta.env.VITE_EXEC_URL
  const addFile=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;if(f.size>10*1048576){setOut('File must be under 10 MB');return}
  const data=new Uint8Array(await f.arrayBuffer()),url=f.type.startsWith('image/')?URL.createObjectURL(f):null
  setFiles(a=>[...a.filter(x=>x.name!==f.name),{name:f.name,data,url}])}
  const pick=l=>{setLang(l);setCode(L[l].code)}
  const exec=async()=>{if(!url){if(lang==='java'){setOut('⚠ Java needs a sandbox service. Set VITE_EXEC_URL (see README). JavaScript and Python run in your browser without setup.');return}
    setRun(true);setOut(lang==='python'?'Loading Python (first run takes a few seconds)…':'Running…')
    try{if(lang==='python'){const r=await runPy(code,files);setOut(r.text);setImgs(r.imgs)}else{setImgs([]);setOut(await runJS(code))}}catch(e){setOut('Error: '+e.message)}setRun(false);return}
    setRun(true);setOut('Running…')
    try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({language:lang,version:'*',files:[{name:lang==='java'?'Main.java':undefined,content:code}]})})
      if(!r.ok)throw new Error('Execution service returned '+r.status)
      const j=await r.json();setOut([j.compile?.output&&'[Compile]\n'+j.compile.output,j.run?.stdout,j.run?.stderr&&'[Error]\n'+j.run.stderr].filter(Boolean).join('\n')||'(no output)')}
    catch(e){setOut('Error: '+e.message)}setRun(false)}
  return <div className="glass p-3"><div className="mb-2 flex flex-wrap gap-2">
    <select aria-label="Language" className="inp !w-auto" value={lang} onChange={e=>pick(e.target.value)}>{Object.entries(L).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select>
    <button className="btn" onClick={exec} disabled={run}>▶ Run Code</button>
    <button className="btn2" onClick={()=>setCode(L[lang].code)}>Reset Code</button>
    <button className="btn2" onClick={()=>navigator.clipboard.writeText(code)}>Copy Code</button>
    <label className="btn2 cursor-pointer">📎 Upload file<input type="file" hidden accept=".png,.jpg,.jpeg,.webp,.gif,.csv,.txt,.json" onChange={addFile}/></label>
    {files.map(f=><span key={f.name} className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2 py-1 text-xs dark:bg-slate-800">{f.url&&<img src={f.url} alt="" className="h-6 w-6 rounded object-cover"/>}{f.name}<button aria-label={'Remove '+f.name} onClick={()=>setFiles(a=>a.filter(x=>x.name!==f.name))}>×</button></span>)}</div>
    <div className="grid gap-3 md:grid-cols-2"><div className="h-72 overflow-hidden rounded-lg border dark:border-slate-700"><Editor language={lang} value={code} onChange={v=>setCode(v||'')} theme={dark?'vs-dark':'light'} options={{minimap:{enabled:false},fontSize:13}}/></div>
      <div aria-live="polite" className="h-72 overflow-auto rounded-lg bg-navy p-3 text-xs text-green-300"><pre className="whitespace-pre-wrap">{out||'Output appears here…'}</pre>{files.some(f=>f.url)&&<p className="mt-2 text-slate-400">Uploaded photos:</p>}{files.filter(f=>f.url).map(f=><img key={f.name} alt={f.name} src={f.url} className="mt-1 max-w-full rounded bg-white"/>)}{imgs.map((b,i)=><img key={i} alt="Plot" className="mt-2 max-w-full rounded bg-white" src={'data:image/png;base64,'+b}/>)}</div></div></div>}
