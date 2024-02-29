export const checkCards = (deck: string[])=>{ //checks if is necesary to change the round
  if(!deck) return false
  return !deck.some((card)=>{
    return card !== ""
  })
}