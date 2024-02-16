import React from "react"
import './assets/App.css'
import Hand from "./Hand"
import { cardsD } from "./assets/cardsList"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHandFist, faShield, faShoePrints } from "@fortawesome/free-solid-svg-icons"
import { calculateFight, eventType, resultType } from "./logic/calculateFight"

const player = {
  _id: "a"
}

const enemy = {
  _id: "b"
}

const enemyCards = [
  ["0001.66786", "0002.876", "0000.68757667", "0002.675549", "0003.65756"],
  ["0001.364786", "0001.78676878", "0003.68676876", "0001.96876879", "0000.25678643"],
  ["0002.65875678646", "0000.678678656", "0001.67868767546", "0003.786786797", "0002.4678625"]
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


  // const attackToLife = (number: number)=>{
  //   console.log(number)
  // }

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

  const fadeOutTable = (time: number)=>{
    let cardsInTable = document.querySelectorAll(".card-in-table")
    let isPlayerTurn = subRound.player === player._id
    if(cardsInTable.length === 0) return
    for(let i=0; i<cardsInTable.length; i++) {
      let isFromPlayer = !cardsInTable[i].classList.contains("enemy")

      let card = cardsInTable[i] as HTMLDivElement

      let result = isPlayerTurn ? isFromPlayer ? "spawn-destroy-vanish" : "wait-vanish": isFromPlayer ? "wait-vanish" : "spawn-destroy-vanish" 

      if(result === "wait-vanish") {
        card.classList.add(result)
        setTimeout(()=>{
          card.classList.remove("wait-vanish")
          card.classList.add("destroy-vanish")
        }, time*1000)
      }
      else setTimeout(()=>{
        card.classList.remove("spawn-destroy-vanish")
        card.classList.add("destroy-vanish")
      }, time*1000)
      
    } 
  }

  const renderFight = (calculated: resultType[])=>{
    let time = 0
    let lastSpeed = 0
    let lastPlayer = calculated[0].owner
    let defeatedTargets: eventType[] = []

    const searchCard = (id: string, tale: string)=>{
      let index = 0
      for(let i=0; i<calculated.length; i++){
        if(calculated[i].card._id === id && calculated[i].tale === tale) {
          index = i
        }
      }
      return index
    }

    resultArray: for(let i=0; i<calculated.length; i++) {
      let turn = calculated[i]

      if(defeatedTargets.length !== 0) for(let j=0; j<defeatedTargets.length; j++ ) {
        let id = defeatedTargets[j].card._id
        let tale = defeatedTargets[j].tale
        if(turn.card._id === id && turn.tale === tale) {continue resultArray; break }
      }

      if(turn.owner !== lastPlayer) {
        lastPlayer =  turn.owner
        time = time+ 1
      }
      else if(turn.card.speed !== lastSpeed) {
        lastSpeed =  turn.card.speed
        time = time+ 2
      }
      let card = document.getElementById(`${turn.card._id+ "."+turn.tale}`)

      const checkAttack = ()=>{
        let result = ""
        if(!turn.action.attackTo) return result 

        if(turn.action.attackTo.length === 0) return ("attack to " + turn.owner === player._id ? enemy._id : player._id)

        let target: eventType | undefined 
        action: for(let j=0; j<turn.action.attackTo.length; j++) {
          if(defeatedTargets.includes(turn.action.attackTo[j])) continue action
          target = turn.action.attackTo[j]
          break
        }
        if(!target)  return ("attack to " + turn.owner === player._id ? enemy._id : player._id)

        let attack = turn.card.strength
        let defense = target.card.defense

        let index = searchCard(target.card._id, target.tale)

        calculated[index].card.defense = defense - attack < 0 ? 0 : defense - attack 

        if(calculated[index].card.defense === 0) defeatedTargets.push(target)
        result = calculated[index].card.name + " and dealed " + attack +". "+ (calculated[index].card.defense === 0 ? target.card.name + " died" : "")

        return result
      }
      let attackResult = checkAttack()

      setTimeout(()=>{
        if(!card) return
        card.classList.add("use")
        console.log("used: "+ turn.card.name + ", from: "+ turn.owner + ", speed: "+ turn.card.speed)
        if(turn.action.attackTo) console.log("attackTo: "+ attackResult)
      }, time*1000)
    }

    return time
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
          {/* {enemyCards[round][i]} */}
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
            id={card}
            key={Math.random()}
          >
            <h4>{cardsD[card_id].name}</h4>
            <div className='card-image' style={{background: cardsD[card_id].image}}></div>
            <div className='d-flex'>
              <div className='d-flex'>
                <h5>{cardsD[card_id].strength}</h5>
                <FontAwesomeIcon icon={faHandFist}/>
              </div>
              <div className='d-flex'>
                <h5>{cardsD[card_id].defense}</h5>
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
            className="card card-in-table spawn-vanish"
            id={card}
            key={Math.random()}
          >
            <h4>{cardsD[card_id].name}</h4>
            <div className='card-image' style={{background: cardsD[card_id].image}}></div>
            <div className='d-flex'>
              <div className='d-flex'>
                <h5>{cardsD[card_id].strength}</h5>
                <FontAwesomeIcon icon={faHandFist}/>
              </div>
              <div className='d-flex'>
                <h5>{cardsD[card_id].defense}</h5>
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
      let CalculateFight = calculateFight(selected, selectedEnemy, subRound.player === player._id ? enemy._id : player._id, [player._id, enemy._id])
      let time = renderFight(CalculateFight)
      fadeOutTable(time)
      
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
      }, time*1000 +1000)
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