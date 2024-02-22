export const checkCards = (deck: string[])=>{ //checks if is necesary to change the round
  return !deck.some((card)=>{
    return card !== ""
  })
}