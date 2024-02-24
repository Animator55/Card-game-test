import { userType } from "../vite-env"
import { eventType, resultType } from "./calculateFight"


type attackResult = {
    damageTo?: {_id: string, dealed: number, defense: number, otherTargets: eventType[]}
    attackToLife?: {_id: string, number: number}
}


export const renderFight = (calculated: resultType[], player:userType, enemy:userType, turnVelocity:number)=>{
  let time = 0
  let defeatedTargets: eventType[] = []

  let playerLife = player.life
  let enemyLife = enemy.life

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
      let result: attackResult = {}
      if(!turn.action.attackTo) return result 

      if(turn.action.attackTo.length === 0) return {attackToLife: {
        _id: turn.owner === player._id ? enemy._id : player._id,
        number: turn.card.strength
      }}

      let target: eventType | undefined 
      let otherTargets: eventType[] = []

      action: for(let j=0; j<turn.action.attackTo.length; j++) {
        if(checkIfDefeated(turn.action.attackTo[j].card._id, turn.action.attackTo[j].tale)) continue action
        if(target === undefined) target = turn.action.attackTo[j]
        else otherTargets.push(turn.action.attackTo[j])
      }
      if(!target)  return {attackToLife: {
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
      let damageTo = {
        _id: calculated[index].card._id +"." + calculated[index].tale, 
        dealed: attack, 
        defense: defense,
        otherTargets: otherTargets
      }

      return {damageTo: damageTo}
    }
    let attackResult = checkAttack()

    const attackLife = (attackResult: attackResult)=>{
      if(!attackResult.attackToLife) return
      let playerDOM = document.querySelector("main")
      if(!playerDOM) return
      playerDOM.classList.remove('get-hit')
      playerDOM.classList.remove('get-hit-enemy')
      playerDOM.offsetWidth
      // to player
      if(attackResult.attackToLife._id === player._id) {
        playerDOM.classList.add('get-hit')
        let bar = playerDOM.lastChild?.firstChild as HTMLElement
        if(!bar) return
        playerLife = playerLife - attackResult.attackToLife.number
        bar.style.width = `${playerLife*5}%`
      }
      // to enemy
      else {
        playerDOM.classList.add('get-hit-enemy')
        let bar = playerDOM.firstChild?.firstChild as HTMLElement
        if(!bar) return
        enemyLife = enemyLife - attackResult.attackToLife.number
        bar.style.width = `${enemyLife*5}%`
      }
      playerDOM.offsetWidth
    }

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

        // check if attack direct to player or enemy
        if(turn.action.attackTo && attackResult.attackToLife) attackLife(attackResult)
        //check if the card is offensive
        else if(turn.action.attackTo && attackResult.damageTo) {
          let enemyTarget = document.getElementById(attackResult.damageTo._id)
          if(!enemyTarget) return
          let defenseEl = enemyTarget.querySelector('.defense-stat') as HTMLElement
          if(!defenseEl) return 

          // check if card already died
          if(Number(defenseEl.dataset.defense) <= 0) {
            //attack to user
            let attackToLife = {_id: turn.owner === player._id ? enemy._id : player._id, number: attackResult.damageTo.dealed}
            let targets = attackResult.damageTo.otherTargets
            let toLife = true
            if(targets.length === 0) attackLife({attackToLife})
            //attack to nextCard
            else other: for(let index = 0; index < targets.length; index++) {
              let targ = document.getElementById(attackResult.damageTo._id) as HTMLElement
              let defEl = targ.querySelector('.defense-stat') as HTMLElement

              if(Number(defEl.dataset.defense) <= 0) continue other
              enemyTarget = targ
              defenseEl = defEl
              toLife = false
            }
            
            if(toLife) return attackLife({attackToLife})
          }
          defenseEl.dataset.defense = `${Number(defenseEl.dataset.defense) - attackResult.damageTo.dealed}`
          enemyTarget.dataset.damage = ""
          enemyTarget.offsetWidth
          enemyTarget.dataset.damage = `${attackResult.damageTo.dealed}`

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