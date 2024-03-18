import { cardType, cardsD } from "../assets/cardsList"

export type eventType = {
    card: cardType
    tale: string
    owner: string
}

export type resultType = {
    card: cardType
    tale: string
    owner: string
    action: {
        attackTo?: eventType[] //enemyCard or enemy
        defense?: number
        support?: number
    }
}
export const calculateFight = (selected: string[], selectedEnemy: string[], turn: string, players: string[])=>{
    let result: resultType[] = []

    let playerCards: eventType[] = selected.map(item=>{
        return {card: cardsD[item.split(".")[0]], tale: item.split(".")[1], owner: players[0]}
    })
    let enemyCards: eventType[] = selectedEnemy.map(item=>{
        return {card: cardsD[item.split(".")[0]], tale: item.split(".")[1], owner: players[1]}
    })

    let concat:eventType[] = [...playerCards, ...enemyCards]

    let cardsOrder : eventType[] = concat.sort((a, b)=>{
        if (a.card.speed < b.card.speed) return 1
        else if (a.card.speed > b.card.speed) return -1
        if (a.card.speed === b.card.speed) {
            if (turn === a.owner) return -1
            else return 1
        }
        return 0;
    })

    const order = (array: eventType[])=>{
        array.sort((a, b)=>{
            if (a.card.speed < b.card.speed) return 1
            else if (a.card.speed > b.card.speed) return -1
            return 0;
        })

        return array
        // array.map(el=>{
        //     for(let i=0; i<selectedEnemy.length; i++) {
        //         if(selectedEnemy[i].split(".")[0] === el._id) return selectedEnemy
        //     }
        // })
    }

    ///cards that player can Attack
    const getDefenseCards = (array: eventType[])=>{
        let firstDefenseCard = []
    
        for(let i=0; i<array.length; i++){
            if(array[i].card.type === "Defense"
            || 
            array[i].card.type === "Invocation") firstDefenseCard.push(array[i])
        }
        return firstDefenseCard
    }

    const filterSpeed = (attackCard: eventType, cards: eventType[])=>{
        return cards.filter(el=>{
            if(el.card.speed >= attackCard.card.speed) return el
        })
    }

    let playerAttackTo = order(getDefenseCards(enemyCards))
    let enemyAttackTo = order(getDefenseCards(playerCards))

    for(let i=0; i > -1; i++){
        let action = {}
        if(cardsOrder.length === i) break

        if(cardsOrder[i].card.type === "Attack" || cardsOrder[i].card.type === "Invocation") {
            action = {...action, 
                attackTo: cardsOrder[i].owner === players[0] ? 
                    filterSpeed(cardsOrder[i], playerAttackTo) : filterSpeed(cardsOrder[i], enemyAttackTo)
            }
        }
        if(cardsOrder[i].card.type === "Defense" || cardsOrder[i].card.type === "Invocation") {
            action = {...action, defense: cardsOrder[i].card.defense}
        }
        if(cardsOrder[i].card.type === "Support") {
            action = {...action, support: cardsOrder[i].card.strength}
        }

        let event = {
            ...cardsOrder[i],
            action: action
        }
        result.push(event)
    }

    return result
}