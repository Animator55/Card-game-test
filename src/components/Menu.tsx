type Props = {setPage: Function, singlePlayer: Function}

export default function Menu({setPage, singlePlayer}: Props) {
  return <section>
    <h1>Magic Card Game</h1>
    <hr></hr>
    <button onClick={()=>{singlePlayer()}}>SinglePlayer</button>
    <button onClick={()=>{setPage("userList")}}>Multiplayer</button>
    <button onClick={()=>{setPage("handEdit")}}>Edit Cards</button>
  </section>
}