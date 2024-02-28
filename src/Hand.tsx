import React from 'react'
import { cardsD } from './assets/cardsList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition, faDragon, faFire, faShield, faShoePrints } from '@fortawesome/free-solid-svg-icons'
import { faHandFist } from '@fortawesome/free-solid-svg-icons/faHandFist'
import { userType } from './vite-env'

type Props = {
  users:{player: userType, enemy: userType}
  currentCards: string[]
  subRound: { index: number, player: string }
  fight: boolean[]
  confirm: Function
  pickCard: Function
  selectedReal: string[]
  jstAdCard: string
}
type router = {
  [key:string] : IconDefinition
}

export default function Hand({ confirm, users, currentCards, subRound, fight, selectedReal, pickCard, jstAdCard }: Props) {
  const [selected, setSelected] = React.useState<string[]>([])

  const clickCard = (card: string) => {
    if (!card) return

    if (!selected.includes(card)) {
      if (selected.length === 3) setSelected([...selected.filter(((item, i) => {
        return item && i !== 0
      })), card])
      else setSelected([...selected, card])
    }
    else setSelected(selected.filter((item => { return item !== card })))
  }

  let jsx = []

  for (let i = 0; i < currentCards.length; i++) {
    if (!currentCards[i]
      || currentCards[i] === ""
      || (selectedReal.includes(currentCards[i]) && fight[1] && subRound.player === users.enemy._id)) continue

    let selectedLocal = selectedReal.includes(currentCards[i]) || selected.includes(currentCards[i])
    let selectedIndex = selectedReal.indexOf(currentCards[i]) !== -1 ? selectedReal.indexOf(currentCards[i]) : selected.indexOf(currentCards[i])
    let className = selectedLocal ? fight[0] ? "card selected vanish" : "card selected" : "card"

    className = jstAdCard !== "" && jstAdCard === currentCards[i] ? className + " spawn-vanish" : className

    let card = currentCards[i].split(".")[0]
    const iconSelector: router = {
      "Attack": faFire,
      "Invocation": faDragon,
      "Defense":  faShield
    }
    jsx.push(
      <div
        className={className}
        onClick={() => { clickCard(currentCards[i]) }}
        key={Math.random()}
        style={{ pointerEvents: subRound.player === users.player._id ? "all" : "none", zIndex: selectedLocal ? selectedIndex+1:"0"}}
      >
        <h4>{cardsD[card].name}</h4>
        <div className='card-image' style={{ color: cardsD[card].image }}>
          <FontAwesomeIcon icon={iconSelector[cardsD[card].type]}/>
        </div>
        <div className='d-flex'>
          <div className='d-flex'>
            <h5>{cardsD[card].strength}</h5>
            <FontAwesomeIcon icon={faHandFist} />
          </div>
          <div className='d-flex'>
            <h5>{cardsD[card].defense}</h5>
            <FontAwesomeIcon icon={faShield} />
          </div>
          <div className='d-flex'>
            <h5>{cardsD[card].speed}</h5>
            <FontAwesomeIcon icon={faShoePrints} />
          </div>
        </div>
      </div>
    )
  }

  let cardsAv = currentCards.filter((el) => { return el !== "" })

  return <React.Fragment>
    {selected.length !== 0 && <button className="fixed-b-2" onClick={() => { confirm(selected); setSelected([]) }}></button>}
    {(cardsAv.length < 5 && (subRound.player === users.player._id && !fight[1])
      || (fight[1] && !fight[0] && cardsAv.length === 0))
      && <button className="deck" onClick={() => {
        if (fight[1] && !fight[0] && cardsAv.length === 0) pickCard(true)
        else pickCard(false)
      }}>Pick Card</button>}
    <div className="hand player" data-length={`${jsx.length}`} style={{gridTemplateColumns: `repeat(${jsx.length}, ${100/jsx.length}%)`}}>
      {jsx}
    </div>
  </React.Fragment>
}