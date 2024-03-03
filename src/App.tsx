import React from "react"
import './assets/App.css'
import { cardsD } from "./assets/cardsList"
import Peer, { DataConnection } from "peerjs"
import PlayTable from "./PlayTable"

type dataTransferMenu = {action: string, cardsTransfered: string[][]}

let conn: DataConnection | undefined = undefined
let peer: Peer | undefined = undefined

const generatedTalesCards = (cards: string[][])=>{
  let newCards = []

  for(let i=0; i < cards.length; i++) {
    let stack = cards[i].map((card, i)=>{
      return card + "."+ Math.floor(Math.random()*100000)
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

export default function App() {
  const [activateIA, setIA] = React.useState(false)
  const [menu, bootbattle] = React.useState(true)
  const [cards, setCards] = React.useState<string[][]>(cardsP1)
  const [cardsOpponent, setCardsOpponent] = React.useState<string[][]>([])

  const [users, setUsers] = React.useState<{player: string, enemy: string}>({
    player: "",
    enemy:  ""
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
      if(!peer.connect) return
      conn = peer.connect(duel)
      conn.on('close', closeConn)
      setUsers({...users, enemy: duel.split("-")[0]})
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
      setUsers({...users, player: peer.id.split("-")[0]})
    })
    if (conn !== undefined) return

    peer.on("connection", function (conn: DataConnection | undefined) {
      if(!conn) return

      conn.on("data", function (data) { //RECIEVED DATA
        console.log("sended to you " + data)
        if(!peer ||!conn) return

        let Data = data as dataTransferMenu

        setCardsOpponent(Data.cardsTransfered)
      })

      conn.on('close', function () {
        if(!conn) return
        console.log('connection was closed by ' + conn.peer)
        conn.close()
        conn = undefined
      })
      
    });
  }

  /// EFFECTS

  return <main>
    {menu ?
      <section>
        <button onClick={()=>{setIA(!activateIA)}}>{activateIA ? "IA" : "no-IA"}</button>
        <button onClick={()=>{connection("a-login")}}>Log a</button>
        <button onClick={()=>{connection("b-login")}}>Log b</button>
        {peer !== undefined && 
          <>
            <button onClick={()=>{connectToPeer("a-login")}}>connect a</button>
            <button onClick={()=>{connectToPeer("b-login")}}>connect b</button>
          </>
        }
        <hr></hr>
        {users.enemy !== "" &&<button onClick={()=>{if(conn) conn.send({cardsTransfered: cards})}}>send cards</button>}
        <hr></hr>
        <p style={{color: "white"}}>{cards.join(", ")}</p>
        <hr></hr>
        <p style={{color: "white"}}>{cardsOpponent.join(", ")}</p>
        <button onClick={()=>{
          if(!peer || !conn)return
          conn.close()
          conn = undefined
          peer = undefined
          bootbattle(false)
        }}>Fight</button>
      </section>
      :
      <PlayTable
        usersDef={users}
        cardsDefault={cards}
        cardsOpponentDefault={cardsOpponent}
        activateIA={activateIA}
      />
    }
  </main>
}