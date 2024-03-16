import { faArrowLeft, faMagnifyingGlass, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { FormEvent } from "react"
import { colorGenerator, iconSelector } from "../logic/iconSelector"

type Props = {
  slideFromRight: boolean,
  cachedUsers: string[],
  setCachedUsers: Function,
  backToMenu: Function,
  selectUser: Function
}

let justAdded = ""

export const UserList = ({ cachedUsers, setCachedUsers, backToMenu, selectUser, slideFromRight }: Props) => {
  const submit = (e: FormEvent) => {
    e.preventDefault()

    let input = e.currentTarget.firstChild as HTMLInputElement
    if (input.value === "") return
    justAdded = "user-li" + input.value + cachedUsers.length
    setCachedUsers([...cachedUsers, input.value])
    input.value = ""
    input.blur()
  }

  const handleSelectUser = (user: string) => {
    let screen = document.querySelector(".user-list")
    if (screen) {
      screen.clientWidth
      screen.classList.remove("fade-from-right")
      screen.clientWidth
      screen.classList.remove("fade-from-left")
      screen.clientWidth
      screen.classList.add("fade-to-left")
      screen.clientWidth
    }
    setTimeout(() => {
      selectUser(user)
    }, 300)
  }

  React.useEffect(() => {
    if (justAdded !== "") justAdded = ""
  })

  const drag = (e: React.TouchEvent<HTMLDivElement>) => {
    let initialX = e.touches[0].pageX
    let list = document.querySelector(".user-list") as HTMLDivElement
    if (!list) return

    const move = (e2: TouchEvent) => {
      if (e2.touches[0].clientX > initialX) list.style.left = e2.touches[0].clientX - initialX + "px"
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
  const dragUser = (e: React.TouchEvent<HTMLButtonElement>, user: string) => {
    let initialX = e.touches[0].pageX
    let button = document.getElementById(user) as HTMLButtonElement
    if (!button) return

    const move = (e2: TouchEvent) => {
      if (e2.touches[0].clientX < initialX) button.style.left = e2.touches[0].clientX - initialX + "px"
    }

    const drop = () => {
      document.removeEventListener("touchmove", move)
      document.removeEventListener("touchend", drop)
      document.removeEventListener("touchcancel", drop)


      if (parseInt(button.style.left) < (button.clientWidth/6)*-1) {
        button.style.transition = "left 300ms"
        button.style.left = ((button.clientWidth) * -1) + "px"
        button.parentElement!.classList.remove("fade-in")
        button.parentElement!.style.opacity = "0"
        setTimeout(() => {
          setCachedUsers(cachedUsers.filter(el=>{if(el !== button.name) return el}) as string[])
        }, 300)
      }
      else if(parseInt(button.style.left) > -10) {
        handleSelectUser(button.name)
      }
      else {
        button.style.transition = "left 300ms"
        button.style.left = "0px"
        setTimeout(() => {
          button.style.transition = ""
        }, 300)
      }
    }

    document.addEventListener("touchmove", move)
    document.addEventListener("touchend", drop, { once: true })
    document.addEventListener("touchcancel", drop, { once: true })
  }
  const dragUserMouse = (e: React.MouseEvent<HTMLButtonElement>, user: string) => {
    let initialX = e.clientX
    let button = document.getElementById(user) as HTMLButtonElement
    if (!button) return

    const move = (e2: MouseEvent) => {
      if (e2.clientX < initialX) button.style.left = e2.clientX - initialX + "px"
    }

    const drop = () => {
      document.removeEventListener("mousemove", move)
      document.removeEventListener("mouseup", drop)


      if (parseInt(button.style.left) < (button.clientWidth/6)*-1) {
        button.style.transition = "left 300ms"
        button.style.left = ((button.clientWidth) * -1) + "px"
        button.parentElement!.classList.remove("fade-in")
        button.parentElement!.style.opacity = "0"
        setTimeout(() => {
          setCachedUsers(cachedUsers.filter(el=>{if(el !== button.name) return el}) as string[])
        }, 300)
      }
      else if(parseInt(button.style.left) > -10) {
        handleSelectUser(button.name)
      }
      else {
        button.style.transition = "left 300ms"
        button.style.left = "0px"
        setTimeout(() => {
          button.style.transition = ""
        }, 300)
      }
    }

    document.addEventListener("mousemove", move)
    document.addEventListener("mouseup", drop, { once: true })
  }

  React.useEffect(() => {
    let screen = document.querySelector(".user-list")
    if (screen) screen.classList.add(slideFromRight ? "fade-from-right" : "fade-from-left")

    setTimeout(() => {
      if (!screen) return
      screen.classList.remove("fade-from-right")
      screen.clientWidth
    }, 300)
  }, [])

  return <section className="user-list" onTouchStart={drag}>
    <div className="top">
      <button className="return-button" onClick={() => { backToMenu(false) }}><FontAwesomeIcon icon={faArrowLeft} /></button>
      <form className="search" onSubmit={submit}>
        <input placeholder="Search user..." />
        <button type="submit"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
      </form>
    </div>

    <ul>
      {cachedUsers.map((el, i) => {
        return <div 
          key={"user-li" + el + i}
          className={justAdded === "user-li" + el + i ? "fade-in" : ""}
        >
          <FontAwesomeIcon icon={faTrash}/>
          <button
            id={"user-li" + el + i}
            name={el}
            style={{left: 0}}
            onTouchStart={(e)=>{dragUser(e, "user-li" + el + i)}}
            onMouseDown={(e)=>{dragUserMouse(e, "user-li" + el + i)}}
          >
            <div className="icon list" style={{backgroundColor: colorGenerator(el)}}>
              <FontAwesomeIcon icon={iconSelector(el)} />
            </div>
            <p>{el}</p>
          </button>
        </div>
      })}
    </ul>
  </section>
}