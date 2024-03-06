type Props = {setPage: Function}

export default function Menu({setPage}: Props) {
  return <section>
    <h1>Magic Card Game</h1>
    <hr></hr>
    <button onClick={()=>{setPage("singlePlayer")}}>SinglePlayer</button>
    <button onClick={()=>{setPage("userList")}}>Multiplayer</button>
    <button onClick={()=>{setPage("handEdit")}}>Edit Cards</button>
  </section>
}