import { cardsD } from "../assets/cardsList"

export const generateHand = ()=>{
    let hand = []
  
    let cards = Object.keys(cardsD)
    for(let i=0; i<3; i++) {
      let round = []
      for(let j=0; j<5; j++) {
        round.push(cards[Math.floor(Math.random() * cards.length)]+ "." + Math.floor(Math.random() * 100000))
      }
      hand.push(round)
    }
    return hand
  }
  