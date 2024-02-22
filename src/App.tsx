import React from "react"
import './assets/App.css'
import Hand from "./Hand"
import { cardsD } from "./assets/cardsList"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHandFist, faShield, faShoePrints } from "@fortawesome/free-solid-svg-icons"
import { calculateFight } from "./logic/calculateFight"
import { renderFight } from "./logic/renderFight"
import { fadeOutTable } from "./logic/fadeOutTable"
import { pickFromDeck } from "./logic/pickFromDeck"
import { generateRandomEnemyCards } from "./logic/generateRandCard"
import { checkCards } from "./logic/checkCards"

const player = {_id: "a"}
const enemy = {_id: "b"}

const enemyCards = [
  ["0001.66786", "0002.876", "0000.68757667", "0002.675549", "0003.65756"],
  ["0001.364786", "0001.78676878", "0003.68676876", "0001.96876879", "0000.25678643"],
  ["0002.65875678646", "0000.678678656", "0001.67868767546", "0003.786786797", "0002.4678625"]
]

let turnVelocity = 2000

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
  const [lifes, setLifes] = React.useState({
    player: 100,
    enemy: 100
  })

  /// FUNCTIONS

  const enemyPicksCard = (newCard: string)=>{
    enemyCards[round].push(newCard)
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

  /// IA INTERACTIONS

  const IArespond = ()=>{
    setSubRound({index: subRound.index, player: enemy._id})
    setTimeout(()=>{ // defense bot
      activateFight([true, true])
      setSelEnemy(generateRandomEnemyCards(selectedEnemy, enemyCards[round], enemyCards))
    }, 2000)
  }

  const IAsend = ()=>{
    setTimeout(()=>{
      let newCard = pickFromDeck(enemyCards, enemyCards[round])
      let pickCard = Math.random()>0.6 && enemyCards[round].filter((el)=>{return el!==""}).length < 5 && newCard !== undefined
      if(pickCard) return enemyPicksCard(newCard)
      activateFight([false, true])
      setSelEnemy(generateRandomEnemyCards(selectedEnemy, enemyCards[round], enemyCards))
      setSubRound({index: subRound.index, player: player._id})
    }, 1000)
  }

  const IAresult = ()=>{
    let CalculateFight = calculateFight(selected, selectedEnemy, subRound.player === player._id ? enemy._id : player._id, [player._id, enemy._id])
    let time = renderFight(CalculateFight, player, enemy, turnVelocity)
    fadeOutTable(time, turnVelocity, subRound.player === player._id)
    
    setTimeout(()=>{// result
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
    }, time*turnVelocity +2000)
  }

  /// COMPONENTS


  const RenderEnemyCards = ()=>{
    let jsx = []

    for(let i=0; i<enemyCards[round].length; i++) {
      if(enemyCards[round][i] === "" 
      || (selectedEnemy.includes(enemyCards[round][i]) && fight[0] && subRound.player === player._id)) continue
       
      let className = selectedEnemy.includes(enemyCards[round][i]) ? 
        fight[1] ? "card enemy selected vanish" : "card enemy selected" 
        : "card enemy"

      jsx.push(<div className={className} key={i+"enemyCard"}/>)
    }

    return <div className="hand enemy" data-length={`${jsx.length}`}>{jsx}</div>
  }

  const RenderTable = ()=>{
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
            <div className='card-image' style={{background: cardsD[card_id].image}}></div>
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
            <div className='card-image' style={{background: cardsD[card_id].image}}></div>
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

  /// EFFECTS

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
    if(fight[0] && !fight[1]) IArespond()
    else if(fight[0] && fight[1]) IAresult()
    else if(!fight[0] && !fight[1] && subRound.player !== player._id && subRound.player !== "") IAsend()
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
  </main>
}