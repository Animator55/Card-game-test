import { faArrowLeft, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { DataConnection } from "peerjs"
import { iconSelector } from "../logic/iconSelector"
import React from "react"

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

export const ShowPlayer = ({users, conn, cards, cardsOpponent, back, retryConn, bootbattle, selectedPlayer, alert}: Props)=>{

    const handleBack = ()=>{
        let screen = document.querySelector(".show-player")
        if(screen){ 
          screen.classList.remove("fade-from-right")
          screen.clientWidth
          screen.classList.add("fade-to-right")
          screen.clientWidth
        }
        
        setTimeout(()=>{
            back()
        }, 300)
    }

    const openSpan = ()=>{
        console.log("a")
    }

    const retryConnectionHandler = (e: React.MouseEvent)=>{
        let button = e.currentTarget as HTMLButtonElement
        button.classList.add("loading-button")
        retryConn()
    }

    React.useEffect(()=>{
        if(alert === "") return
        let button = document.querySelector(".show-player")?.lastChild as HTMLButtonElement
        if(button) button.classList.remove("loading-button")
    }, [alert])

    React.useEffect(()=>{
        let button = document.querySelector(".show-player")?.lastChild as HTMLButtonElement
        if(button.classList.contains("loading-button")) setTimeout(()=>{
            if(button.classList.contains("loading-button")) button.classList.remove("loading-button")
        }, 4000)
    })

    let checks = users.enemy !== "" && 
    (conn?.peerConnection.connectionState === "connected" 
    || conn?.peerConnection.connectionState === "new")

    console.log(conn?.peerConnection)

    const Retry = <button onClick={retryConnectionHandler} data-text={"Retry Connection"}></button>
    const Fight = <button onClick={()=>{bootbattle()}}>Fight</button>
    const Send = <button onClick={() => { if (conn) conn.send({ cardsTransfered: cards }) }} data-text={"Send Challenge"}></button>

    return <section className="show-player">
        <div className="d-flex">
            <button className="return-button" onClick={()=>{handleBack()}}><FontAwesomeIcon icon={faArrowLeft}/></button>
            <button className="config-button" onClick={()=>{openSpan()}}><FontAwesomeIcon icon={faEllipsisVertical}/></button>
        </div>
        <div className="profile-show">
            <div className="icon">
                <FontAwesomeIcon icon={iconSelector(selectedPlayer)}/>
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