import { faArrowLeft, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { FormEvent } from "react"

type Props = {cachedUsers: string[], setCachedUsers:Function, backToMenu: Function, selectUser: Function}

export const UserList = ({cachedUsers, setCachedUsers, backToMenu, selectUser}: Props)=>{
  const submit = (e:FormEvent)=>{
    e.preventDefault()

    let input = e.currentTarget.firstChild as HTMLInputElement
    if(input.value === "") return
    setCachedUsers([...cachedUsers, input.value])
    input.value = ""
  }

  React.useEffect(()=>{
    let screen = document.querySelector(".user-list")
    if(screen) screen.classList.add("fade-from-right")
  }, [])

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
            onClick={()=>{selectUser(el)}}
          >{el}</button>
        })}
      </ul>
  </section>
}