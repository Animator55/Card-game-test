import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { cardsD } from "../assets/cardsList"
import { Card } from "./Card"

type Props = {
    setPage: Function
    cardsDef: string[][]
    setCardsDef: Function
}

export default function HandEditor ({setPage, cardsDef, setCardsDef}: Props) {
    const [cards, setCards] = React.useState(cardsDef)
    const [selected, setSelected]= React.useState<{round: number, _id: string} | undefined>()

    
    const CardsList = () => {
        return selected && <section style={{display: "flex", flexWrap: "wrap"}}>
        {Object.values(cardsD).map((card) => {
            return <Card
            card={card._id}
            key={Math.random()}
            className={"card"}
            clickCard={() => { 
                let newRound = cards[selected.round].map(el=>{
                    if(el === selected._id) return card._id +"." + Math.floor(Math.random() * 100000)
                    else return el
                })
                setCards(Object.values({...cards, [selected.round]: newRound}) as string[][]) 
                setSelected(undefined)
            }}
            style={{}}
            />
        })}
        </section>
    }

    return <section>
        {!selected ? <>
            <button onClick={()=>{setCardsDef(cards); setPage("menu")}}><FontAwesomeIcon icon={faArrowLeft}/></button>
            <div>
                {cards.map((round, i) => {
                    return <div key={i + "hand-editor-round"} style={{display: "flex"}}>
                    {round.map((card) => {
                        let card_id = card.split(".")[0]
                        return <Card
                        card={card_id}
                        key={Math.random()}
                        className={"card"}
                        clickCard={() => { setSelected({round: i, _id: card}) }}
                        style={{}}
                        />
                    })}
                    </div>
                })}
            </div>
        </>
        :   <>
            <button onClick={()=>{setSelected(undefined)}}><FontAwesomeIcon icon={faArrowLeft}/></button>
            <CardsList />
        </>
        }
    </section>
}