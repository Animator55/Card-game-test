type Props = {result: string}

export default function Conclusion({result}: Props) {
  return <section className='conclusion-screen'>
    <h2 className="title fade-in">You {result}</h2>
    <button 
      className='go-to-menu fade-in' 
      style={{animationDelay: "500ms"}}
      onClick={()=>{location.reload()}}></button>
  </section>
}