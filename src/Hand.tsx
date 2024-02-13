import React from 'react'
import { cardsD } from './assets/cardsList'

type Props = {
    player: {_id: string}
    enemy: {_id: string} 
    currentCards: string[] 
    subRound: {index: number, player: string}
    fight: boolean[]
    confirm: Function
    selectedReal: string[]
}

export default function Hand({confirm, player, enemy, currentCards, subRound, fight, selectedReal}: Props) {
    const [selected, setSelected] = React.useState<string[]>([])

    
    const clickCard = (card: string)=>{
        if(!card) return

        if(!selected.includes(card)) setSelected([...selected, card])
        else setSelected(selected.filter((item=>{return item !== card})))
    }

    let jsx = []

    for(let i=0; i<5; i++) {
      if(currentCards[i] === "" || (selectedReal.includes(currentCards[i]) && fight[1] && subRound.player === enemy._id)) continue
      
      let className = selectedReal.includes(currentCards[i]) || selected.includes(currentCards[i]) ? fight[0] ? "card selected vanish" : "card selected" : "card"
  
      let card = currentCards[i].split(".")[0]
      jsx.push(
        <div 
          className={className}
          onClick={()=>{clickCard(currentCards[i])}}
          key={Math.random()}
          style={{pointerEvents: subRound.player === player._id ? "all" : "none"}}
        >
          {cardsD[card].name + " " + card}
        </div>
      )
    }
  
    return <div className="hand player">
        <button className="fixed-b-2" onClick={()=>{confirm(selected);setSelected([])}}>Fight</button>
        {jsx}
    </div>
}