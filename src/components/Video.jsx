import {useState} from 'react'
import {ytEmbed} from '../hooks'
export default function Video({url}){
  const [play,setPlay]=useState(false)
  if(!url?.trim())return null
  const src=ytEmbed(url)
  if(!src)return <p className="glass p-3 text-sm text-red-600">Could not read this video link. <a className="underline" href={url} target="_blank" rel="noopener noreferrer">Open it directly</a></p>
  const id=src.split('/').pop()
  return <div className="space-y-1"><div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
    {play?<iframe title="Video" src={src+'?autoplay=1&rel=0'} className="h-full w-full" referrerPolicy="strict-origin-when-cross-origin"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>
    :<button type="button" onClick={()=>setPlay(true)} aria-label="Play video" className="group relative h-full w-full">
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" className="h-full w-full object-cover"/>
      <span className="absolute inset-0 grid place-items-center"><span className="grid h-16 w-16 place-items-center rounded-full bg-red-600 text-2xl text-white shadow-lg transition group-hover:scale-110">▶</span></span></button>}</div>
    <a className="text-sm text-primary underline" href={url} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></div>}
