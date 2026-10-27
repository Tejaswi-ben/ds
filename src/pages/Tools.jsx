import ListPage from '../components/ListPage'
const F=[{k:'title',label:'Tool name'},{k:'category',label:'Category'},{k:'desc',label:'Short description',type:'textarea'},{k:'url',label:'Official website URL',type:'url'},{k:'image',label:'Logo image URL',type:'url'}]
export default function Tools(){return <ListPage col="tools" title="Data Science Tools" fields={F} href={i=>i.url}/>}
