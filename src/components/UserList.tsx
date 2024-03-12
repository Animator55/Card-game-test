import { faArrowLeft, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { FormEvent } from "react"

type Props = {
  slideFromRight: boolean, 
  cachedUsers: string[], 
  setCachedUsers:Function, 
  backToMenu: Function, 
  selectUser: Function
}

let justAdded = ""

export const UserList = ({cachedUsers, setCachedUsers, backToMenu, selectUser, slideFromRight}: Props)=>{
  const submit = (e:FormEvent)=>{
    e.preventDefault()

    let input = e.currentTarget.firstChild as HTMLInputElement
    if(input.value === "") return
    justAdded = "user-li" + input.value + cachedUsers.length
    setCachedUsers([...cachedUsers, input.value])
    input.value = ""
  }

  const handleSelectUser = (user: string)=>{
    let screen = document.querySelector(".user-list")
    if(screen){ 
      screen.clientWidth
      screen.classList.remove("fade-from-right")
      screen.clientWidth
      screen.classList.remove("fade-from-left")
      screen.clientWidth
      screen.classList.add("fade-to-left")
      screen.clientWidth
    }
    setTimeout(()=>{
      selectUser(user)
    }, 300)
  }

  React.useEffect(()=>{
    let screen = document.querySelector(".user-list")
    if(screen) screen.classList.add(slideFromRight ? "fade-from-right" : "fade-from-left")
  }, [])

  React.useEffect(()=>{
    if(justAdded !== "") justAdded = "" 
  })

  return <section className="user-list">
      <div className="top">
        <button className="return-button" onClick={()=>{backToMenu()}}><FontAwesomeIcon icon={faArrowLeft}/></button>
        <form className="search" onSubmit={submit}>
          <input placeholder="username"/>
          <button type="submit"><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
        </form>
      </div>

      <ul>
        {cachedUsers.map((el, i)=>{
          return <button
            key={"user-li" + el + i}
            id={"user-li" + el + i}
            className={justAdded === "user-li" + el + i ? "fade-in" : ""}
            onClick={()=>{handleSelectUser(el)}}
          >{el}</button>
        })}
      </ul>
  </section>
}