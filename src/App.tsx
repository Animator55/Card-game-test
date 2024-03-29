import React from "react"
import './assets/App.css'
import Peer, { DataConnection } from "peerjs"
import PlayTable from "./PlayTable"
import Menu from "./components/Menu"
import Auth from "./components/Auth"
import HandEditor from "./components/HandEditor"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {  faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { UserList } from "./components/UserList"
import { ShowPlayer } from "./components/ShowPlayer"
import { generateHand } from "./logic/generateHand"

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

const defaultUsers: string[] = []

let justLogged = false
let slideFromRight = true

let defaultCards = window.localStorage.length !== 0 ? [] : cardsP1

export default function App() {
  const [alert, activateAlert] = React.useState("")
  const [activateIA, setIA] = React.useState(false)
  const [menu, bootbattle] = React.useState(true)
  const [cards, setCards] = React.useState<string[][]>(defaultCards)
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
    setIA(false)
    // peer = undefined
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
      conn = undefined
    }

    if (duel !== undefined) {
      if (!peer.connect) return
      conn = peer.connect(duel)
      conn.on('close', closeConn)
      setUsers({ ...users, enemy: duel.split("-")[0] })
    }
  }
  function connection(id: string): undefined | string { //create session
    peer = new Peer(id);
    if (peer === undefined) return

    peer.on('error', function (err) {
      switch (err.type) {
        case 'unavailable-id':
          peer = undefined
          activateAlert("The name " + id.split("-")[0] + " is taken, please insert other")
          break
        case 'peer-unavailable':
          activateAlert("User Offline")
          break
        default:
          conn = undefined
          activateAlert("A connection error happened, please retry")
      }
      return false;
    })
    peer.on('open', function () {
      if (peer === undefined || peer.id === undefined) return
      setUsers({ ...users, player: peer.id.split("-")[0] })
    })
    if (conn !== undefined) return

    peer.on("connection", function (conn: DataConnection | undefined) {
      if (!conn) return

      conn.on("data", function (data) { //RECIEVED DATA
        if (!peer || !conn) return

        let Data = data as dataTransferMenu

        if (Data.action === "fight") {
          setCardsOpponent(Data.cardsTransfered!)
          let loading = document.querySelector(".loading-screen")
          loading?.classList.remove("d-none")
          setTimeout(()=>{
            bootbattle(false)
          }, 500)
        }
        else setCardsOpponent(Data.cardsTransfered!)
        if(conn.peer && conn.peer !== "" && 
        !cachedUsers.includes(conn.peer)) setCachedUsers([...cachedUsers, conn.peer.split("-")[0]])
      })

      conn.on('close', function () {
        if (!conn) return
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
      bootbattle(true)
    }, 300);
  }

  const backToUserList = ()=>{
    setPlayer(undefined)
    slideFromRight= false
  }

  // pages
  const pages: {[key: string]: any} = {
    "login": <Auth loginState={alert} confirm={(val: string)=>{activateAlert(""); connection(`${val}-login`)}}/>,
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
          setCachedUsers={(value: string[])=>{if(value.length === 0 || value[value.length-1] !== users.player) setCachedUsers(value)}}
          backToMenu={(slide:boolean)=>{backToMenu(".user-list", slide)}}
          selectUser={(user:string)=>{setPlayer(user); connectToPeer(user+ "-login")}}
        />
      }
    </>,
    "handEdit": <HandEditor 
      backToMenu={(slide:boolean)=>{backToMenu(".hand-editor", slide)}} 
      cardsDef={cards} 
      setCardsDef={setCards}
    />,
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

      if(defaultCards.length !== 0) window.localStorage.setItem(users.player, cards.join("/"))
      if( window.localStorage.getItem(users.player) === null) return

      let gettedCards = window.localStorage.getItem(users.player)!.split("/")
      let roundedCards = gettedCards.map(el=>{
        return el.split(",")
      })
      setCards(roundedCards)
    
    }
  })

  React.useEffect(()=>{
    if(cards.length === 0) return
    window.localStorage.setItem(users.player, cards.join("/"))
  }, [cards])

  return <>
    <div className="loading-screen d-none">
      <FontAwesomeIcon icon={faCircleNotch}/>
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