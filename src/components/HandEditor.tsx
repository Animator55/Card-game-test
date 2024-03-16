import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { cardsD } from "../assets/cardsList"
import { Card } from "./Card"

type Props = {
    backToMenu: Function
    cardsDef: string[][]
    setCardsDef: Function
}

export default function HandEditor({ backToMenu, cardsDef, setCardsDef }: Props) {
    const [cards, setCards] = React.useState(cardsDef)
    const [selected, setSelected] = React.useState<{ round: number, _id: string } | undefined>()


    const CardsList = () => {
        return selected && <section className="card-list-flex">
            {Object.values(cardsD).map((card) => {
                if(selected._id.split(".")[0] === card._id) return 
                return <Card
                    card={card._id}
                    key={Math.random()}
                    className={"card"}
                    clickCard={() => {
                        let newRound = cards[selected.round].map(el => {
                            if (el === selected._id) return card._id + "." + Math.floor(Math.random() * 100000)
                            else return el
                        })
                        setCards(Object.values({ ...cards, [selected.round]: newRound }) as string[][])
                        setSelected(undefined)
                    }}
                    style={{}}
                />
            })}
        </section>
    }

    const drag = (e: React.TouchEvent<HTMLDivElement>) => {
        let initialX = e.touches[0].pageX
        let list = document.querySelector(".hand-editor") as HTMLDivElement
        if (!list) return
        list.classList.remove("fade-from-right")
        list.clientWidth

        const move = (e2: TouchEvent) => {
            if (initialX + 120) list.style.left = e2.touches[0].clientX - initialX + "px"
        }

        const drop = () => {
            document.removeEventListener("touchmove", move)
            document.removeEventListener("touchend", drop)
            document.removeEventListener("touchcancel", drop)


            if (parseInt(list.style.left) > initialX + list.clientWidth / 8) {
                list.style.transition = "left 300ms, opacity 100ms"
                list.style.pointerEvents = "none"
                list.style.left = list.clientWidth + "px"
                list.style.opacity = "0"
                backToMenu(true)
            }
            else {
                list.style.transition = "left 300ms"
                list.style.left = "0px"
                setTimeout(() => {
                    list.style.transition = ""
                    list.style.pointerEvents = "all"
                }, 300)
            }
        }

        document.addEventListener("touchmove", move)
        document.addEventListener("touchend", drop, { once: true })
        document.addEventListener("touchcancel", drop, { once: true })
    }

    React.useEffect(() => {
        let screen = document.querySelector(".hand-editor")
        if (screen) screen.classList.add("fade-from-right")

    }, [])

    return <section className="hand-editor" onTouchStart={drag}>
        {!selected ? <>
            <button className="return-button" onClick={() => { setCardsDef(cards); backToMenu() }}><FontAwesomeIcon icon={faArrowLeft} /></button>
            <div>
                {cards.map((round, i) => {
                    return <React.Fragment key={Math.random()}>
                        <h4 className="round-label">Round {i + 1}</h4>
                        <div className="hand-editable" key={i + "hand-editor-round"}>
                            {round.map((card) => {
                                let card_id = card.split(".")[0]
                                return <Card
                                    card={card_id}
                                    key={Math.random()}
                                    className={"card editable"}
                                    clickCard={() => { setSelected({ round: i, _id: card }) }}
                                    style={{}}
                                />
                            })}
                        </div>
                    </React.Fragment>
                })}
            </div>
        </>
            : <>
                <button className="return-button" onClick={() => { setSelected(undefined) }}><FontAwesomeIcon icon={faArrowLeft} /></button>
                <div className="selected-card">
                    <Card
                        card={selected._id.split(".")[0]}
                        key={Math.random()}
                        className={"card"}
                        clickCard={() => {setSelected(undefined)}}
                        style={{}}
                    />
                </div>
                <CardsList />
            </>
        }
    </section>
}