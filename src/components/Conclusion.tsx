type Props = {result: string, sendToMenu: Function}

export default function Conclusion({result, sendToMenu}: Props) {
  return <section className='conclusion-screen'>
    <h2>You {result}</h2>
    <button className='go-to-menu' onClick={()=>{sendToMenu()}}>Return to Menu</button>
  </section>
}