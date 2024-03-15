import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { colorGenerator, iconSelector } from "../logic/iconSelector"

type Props = { setPage: Function, singlePlayer: Function, justLogged: boolean, user: string }

export default function Menu({ setPage, singlePlayer, justLogged, user }: Props) {
  let className = justLogged ? "fade-from-right" : "fade-from-left"

  const changePage = (page: string) => {
    let menu = document.querySelector(".menu")
    if (menu) {
      menu.classList.remove("fade-from-right")
      menu.clientWidth
      menu.classList.remove("fade-from-left")
      menu.clientWidth
      menu.classList.add("fade-to-left")
      menu.clientWidth
    }
    setTimeout(() => {
      setPage(page)
    }, 300)
  }

  return <section className={"menu " + className}>
    <h1 className="title">Magic Card Game</h1>
    <hr></hr>
    <button className="fade-in" onClick={() => { singlePlayer() }}>SinglePlayer</button>
    <button className="fade-in" onClick={() => { changePage("userList") }}>Multiplayer</button>
    <button className="fade-in" onClick={() => { changePage("handEdit") }}>Edit Cards</button>
    <div className="profile-user">
      <div className="icon list" style={{ backgroundColor: colorGenerator(user) }}>
        <FontAwesomeIcon icon={iconSelector(user)} />
      </div>
      <p>{user}</p>
    </div>
  </section>
}