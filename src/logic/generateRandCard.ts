import { pickFromDeck } from "./pickFromDeck"

export const generateRandomEnemyCards = (current: string[], array: string[], enemyCards: string[][])=>{
  if(current.length !== 0) return current 
  let cardsAv = array.filter((el)=>{return el !== ""})
  if(cardsAv.length === 0) {
    let newCard = pickFromDeck(enemyCards, array)
    return newCard !== undefined ? [newCard] : []
  }
  let randomAmount = Math.floor(Math.random() * 3) +1
  if(randomAmount> cardsAv.length) randomAmount = cardsAv.length

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
