import { eventType, resultType } from "./calculateFight"


type attackResult = {
    result: string
    damageTo?: {_id: string, dealed: number, defense: number}
    attackToLife?: {_id: string, number: number}
}


export const renderFight = (calculated: resultType[], player:{_id: string}, enemy:{_id: string}, turnVelocity:number)=>{
  let time = 0
  let defeatedTargets: eventType[] = []

  const searchCard = (id: string, tale: string)=>{
    let index = 0
    for(let i=0; i<calculated.length; i++){
      if(calculated[i].card._id === id && calculated[i].tale === tale) {
        index = i
      }
    }
    return index
  }

  const checkIfDefeated = (_id: string, _tale: string)=>{
    if(defeatedTargets.length === 0) return false
    for(let j=0; j<defeatedTargets.length; j++ ) {
      let id = defeatedTargets[j].card._id
      let tale = defeatedTargets[j].tale
      if(_id === id && _tale === tale) return true
    }
    return false
  }

  resultArray: for(let i=0; i<calculated.length; i++) {
    let turn = calculated[i]

    if(defeatedTargets.length !== 0) for(let j=0; j<defeatedTargets.length; j++ ) {
      let id = defeatedTargets[j].card._id
      let tale = defeatedTargets[j].tale
      if(turn.card._id === id && turn.tale === tale) {continue resultArray; break }
    }
    time = time + 1
    let card = document.getElementById(`${turn.card._id+ "."+turn.tale}`)

    const checkAttack = () : attackResult=>{
      let result: attackResult = {result: ""}
      if(!turn.action.attackTo) return result 

      if(turn.action.attackTo.length === 0) return {result: ("attack to " + turn.owner === player._id ? enemy._id : player._id), attackToLife: {
        _id: turn.owner === player._id ? enemy._id : player._id,
        number: turn.card.strength
      }}

      let target: eventType | undefined 
      action: for(let j=0; j<turn.action.attackTo.length; j++) {
        if(defeatedTargets.includes(turn.action.attackTo[j])) continue action
        target = turn.action.attackTo[j]
        break
      }
      if(!target)  return {result:("attack to " + turn.owner === player._id ? enemy._id : player._id), attackToLife: {
        _id: turn.owner === player._id ? enemy._id : player._id,
        number: turn.card.strength
      }}

      let attack = turn.card.strength
      let defense = target.card.defense

      let currentTarget = document.getElementById(`${target.card._id + "." + target.tale}`)
      if(currentTarget) {
        let defenseEl = currentTarget.querySelector('.defense-stat') as HTMLElement
        if(defenseEl && defenseEl.dataset.defense !== "") {
          defense = Number(defenseEl.dataset.defense)
        }
      }

      let index = searchCard(target.card._id, target.tale)

      if(defense - attack <= 0) defeatedTargets.push(target)
      let subresult = calculated[index].card.name + " and dealed " + attack +". "+ (defense - attack <= 0 ? target.card.name + " died" : "")
      let damageTo = {_id: calculated[index].card._id +"." + calculated[index].tale, dealed: attack, defense: defense}

      return {result:subresult, damageTo: damageTo}
    }
    let attackResult = checkAttack()

    setTimeout(()=>{
      if(!card) return
      card.offsetWidth
      card.classList.remove("hide")
      card.offsetWidth
      card.classList.add("flip")
      let defenseElfromCard = card.querySelector('.defense-stat') as HTMLElement
      if(Number(defenseElfromCard.dataset.defense) <= 0 && turn.card.defense !== 0) return
      setTimeout(()=>{
        if(!card) return
        card.offsetWidth
        card.classList.add("use")
        if(turn.action.attackTo && attackResult.attackToLife) {
          let playerDOM = document.querySelector("main")
          if(!playerDOM) return
          playerDOM.classList.remove('get-hit')
          playerDOM.classList.remove('get-hit-enemy')
          playerDOM.offsetWidth
          if(attackResult.attackToLife._id === player._id) {
            playerDOM.classList.add('get-hit')
          }
          else {
            playerDOM.classList.add('get-hit-enemy')
          }
          playerDOM.offsetWidth
        }
        else if(turn.action.attackTo && attackResult.damageTo) {
          let enemyTarget = document.getElementById(attackResult.damageTo._id)
          if(!enemyTarget) return
          enemyTarget.dataset.damage = ""
          enemyTarget.offsetWidth
          enemyTarget.dataset.damage = `${attackResult.damageTo.dealed}`
          let defenseEl = enemyTarget.querySelector('.defense-stat') as HTMLElement
          if(defenseEl) defenseEl.dataset.defense = `${Number(defenseEl.dataset.defense) - attackResult.damageTo.dealed}`
          enemyTarget.classList.remove('defeated')
          enemyTarget.classList.remove('get-hit')

          let splitedID = attackResult.damageTo._id.split(".")

          enemyTarget.classList.remove("hide")
          enemyTarget.offsetWidth
          enemyTarget.classList.add("flip")
          setTimeout(()=>{
            if(!enemyTarget) return
            if(checkIfDefeated(splitedID[0], splitedID[1]) || Number(defenseEl.dataset.defense) <= 0) {
              enemyTarget.offsetWidth
              enemyTarget.classList.add('get-hit')
              enemyTarget.classList.add('defeated')
            }
            else {
              enemyTarget.offsetWidth
              enemyTarget.classList.add('get-hit')
            }
          }, 250)
        }
      }, 300)
    }, time*turnVelocity)
  }

  return time
}