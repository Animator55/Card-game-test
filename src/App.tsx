import React from "react"
import './assets/App.css'
import Peer, { DataConnection } from "peerjs"
import PlayTable from "./PlayTable"
import Menu from "./components/Menu"
import Auth from "./components/Auth"
import HandEditor from "./components/HandEditor"

type dataTransferMenu = { action: string, cardsTransfered?: string[][] }

let conn: DataConnection | undefined = undefined
let peer: Peer | undefined = undefined

const generatedTalesCards = (cards: string[][]) => {
  let newCards = []

  for (let i = 0; i < cards.length; i++) {
    let stack = cards[i].map((card) => {
      return card + "." + Math.floor(Math.random() * 100000)
      // return card + "."+ i
    })
    newCards.push(stack)
  }
  return newCards
}

let cardsP1 = generatedTalesCards([
  ["0001", "0002", "0001", "0002", "0003"],
  ["0001", "0001", "0003", "0001", "0000"],
  ["0002", "0000", "0001", "0003", "0002"],
])
// let cardsP2 = generatedTalesCards([
//   ["0002", "0005", "0000", "0003", "0001"],
//   ["0002", "0005", "0003", "0000", "0002"],
//   ["0001", "0005", "0002", "0006", "0000"],
// ])

const defaultUsers: string[] = []

export default function App() {
  const [activateIA, setIA] = React.useState(false)
  const [menu, bootbattle] = React.useState(true)
  const [cards, setCards] = React.useState<string[][]>(cardsP1)
  const [cardsOpponent, setCardsOpponent] = React.useState<string[][]>([])
  const [selectedPlayer, setPlayer] = React.useState<string | undefined>()
  const [page, setPage] = React.useState("login")

  const [cachedUsers, setCachedUsers] = React.useState<string[]>(defaultUsers)

  const [users, setUsers] = React.useState<{ player: string, enemy: string }>({
    player: "",
    enemy: ""
  })
  /// CONNECTIONS 


  const connectToPeer = (duel: string | undefined) => { // trys to connect to peers, if chat is undefined, func will loop
    if (conn !== undefined || peer === undefined) return

    function closeConn() {
      console.log('closeConn')
      conn = undefined
    }

    if (duel !== undefined) {
      console.log('Connecting to ' + duel)
      if (!peer.connect) return
      conn = peer.connect(duel)
      conn.on('close', closeConn)
      setUsers({ ...users, enemy: duel.split("-")[0] })
    }
  }
  function connection(id: string): undefined | string { //create session
    // if(!checkValidId(id, password)) return "invalid"
    peer = new Peer(id);
    if (peer === undefined) return

    peer.on('error', function (err) {
      switch (err.type) {
        case 'unavailable-id':
          console.log(id + ' is taken')
          peer = undefined
          break
        case 'peer-unavailable':
          console.log('user offline')
          break
        default:
          conn = undefined
          console.log('an error happened')
      }
      return false;
    })
    peer.on('open', function (id: string) {
      if (peer === undefined || peer.id === undefined) return
      console.log('Hi ' + id)
      setUsers({ ...users, player: peer.id.split("-")[0] })
    })
    if (conn !== undefined) return

    peer.on("connection", function (conn: DataConnection | undefined) {
      if (!conn) return

      conn.on("data", function (data) { //RECIEVED DATA
        console.log("sended to you " + data)
        if (!peer || !conn) return

        let Data = data as dataTransferMenu

        if (Data.action === "fight") {
          peer = undefined
          bootbattle(false)
        }
        else setCardsOpponent(Data.cardsTransfered!)
      })

      conn.on('close', function () {
        if (!conn) return
        console.log('connection was closed by ' + conn.peer)
        conn.close()
        conn = undefined
      })

    });
  }

  /// COMPONENTS


  const UsersList = ()=>{
    return <ul>
      <button onClick={(e)=>{
        let input = e.currentTarget.previousElementSibling as HTMLInputElement
        setCachedUsers([...cachedUsers, input.value])
      }}></button>
      {Object.values(cachedUsers).map((el, i)=>{
        return <button
          key={"user-li" + el + i}
          onClick={()=>{setPlayer(el); connectToPeer(el+ "-login")}}
        ></button>
      })}
    </ul>
  }

  const ShowPlayer = ()=>{
    let checks = users.enemy !== "" && 
    (conn?.peerConnection.connectionState === "connected" 
    || conn?.peerConnection.connectionState === "new")
    return <section>
      <h2>{selectedPlayer}</h2>
        {checks && 
        <button onClick={() => { if (conn) conn.send({ cardsTransfered: cards }) }}>send cards</button>}
        
        {checks && cardsOpponent !== undefined && <button onClick={() => {
          if (!peer || !conn) return
          conn.send({ action: "fight" })
          peer = undefined
          bootbattle(false)
        }}>Fight</button>}
    </section>
  }

  // pages

  const pages: {[key: string]: any} = {
    "login": <Auth confirm={(val: string)=>{connection(`${val}-login`); setPage("menu")}}/>,
    "menu": <Menu setPage={setPage}/>,
    "userList":  <>
      {selectedPlayer !== undefined ? 
        <ShowPlayer/>
        :
        <UsersList/>
      }
    </>,
    "handEdit": <HandEditor setPage={setPage} cardsDef={cards} setCardsDef={setCards}/>,
  }

  /// EFFECTS
  React.useEffect(()=>{
    if(conn) conn?.peerConnection.connectionState
  })

  return menu ?
    <main>
      <section>
        <button onClick={() => { setIA(!activateIA) }}>{activateIA ? "IA" : "no-IA"}</button>
        {/* <button onClick={() => { connection("a-login") }}>Log a</button>
        <button onClick={() => { connection("b-login") }}>Log b</button>
        {peer !== undefined &&
          <>
            <button onClick={() => { connectToPeer("a-login") }}>connect a</button>
            <button onClick={() => { connectToPeer("b-login") }}>connect b</button>
          </>
        } */}
        {pages[page]}
        {/* <hr></hr>
        <hr></hr> */}
      </section>
    </main>
    :
    <PlayTable
      usersDef={users}
      cardsDefault={cards}
      cardsOpponentDefault={cardsOpponent}
      activateIA={activateIA}
    />

}