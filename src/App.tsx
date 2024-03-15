import React from "react"
import './assets/App.css'
import Peer, { DataConnection } from "peerjs"
import PlayTable from "./PlayTable"
import Menu from "./components/Menu"
import Auth from "./components/Auth"
import HandEditor from "./components/HandEditor"
import { cardsD } from "./assets/cardsList"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {  faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { UserList } from "./components/UserList"
import { ShowPlayer } from "./components/ShowPlayer"

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

let justLogged = false
let slideFromRight = true

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

    let loading = document.querySelector(".loading-screen")
    loading?.classList.remove("d-none")
    setTimeout(()=>{
      bootbattle(false)
    }, 500)
  }

  const startMultiplayerBattle = () => {
    if (!peer || !conn) return
    conn.send({ action: "fight", cardsTransfered: cards})
    peer = undefined
    let loading = document.querySelector(".loading-screen")
    loading?.classList.remove("d-none")
    setTimeout(()=>{
      bootbattle(false)
    }, 500)
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
          activateAlert("The name " + id.split("-")[0] + " is taken, please insert other")
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
          setCardsOpponent(Data.cardsTransfered!)
          peer = undefined // try later to remove this
          let loading = document.querySelector(".loading-screen")
          loading?.classList.remove("d-none")
          setTimeout(()=>{
            bootbattle(false)
          }, 500)
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


  const backToMenu = (from: string, slide: boolean)=>{
    let screen = document.querySelector(from)
    if(screen && !slide){ 
      screen.classList.remove("fade-from-right")
      screen.clientWidth
      screen.classList.add("fade-to-right")
      screen.clientWidth
    }
    
    setTimeout(() => {
      justLogged = false
      setPage("menu")
    }, 300);
  }

  const backToUserList = ()=>{
    setPlayer(undefined)
    slideFromRight= false
  }

  // pages
  const pages: {[key: string]: any} = {
    "login": <Auth loginState={alert} confirm={(val: string)=>{connection(`${val}-login`)}}/>,
    "menu": <Menu setPage={setPage} singlePlayer={singlePlayer} justLogged={justLogged} user={users.player}/>,
    "userList":  <>
      {selectedPlayer !== undefined ? 
        <ShowPlayer
          users={users}
          conn={conn}
          back={backToUserList}
          cardsOpponent={cardsOpponent}
          selectedPlayer={selectedPlayer}
          cards={cards}
          bootbattle={startMultiplayerBattle}
          alert={alert}
          retryConn={()=>{conn=undefined; activateAlert(""); connectToPeer(selectedPlayer+ "-login")}}
        />
        :
        <UserList 
          slideFromRight={slideFromRight}
          cachedUsers={cachedUsers}
          setCachedUsers={setCachedUsers}
          backToMenu={(slide:boolean)=>{backToMenu(".user-list", slide)}}
          selectUser={(user:string)=>{setPlayer(user); connectToPeer(user+ "-login")}}
        />
      }
    </>,
    "handEdit": <HandEditor backToMenu={(slide:boolean)=>{backToMenu(".hand-editor", slide)}} cardsDef={cards} setCardsDef={setCards}/>,
  }

  /// EFFECTS

  React.useEffect(()=>{
    if(page === "userList" && !selectedPlayer && cachedUsers.length === 0) {
      let search = document.querySelector(".search")?.firstChild as HTMLInputElement
      if(search) search.focus()
    } 
    if(slideFromRight === false) slideFromRight = true
  }, [page])

  React.useEffect(()=>{
    if(page === "login" && peer && users.player !== "" && peer.open)  {
      let auth = document.querySelector(".auth-screen")
      if(!auth) return 
      auth.classList.add("fade-to-left")
      
      setTimeout(()=>{
        activateAlert("")
        setPage("menu")
        justLogged = true
      },300)
    }
  })

  return <>
    <div className="loading-screen d-none">
      <FontAwesomeIcon icon={faCircleNotch} spin/>
    </div>
    {menu ?
      <main>
        {pages[page]}
      </main>
      :
      <PlayTable
        usersDef={users}
        cardsDefault={cards}
        cardsOpponentDefault={cardsOpponent}
        activateIA={activateIA}
      />}
  </>

}