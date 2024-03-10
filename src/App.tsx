import React from "react"
import './assets/App.css'
import Peer, { DataConnection } from "peerjs"
import PlayTable from "./PlayTable"
import Menu from "./components/Menu"
import Auth from "./components/Auth"
import HandEditor from "./components/HandEditor"
import { cardsD } from "./assets/cardsList"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

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

const generateHand = ()=>{
  let hand = []

  let cards = Object.keys(cardsD)
  for(let i=0; i<3; i++) {
    let round = []
    for(let j=0; j<5; j++) {
      round.push(cards[Math.floor(Math.random() * cards.length)]+ "." + Math.floor(Math.random() * 100000))
    }
    hand.push(round)
  }
  return hand
}

const defaultUsers: string[] = []

export default function App() {
  const [alert, activateAlert] = React.useState("")
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

  const singlePlayer = ()=>{
    setUsers({...users, enemy: "IA"})
    let IACards = generateHand()

    setCardsOpponent(IACards)
    setIA(true)
    bootbattle(false)
  }

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
          activateAlert("The name " + id + " is taken, please use other")
          break
        case 'peer-unavailable':
          console.log('user offline')
          activateAlert("User Offline")
          break
        default:
          conn = undefined
          console.log('an error happened', peer)
          activateAlert("A connection error happened, please retry")
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
    return <section className="user-list">
        <div className="search">
          <input placeholder="username"/>
          <button onClick={(e)=>{
            let input = e.currentTarget.previousElementSibling as HTMLInputElement
            if(input.value === "") return
            setCachedUsers([...cachedUsers, input.value])
          }}><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
        </div>

        <ul>
          {Object.values(cachedUsers).map((el, i)=>{
            return <button
              key={"user-li" + el + i}
              onClick={()=>{setPlayer(el); connectToPeer(el+ "-login")}}
            >{el}</button>
          })}
        </ul>
    </section>
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
    "login": <Auth loginState={alert} confirm={(val: string)=>{connection(`${val}-login`)}}/>,
    "menu": <Menu setPage={setPage} singlePlayer={singlePlayer}/>,
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
    if(page === "login" && peer && users.player !== "" && peer.open)  {
      activateAlert("")
      setPage("menu")
    }
  })

  return menu ?
    <main>
      {pages[page]}
    </main>
    :
    <PlayTable
      usersDef={users}
      cardsDefault={cards}
      cardsOpponentDefault={cardsOpponent}
      activateIA={activateIA}
    />

}