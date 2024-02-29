import React from "react"
import './assets/App.css'
import Hand from "./Hand"
import { cardsD } from "./assets/cardsList"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconDefinition, faDragon, faFire, faHandFist, faShield, faShoePrints } from "@fortawesome/free-solid-svg-icons"
import { calculateFight } from "./logic/calculateFight"
import { renderFight } from "./logic/renderFight"
import { fadeOutTable } from "./logic/fadeOutTable"
import { pickFromDeck } from "./logic/pickFromDeck"
import { generateRandomEnemyCards } from "./logic/generateRandCard"
import { checkCards } from "./logic/checkCards"
import { userType } from "./vite-env"
import Peer, { DataConnection } from "peerjs"


type router = {
  [key:string] : IconDefinition
}

type dataTransfer = {action: string, cards: string[] | string[][], allCards?: string[][]}

const enemyCards = [
  ["0001.66786", "0002.876", "0000.68757667", "0002.675549", "0003.65756"],
  ["0001.364786", "0001.78676878", "0003.68676876", "0001.96876879", "0000.25678643"],
  ["0002.65875678646", "0000.678678656", "0001.67868767546", "0003.786786797", "0002.4678625"]
]

let turnVelocity = 2000
let justAddedCardPlayer = ""
let justAddedCardEnemy = ""
let conn: DataConnection | undefined = undefined
let peer: Peer | undefined = undefined

const generatedTalesCards = (cards: string[][])=>{
  let newCards = []

  for(let i=0; i < cards.length; i++) {
    let stack = cards[i].map((card, i)=>{
      // return card + "."+ Math.floor(Math.random()*100000)
      return card + "."+ i
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
let cardsP2 = generatedTalesCards([
  ["0002", "0005", "0000", "0003", "0001"],
  ["0002", "0005", "0003", "0000", "0002"],
  ["0001", "0005", "0002", "0006", "0000"],
])

export default function App() {
  const [activateIA, setIA] = React.useState(false)
  const [round, setRound] = React.useState(0)
  const [subRound, setSubRound] = React.useState({index: 0, player: ""})
  const [selected, setSelected] = React.useState<string[]>([])
  const [cards, setCards] = React.useState<string[][]>([])
  const [cardsOpponent, setCardsOpponent] = React.useState<string[][]>([])

  const [selectedEnemy, setSelEnemy] = React.useState<string[]>([])
  const [fight, activateFight] = React.useState([false, false])
  const [users, setUsers] = React.useState<{player: userType, enemy: userType}>({
    player: {
      _id: "",
      life: 20
    },
    enemy: {
      _id: "",
      life: 20
    }
  })

  /// FUNCTIONS

  const enemyPicksCard = (newCard: string, allCards?: string[][])=>{
    let currentCards = activateIA ? enemyCards[round] : allCards ? allCards[round] : undefined
    if(currentCards === undefined) return
    justAddedCardEnemy = newCard

    let deleteAmount = 1

    let newCards = cardsOpponent[round].filter((card)=>{
      if(card === "") deleteAmount = 0
      else if(deleteAmount === 0 || card !== "") return card
    })

    if(!activateIA) setCardsOpponent(allCards as string[][])
    else setCardsOpponent(Object.values({...cardsOpponent, [round]: [...newCards, newCard]}) as Array<string[]>)
    activateFight([false, false])
    setSelEnemy([])
    setSubRound({index: subRound.index + 1, player: peer ? peer.id : users.player._id })
  }

  const pickCard = (direct: boolean)=>{
    let cardsAv = cards[round].filter((el)=>{return el !== ""})
    if(cardsAv.length === 5) return 

    let newCard= pickFromDeck(cards, cards[round])
    if(newCard === undefined) return
    let deleteAmount = 1

    let newCards = cards[round].filter((card)=>{
      if(card === "") deleteAmount = 0
      else if(deleteAmount === 0 || card !== "") return card
    })

    justAddedCardPlayer = newCard

    let cardsResult = Object.values({...cards, [round]: [...newCards, newCard]}) as Array<string[]>
    setCards(cardsResult)
    activateFight(direct ? [true, true] : [false, false])
    setSelected(direct ? [newCard] : [])
    if(!direct && !activateIA && conn) conn.send({action: "drawCard", cards: [newCard], allCards: cardsResult})
    setSubRound({index: subRound.index + 1, player: direct ? users.player._id : users.enemy._id })
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
      if(!peer.connect) return
      conn = peer.connect(duel)
      conn.on('close', closeConn)
      setUsers({...users, enemy: {...users.enemy, _id: duel}})
    }
    // else for (const key in chats) {
    //   if (key !== peer.id) {
    //     console.log('Trying to connect to ' + chats[key].name)
    //     conn = peer.connect(chats[key])
    //     conn.on('close', closeConn)
    //   }
    // }
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
      setUsers({...users, player: {...users.player, _id: peer.id}})
      // connectToPeer(undefined)
    })
    if (conn !== undefined) return

    peer.on("connection", function (conn: DataConnection | undefined) {
      if(!conn) return

      conn.on("data", function (data) { //RECIEVED DATA
        console.log("sended to you " + data)
        if(!peer ||!conn) return

        let Data = data as dataTransfer

        if(Data.action === "drawCard") enemyPicksCard(Data.cards[0] as string, Data.allCards as string[][])
        else {
          let playerCurrentFight = Data.action === "respond" 
          activateFight([playerCurrentFight, true])
          setSelEnemy(Data.cards as string[])
          setSubRound({index: subRound.index, player: playerCurrentFight ? conn.peer : peer.id})
        }
      })

      conn.on('close', function () {
        if(!conn) return
        console.log('connection was closed by ' + conn.peer)
        conn.close()
        conn = undefined
      })
      
    });
  }

  const sendSelected = ()=>{
    if(!peer || !conn) return

    conn.send({action: "attack", cards: selected})
    setSubRound({index: subRound.index, player: users.enemy._id})
  }

  const sendResult = (sendRespond: boolean)=>{
    if(!activateIA && (!peer || !conn)) return

    if(sendRespond && !activateIA && conn) conn.send({action: "respond", cards: selected})
    let CalculateFight = calculateFight(selected, selectedEnemy, subRound.player === users.player._id ? users.enemy._id : users.player._id, [users.player._id, users.enemy._id])
    let time = renderFight(CalculateFight, users.player, users.enemy, turnVelocity)
    fadeOutTable(time, turnVelocity, subRound.player === users.player._id)

    setTimeout(()=>{// result
      let newCards = cards[round].map((el)=>{
        return selected.includes(el) ? "": el
      })
      let newCardsOpponent = cardsOpponent[round].map((el)=>{
        return selectedEnemy.includes(el) ? "": el
      })
      let life1 = 20
      let life2 = 20
      let playerLifeEl = document.querySelector(".player-life") as HTMLElement
      let enemyLifeEl = document.querySelector(".enemy-life") as HTMLElement
      if(playerLifeEl && enemyLifeEl) {
        let bar1 = playerLifeEl.firstChild as HTMLElement
        let bar2 = enemyLifeEl.firstChild as HTMLElement
        life1 = Math.round(parseInt(bar1.style.width)/5) 
        life2 = Math.round(parseInt(bar2.style.width)/5) 
      }

      activateFight([false, false])
      setCards(Object.values({...cards, [round]: newCards}) as Array<string[]>)
      setCardsOpponent(Object.values({...cardsOpponent, [round]: newCardsOpponent}) as Array<string[]>)
      setSelected([])
      setSelEnemy([])
      setUsers({
        player: {_id: users.player._id, life: life1},
        enemy: {_id: users.enemy._id, life: life2}
      })
      setSubRound({index: subRound.index + 1, player: subRound.player })
    }, time*turnVelocity +2000)
  }

  /// IA INTERACTIONS

  const IArespond = ()=>{
    console.log("defense")
    setSubRound({index: subRound.index, player: users.enemy._id})
    setTimeout(()=>{ // defense bot
      if(cardsOpponent.length === 0) return
      activateFight([true, true])
      setSelEnemy(generateRandomEnemyCards(selectedEnemy, cardsOpponent[round], cardsOpponent))
    }, 2000)
  }

  const IAsend = ()=>{
    console.log("attack")
    setTimeout(()=>{
      let newCard = pickFromDeck(cardsOpponent, cardsOpponent[round])
      let pickCard = Math.random()>0.6 && cardsOpponent[round].filter((el)=>{return el!==""}).length < 5 && newCard !== undefined
      if(pickCard) return enemyPicksCard(newCard)
      activateFight([false, true])
      setSelEnemy(generateRandomEnemyCards(selectedEnemy, cardsOpponent[round], cardsOpponent))
      setSubRound({index: subRound.index, player: users.player._id})
    }, 1000)
  }

  /// COMPONENTS


  const RenderEnemyCards = ()=>{
    let jsx = []
    let currentCards = cardsOpponent[round]

    if(currentCards !== undefined) for(let i=0; i<currentCards.length; i++) {
      if(currentCards[i] === "" 
      || (selectedEnemy.includes(currentCards[i]) && fight[0] && subRound.player === users.player._id)) continue
       
      let className = selectedEnemy.includes(currentCards[i]) ? 
        fight[1] ? "card enemy selected vanish" : "card enemy selected" 
        : "card enemy"

      className = justAddedCardEnemy !== "" && justAddedCardEnemy === currentCards[i] ? className + " spawn-vanish" : className
      jsx.push(<div className={className} key={i+"enemyCard"}/>)
    }

    return <div className="hand enemy" data-length={`${jsx.length}`}>{jsx}</div>
  }

  const RenderTable = ()=>{
    const iconSelector: router = {
      "Attack": faFire,
      "Invocation": faDragon,
      "Defense":  faShield
    }

    return <section className="table">
      <div className="enemy-table">
        {fight[1] && selectedEnemy.length !== 0 && selectedEnemy.map(card=>{
          if(!card || card === "") return
          let card_id = card.split(".")[0]
          return <div 
            className="card card-in-table enemy spawn-vanish hide"
            id={card}
            key={card+"intable-enemy"}
            data-damage={""}
          >
            <h4>{cardsD[card_id].name}</h4>
            <div className='card-image' style={{ color: cardsD[card_id].image }}>
              <FontAwesomeIcon icon={iconSelector[cardsD[card_id].type]}/>
            </div>
            <div className='d-flex'>
              <div className='d-flex'>
                <h5>{cardsD[card_id].strength}</h5>
                <FontAwesomeIcon icon={faHandFist}/>
              </div>
              <div className='d-flex'>
                <h5 className="defense-stat" data-defense={cardsD[card_id].defense}></h5>
                <FontAwesomeIcon icon={faShield}/>
              </div>
              <div className='d-flex'>
                <h5>{cardsD[card_id].speed}</h5>
                <FontAwesomeIcon icon={faShoePrints}/>
              </div>
            </div>
          </div>
        })}
      </div>
      <div className="player-table">
        {fight[0] && selected.length !== 0 && selected.map(card=>{
          if(!card || card === "") return
          
          let card_id = card.split(".")[0]
          return <div 
            className="card card-in-table spawn-vanish hide"
            id={card}
            key={card+"intable"}
            data-damage={""}
          >
            <h4>{cardsD[card_id].name}</h4>
            <div className='card-image' style={{ color: cardsD[card_id].image }}>
              <FontAwesomeIcon icon={iconSelector[cardsD[card_id].type]}/>
            </div>
            <div className='d-flex'>
              <div className='d-flex'>
                <h5>{cardsD[card_id].strength}</h5>
                <FontAwesomeIcon icon={faHandFist}/>
              </div>
              <div className='d-flex'>
                <h5 className="defense-stat" data-defense={cardsD[card_id].defense}></h5>
                <FontAwesomeIcon icon={faShield}/>
              </div>
              <div className='d-flex'>
                <h5>{cardsD[card_id].speed}</h5>
                <FontAwesomeIcon icon={faShoePrints}/>
              </div>
            </div>
          </div>
        })}
      </div>
    </section>
  }

  const PlayerLife = ()=>{
    return <section className="player-life">
      <div className="bar" style={{width: users.player.life*5 +"%"}}></div>
    </section>
  }
  const EnemyLife = ()=>{
    return <section className="enemy-life">
      <div className="bar" style={{width: users.enemy.life*5 +"%"}}></div>
    </section>
  }

  /// EFFECTS

  React.useEffect(()=>{
    if(users.player._id === "" || users.enemy._id === "") return 
    if(subRound.player === "") setSubRound({...subRound, player: users.player._id > users.enemy._id ? users.player._id : users.enemy._id})
  }, [users])

  React.useEffect(()=>{
    if(users.player._id === "" || users.enemy._id === "") return
    if(subRound.player === "") return

    if(checkCards(cards[round]) 
      && checkCards(activateIA ? enemyCards[round] : cardsOpponent[round]) 
      && selected.length === 0 
      && selectedEnemy.length === 0
    ){
      setSubRound({index: 0, player: subRound.player})
      setRound(round + 1)
      activateFight([false, false])
    } 
  }, [subRound])

  React.useEffect(()=>{
    justAddedCardEnemy = ""
    justAddedCardPlayer = ""
    if(users.player._id === "" || users.enemy._id === "") return 

    if(activateIA) {
      if(fight[0] && !fight[1]) IArespond()
      else if(fight[0] && fight[1]) sendResult(false)
      else if(!fight[0] && !fight[1] && subRound.player !== users.player._id && subRound.player !== "") IAsend()
    }
    else if(peer && conn) {
      if(fight[0] && !fight[1]) sendSelected()
      else if(fight[0] && fight[1] && subRound.player === users.player._id) sendResult(true)
      else if(fight[0] && fight[1] && subRound.player !== users.player._id) sendResult(false)
    }
  }, [fight]) 

  React.useEffect(()=>{
    if(cards.length !== 0 && peer === undefined && !activateIA) connection(cards === cardsP1 ? "a" : "b")
  }, [cards])

  let dataTurn = "2"

  if(subRound.player === users.player._id) dataTurn = "0"
  else if(subRound.player === users.enemy._id) dataTurn = "1"

  return <main data-turn={dataTurn}>
    <EnemyLife/>
    <RenderEnemyCards/>
    <RenderTable/>
    {cards.length !== 0 && <Hand
      confirm={(sel: string[])=>{setSelected(sel); activateFight([true, fight[1]])}}
      users={users}
      subRound={subRound}
      fight={fight} 
      currentCards={cards[round]}
      selectedReal={selected}
      pickCard={pickCard}
      jstAdCard={justAddedCardPlayer}
    />}
    <div className="log-with">
      <p style={{color: "white"}}>log-with</p>
      <button onClick={()=>{
        if(activateIA) setUsers({player: {...users.player, _id: "a"}, enemy: {...users.enemy, _id: "b"}})
        setCards(cardsP1)
        setCardsOpponent(cardsP2)
      }}>a</button>
      <button onClick={()=>{
        if(activateIA) setUsers({player: {...users.player, _id: "b"}, enemy: {...users.enemy, _id: "a"}})
        setCards(cardsP2)
        setCardsOpponent(cardsP1)
      }}>b</button>
    </div>
    <div className="log-with-2">
      <p style={{color: "white"}}>connect to</p>
      <button onClick={()=>{connectToPeer("a")}}>a</button>
      <button onClick={()=>{connectToPeer("b")}}>b</button>
    </div>
    <PlayerLife/>
  </main>
}