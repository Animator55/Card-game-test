export const pickFromDeck = (array: Array<string[]>, current: string[])=>{
  let concatedDeck = (array.flat()).filter(el=>{return el !== "" && !current.includes(el)})
  
  let randomCard = Math.floor(Math.random() * concatedDeck.length)
  return concatedDeck[randomCard]
}