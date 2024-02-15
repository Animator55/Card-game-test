import React from 'react'
import { cardsD } from './assets/cardsList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShield, faShoePrints } from '@fortawesome/free-solid-svg-icons'
import { faHandFist } from '@fortawesome/free-solid-svg-icons/faHandFist'

type Props = {
    player: {_id: string}
    enemy: {_id: string} 
    currentCards: string[] 
    subRound: {index: number, player: string}
    fight: boolean[]
    confirm: Function
    pickCard: Function
    selectedReal: string[]
}

export default function Hand({confirm, player, enemy, currentCards, subRound, fight, selectedReal, pickCard}: Props) {
    const [selected, setSelected] = React.useState<string[]>([])

    const clickCard = (card: string)=>{
        if(!card) return
        
        if(!selected.includes(card)) {
          if(selected.length === 3) setSelected([...selected.filter(((item, i)=>{
            return item && i !== 0
          })), card])
          else setSelected([...selected, card])
        }
        else setSelected(selected.filter((item=>{return item !== card})))
    }

    let jsx = []

    for(let i=0; i<currentCards.length; i++) {
      if(!currentCards[i] 
        || currentCards[i] === "" 
        || (selectedReal.includes(currentCards[i]) && fight[1] && subRound.player === enemy._id)) continue
      
      let className = selectedReal.includes(currentCards[i]) || selected.includes(currentCards[i]) ? fight[0] ? "card selected vanish" : "card selected" : "card"

      let card = currentCards[i].split(".")[0]
      jsx.push(
        <div 
          className={className}
          onClick={()=>{clickCard(currentCards[i])}}
          key={Math.random()}
          style={{pointerEvents: subRound.player === player._id ? "all" : "none"}}
        >
          <h4>{cardsD[card].name}</h4>
          <div className='card-image' style={{background: cardsD[card].image}}></div>
          <div className='d-flex'>
            <div className='d-flex'>
              <h5>{cardsD[card].strength}</h5>
              <FontAwesomeIcon icon={faHandFist}/>
            </div>
            <div className='d-flex'>
              <h5>{cardsD[card].defense}</h5>
              <FontAwesomeIcon icon={faShield}/>
            </div>
            <div className='d-flex'>
              <h5>{cardsD[card].speed}</h5>
              <FontAwesomeIcon icon={faShoePrints}/>
            </div>
          </div>
        </div>
      )
    }

    let cardsAv = currentCards.filter((el)=>{return el !== ""})
  
    return <div className="hand player">
        <button className="fixed-b-2" onClick={()=>{confirm(selected);setSelected([])}}>Fight</button>
        {(cardsAv.length < 5 && (subRound.player === player._id && !fight[1]) 
        || (fight[1] && !fight[0] && cardsAv.length === 0))
        && <button className="deck" onClick={()=>{
            if(fight[1] && !fight[0] && cardsAv.length === 0)pickCard(true)
            else pickCard(false)
          }}>Pick Card</button>}
        {jsx}
    </div>
}