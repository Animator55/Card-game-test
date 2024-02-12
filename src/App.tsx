import React from "react"
import './assets/App.css'

type cardsList = {
  [key:string]: {
    _id: string
    name: string
    image: string
  }
}

const cardsD: cardsList = {
  "0000": {
    _id: "0000",
    name: "Card",
    image: "",
  },
  "0001":{
    _id: "0001",
    name: "Card",
    image: "",
  },
  "0002":{
    _id: "0001",
    name: "Card",
    image: "",
  },
  "0003":{
    _id: "0003",
    name: "Card",
    image: "",
  },
  "0004":{
    _id: "0004",
    name: "Card",
    image: "",
  },
}

const player = {
  _id: "a"
}

const enemy = {
  _id: "b"
}

const enemyCards = [
  ["0001.6786", "0002.6876", "0000.68767", "0002.6549", "0003.6546"],
  ["0001.3646", "0001.78678", "0003.6876", "0001.9879", "0000.2543"],
  ["0002.658746", "0000.67856", "0001.678546", "0003.7897", "0002.425"]
]

export default function App() {
  const [round, setRound] = React.useState(0)
  const [subRound, setSubRound] = React.useState({index: 0, player: ""})
  const [selected, setSelected] = React.useState<string[]>([])
  const [cards, setCards] = React.useState([
    "0001.6786", "0002.6876", "0000.68767", "0002.6549", "0003.6546",
    "0001.3646", "0001.78678", "0003.6876", "0001.9879", "0000.2543",
    "0002.658746", "0000.67856", "0001.678546", "0003.7897", "0002.425",
  ])

  const [fight, activateFight] = React.useState([false, false])

  const clickCard = (card: string)=>{
    if(!card) return
    setSelected([...selected, card])
  }

  const generateRandomEnemyCards = ()=>{
    if(!fight[1]) return [] 
    let randomCards:string[] = [];
    if(enemyCards[round].some((el)=>{return el === ","})) {console.log(","); return []}
    let cardsAv = enemyCards[round].filter((el)=>{return el !== ""})
    if(cardsAv.length === 0) return []
    let randomAmount = Math.floor(Math.random() * cardsAv.length) + 1

    for (let i = 0; i < randomAmount; i++) {
      let index = Math.floor(Math.random() * randomAmount);
      if(randomCards.includes(cardsAv[index])) {
        i--
        continue
      }
      randomCards.push(cardsAv[index]);
      enemyCards[round].splice(enemyCards[round].indexOf(cardsAv[index]), 1, ",")
    }
    return randomCards;
  }

  const enemyCardsGenerated = generateRandomEnemyCards()

  const RenderEnemyCards = ()=>{
    let jsx = []

    for(let i=0; i<5; i++) {
      if(enemyCards[round][i] === "" || enemyCards[round][i] === ",") continue
      
      jsx.push(
        <div 
          className="card enemy"
          key={Math.random()}
        >
        </div>
      )
    }

    return <div className="hand enemy">{jsx}</div>
  }

  const RenderCards = ()=>{
    let jsx = []

    for(let i=round*5; i<round*5+5; i++) {
      if(cards[i] === "" || selected.includes(cards[i])) continue
      
      let card = cards[i].split(".")[0]
      jsx.push(
        <div 
          className="card"
          onClick={()=>{clickCard(cards[i])}}
          key={Math.random()}
          style={{pointerEvents: subRound.player === player._id ? "all" : "none"}}
        >
          {cardsD[card].name + " " + card}
        </div>
      )
    }

    return <div className="hand">{jsx}</div>
  }

  const RenderTable = ()=>{
    return <section className="table">
      <div className="enemy-table">
        {fight[1] && enemyCardsGenerated.map(card=>{
          let card_id = card.split(".")[0]
          return <div 
            className="card card-in-table enemy"
            key={Math.random()}
          >
            {cardsD[card_id].name + " " + card_id}
          </div>
        })}
      </div>
      <div className="player-table">
        {selected.length !== 0 && selected.map(card=>{
          let card_id = card.split(".")[0]
          return <div 
            className="card card-in-table"
            key={Math.random()}
          >
            {cardsD[card_id].name + " " + card_id}
          </div>
        })}
      </div>
    </section>
  }

  React.useEffect(()=>{
    if(fight[0] && !fight[1]) setTimeout(()=>{
      console.log("confirm battle ia")
      activateFight([true, true])
      setSubRound({index: subRound.index, player: enemy._id})
    }, 1000)

    else if(fight[0] && fight[1]) setTimeout(()=>{
      console.log("final fight")
      let newCards = cards.map((el)=>{
        return selected.includes(el) ? "": el
      })
      for (let i = 0; i < 4; i++) {
        if(enemyCards[round][i] === ",") enemyCards[round].splice(i, 1, "")
      }
      activateFight([false, false])
      setCards(newCards)
      setSelected([])
      setSubRound({index: subRound.index + 1, player: subRound.player })
    }, 1000)
    
    else if(!fight[0] && !fight[1] && subRound.player !== player._id && subRound.player !== "") setTimeout(()=>{
      console.log("boot battle ia")
      activateFight([false, true])
      setSubRound({index: subRound.index, player: player._id})
    }, 1000)
  }, [fight])

  React.useEffect(()=>{
    if(subRound.player === "") setSubRound({...subRound, player: player._id})
    // if(subRound.player !== player._id) setTimeout(()=>{
    // }, 1000)
  }, [subRound])


  return <main>
    <RenderEnemyCards/>
    <RenderTable/>
    <RenderCards />
    <button className="fixed-b" onClick={()=>{setRound(round + 1)}}>Round</button>
    <button className="fixed-b-2" onClick={()=>{activateFight([true, fight[1]])}}>Fight</button>
    <button className="fixed-b-2" style={{left: "10rem"}}>Turn {subRound.player}</button>
  </main>
}