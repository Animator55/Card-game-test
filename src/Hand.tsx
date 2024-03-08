import React from 'react'
import { userType } from './vite-env'
import { Card } from './components/Card'

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

    let style = { pointerEvents: subRound.player === users.player._id ? "all" : "none", zIndex: selectedLocal ? selectedIndex+1:"0"}
    const click = () => { clickCard(currentCards[i]) }
  
    jsx.push(
      <Card
        key={Math.random()}
        card={card}
        className={className}
        clickCard={click}
        style={style}
      />
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