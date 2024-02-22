export const fadeOutTable = (time: number,turnVelocity: number, isPlayerTurn: boolean)=>{
  let cardsInTable = document.querySelectorAll(".card-in-table")
  if(cardsInTable.length === 0) return
  for(let i=0; i<cardsInTable.length; i++) {
    let isFromPlayer = !cardsInTable[i].classList.contains("enemy")

    let card = cardsInTable[i] as HTMLDivElement

    if(!isPlayerTurn && isFromPlayer || isPlayerTurn && !isFromPlayer) card.classList.add("wait-vanish")

    setTimeout(()=>{
      card.classList.add("destroy-vanish")
    }, time*turnVelocity+1000)
    
  } 
}