import React from "react"
import './assets/App.css'
import Hand from "./Hand"
import { cardsD } from "./assets/cardsList"

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

const checkCards = (deck: string[])=>{
  return !deck.some((card)=>{
    return card !== ""
  })
}

const pickFromDeck = (array: Array<string[]>, current: string[])=>{
  let concatedDeck = (array.flat()).filter(el=>{return el !== "" && !current.includes(el)})
  
  let randomCard = Math.floor(Math.random() * concatedDeck.length)
  return concatedDeck[randomCard]
}

const generateRandomEnemyCards = (current: string[], array: string[])=>{
  if(current.length !== 0) return current 
  let cardsAv = array.filter((el)=>{return el !== ""})
  if(cardsAv.length === 0) {
    let newCard = pickFromDeck(enemyCards, array)
    return newCard !== undefined ? [newCard] : []
  }
  let randomAmount = Math.floor(Math.random() * 3) +1

  let result:string[] = []
  for (let i = 0; i < randomAmount; i++) {
    let index = Math.floor(Math.random() * cardsAv.length);
    if(result.includes(cardsAv[index])) {
      i--
      continue
    }
    result = [...result, cardsAv[index]]
  }
  return result
}

export default function App() {
  const [round, setRound] = React.useState(0)
  const [subRound, setSubRound] = React.useState({index: 0, player: ""})
  const [selected, setSelected] = React.useState<string[]>([])
  const [cards, setCards] = React.useState([
    ["0001.6786", "0002.6876", "0000.68767", "0002.6549", "0003.6546"],
    ["0001.3646", "0001.78678", "0003.6876", "0001.9879", "0000.2543"],
    ["0002.658746", "0000.67856", "0001.678546", "0003.7897", "0002.425"],
  ])

  const [selectedEnemy, setSelEnemy] = React.useState<string[]>([])
  const [fight, activateFight] = React.useState([false, false])


  const enemyPicksCard = (newCard: string)=>{
    enemyCards[round].push(newCard)
    console.log(newCard, enemyCards[round])

    activateFight([false, false])
    setSelEnemy([])
    setSubRound({index: subRound.index + 1, player: player._id })
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

    setCards(Object.values({...cards, [round]: [...newCards, newCard]}) as Array<string[]>)
    activateFight(direct ? [true, true] : [false, false])
    setSelected(direct ? [newCard] : [])
    setSubRound({index: subRound.index + 1, player: direct ? player._id : enemy._id })
  }

  const fadeOutTable = ()=>{
    let cardsInTable = document.querySelectorAll(".card-in-table")
    let isPlayerTurn = subRound.player === player._id
    if(cardsInTable.length === 0) return
    for(let i=0; i<cardsInTable.length; i++) {
      let isFromPlayer = !cardsInTable[i].classList.contains("enemy")
      
      cardsInTable[i].classList.add(
        isPlayerTurn ? isFromPlayer ? "spawn-destroy-vanish" : "destroy-vanish": isFromPlayer ? "destroy-vanish" : "spawn-destroy-vanish" 
      )
    } 
  }

  const RenderEnemyCards = ()=>{
    let jsx = []

    for(let i=0; i<enemyCards[round].length; i++) {
      if(enemyCards[round][i] === "" 
      || (selectedEnemy.includes(enemyCards[round][i]) && fight[0] && subRound.player === player._id)) continue
       
      let className = selectedEnemy.includes(enemyCards[round][i]) ? fight[1] ? "card enemy selected vanish" : "card enemy selected" : "card enemy"

      jsx.push(
        <div 
          className={className}
          key={Math.random()}
        >
          {enemyCards[round][i]}
        </div>
      )
    }

    return <div className="hand enemy">{jsx}</div>
  }

  const RenderTable = ()=>{
    return <section className="table">
      <div className="enemy-table">
        {fight[1] && selectedEnemy.length !== 0 && selectedEnemy.map(card=>{
          if(!card || card === "") return
          let card_id = card.split(".")[0]
          return <div 
            className="card card-in-table enemy spawn-vanish"
            key={Math.random()}
          >
            {cardsD[card_id].name + " " + card_id}
          </div>
        })}
      </div>
      <div className="player-table">
        {fight[0] && selected.length !== 0 && selected.map(card=>{
          if(!card || card === "") return
          let card_id = card.split(".")[0]
          return <div 
            className="card card-in-table spawn-vanish"
            key={Math.random()}
          >
            {cardsD[card_id].name + " " + card_id}
          </div>
        })}
      </div>
    </section>
  }

  React.useEffect(()=>{
    if(subRound.player === "") setSubRound({...subRound, player: player._id})
    if(checkCards(cards[round]) 
      && checkCards(enemyCards[round]) 
      && selected.length === 0 
      && selectedEnemy.length === 0
    ){
      setSubRound({index: 0, player: subRound.player})
      setRound(round + 1)
      activateFight([false, false])
    } 
  }, [subRound])

  React.useEffect(()=>{
    if(fight[0] && !fight[1]) {
      setSubRound({index: subRound.index, player: enemy._id})
      setTimeout(()=>{ // defense bot
        console.log("confirm battle ia")
        activateFight([true, true])
        setSelEnemy(generateRandomEnemyCards(selectedEnemy, enemyCards[round]))
      }, 2000)
    }

    else if(fight[0] && fight[1]) {
      fadeOutTable()

      setTimeout(()=>{// result
        console.log("final fight")
        let newCards = cards[round].map((el)=>{
          return selected.includes(el) ? "": el
        })
        for (let i = 0; i < enemyCards[round].length; i++) {
          if(selectedEnemy.includes(enemyCards[round][i])) enemyCards[round].splice(i, 1, "")
        }
        activateFight([false, false])
        setCards(Object.values({...cards, [round]: newCards}) as Array<string[]>)
        setSelected([])
        setSelEnemy([])
        setSubRound({index: subRound.index + 1, player: subRound.player })
      }, 2500)
    }

    // attack bot
    else if(!fight[0] && !fight[1] && subRound.player !== player._id && subRound.player !== "") setTimeout(()=>{
      console.log("boot battle ia")
      let newCard = pickFromDeck(enemyCards, enemyCards[round])
      let pickCard = Math.random()>0.6 && enemyCards[round].filter((el)=>{return el!==""}).length < 5 && newCard !== undefined
      if(pickCard) return enemyPicksCard(newCard)
      activateFight([false, true])
      setSelEnemy(generateRandomEnemyCards(selectedEnemy, enemyCards[round]))
      setSubRound({index: subRound.index, player: player._id})
    }, 1000)
  }, [fight]) 

  return <main data-turn={subRound.player === player._id ? "0" : "1"}>
    <RenderEnemyCards/>
    <RenderTable/>
    <Hand
      confirm={(sel: string[])=>{setSelected(sel); activateFight([true, fight[1]])}}
      player={player}
      enemy={enemy}
      subRound={subRound}
      fight={fight} 
      currentCards={cards[round]}
      selectedReal={selected}
      pickCard={pickCard}
    />
    <button className="fixed-b" onClick={()=>{setRound(round + 1)}}>Round</button>
    <button className="fixed-b-2" style={{left: "8rem"}}>Turn {subRound.player}</button>
  </main>
}