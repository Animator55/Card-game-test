import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { DataConnection } from "peerjs"
import { colorGenerator, iconSelector } from "../logic/iconSelector"
import React from "react"
import PlaySoundMp3 from "../logic/playSound"

type Props = {
    users: { player: string, enemy: string }
    conn: DataConnection | undefined
    cards: string[][]
    alert: string
    cardsOpponent: string[][]
    back: Function
    bootbattle: Function
    retryConn: Function
    selectedPlayer: string
}

export const ShowPlayer = ({ users, conn, cards, cardsOpponent, back, retryConn, bootbattle, selectedPlayer, alert }: Props) => {

    const handleBack = () => {
        let screen = document.querySelector(".show-player")
        if (screen) {
            screen.classList.remove("fade-from-right")
            screen.clientWidth
            screen.classList.add("fade-to-right")
            screen.clientWidth
        }

        setTimeout(() => {
            back()
        }, 300)
    }
    const drag = (e: React.TouchEvent<HTMLDivElement>) => {
        let initialX = e.touches[0].pageX
        let list = document.querySelector(".show-player") as HTMLDivElement
        if (!list) return
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
                setTimeout(() => {
                    back()
                }, 300)
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

    const retryConnectionHandler = (e: React.MouseEvent) => {
        PlaySoundMp3("click");
        let button = e.currentTarget as HTMLButtonElement
        button.classList.add("loading-button")
        retryConn()
    }

    React.useEffect(() => {
        if (alert === "") return
        PlaySoundMp3("error");
        let button = document.querySelector(".show-player")?.lastChild as HTMLButtonElement
        if (button) button.classList.remove("loading-button")
    }, [alert])

    React.useEffect(() => {
        let button = document.querySelector(".show-player")?.lastChild as HTMLButtonElement
        if (button.classList.contains("loading-button")) setTimeout(() => {
            if (button.classList.contains("loading-button")) button.classList.remove("loading-button")
        }, 4000)
    })

    React.useEffect(()=>{
        let screen = document.querySelector(".show-player")
        if (screen) screen.classList.add("fade-from-right")

        setTimeout(()=>{
            if (!screen) return
            screen.classList.remove("fade-from-right")
            screen.clientWidth
        }, 300)
    }, [])

    let checks = users.enemy !== "" &&
        (conn?.peerConnection.connectionState === "connected"
            || conn?.peerConnection.connectionState === "new")

    const Retry = <button onClick={retryConnectionHandler} data-text={"Retry Connection"}></button>
    const Fight = <button onClick={() => { PlaySoundMp3("click"); bootbattle() }}>Fight</button>
    const Send = <button onClick={() => { PlaySoundMp3("click"); if (conn) conn.send({ cardsTransfered: cards }) }} data-text={"Send Challenge"}></button>

    return <section className="show-player" onTouchStart={drag}>
        <button className="return-button" onClick={() => { PlaySoundMp3("click"); handleBack() }}><FontAwesomeIcon icon={faArrowLeft} /></button>
        <div className="profile-show">
            <div className="icon" style={{backgroundColor: colorGenerator(selectedPlayer)}}>
                <FontAwesomeIcon icon={iconSelector(selectedPlayer)} />
            </div>
            <h2>{selectedPlayer}</h2>
        </div>
        <div className="error-box">{alert}</div>

        {
            checks && cardsOpponent.length !== 0 ? Fight
                : checks && alert === "" ? Send : Retry
        }
    </section>
}