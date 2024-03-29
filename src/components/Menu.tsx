import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { colorGenerator, iconSelector } from "../logic/iconSelector"
import PlaySoundMp3 from "../logic/playSound"
import { faExpand } from "@fortawesome/free-solid-svg-icons"

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
    <button className="fade-in" onClick={() => {PlaySoundMp3("click"); singlePlayer() }}>SinglePlayer</button>
    <button className="fade-in" onClick={() => {PlaySoundMp3("click"); changePage("userList") }}>Multiplayer</button>
    <button className="fade-in" onClick={() => {PlaySoundMp3("click"); changePage("handEdit") }}>Edit Cards</button>
    <div className="profile-user fade-in">
      <div className="icon list" style={{ backgroundColor: colorGenerator(user) }}>
        <FontAwesomeIcon icon={iconSelector(user)} />
      </div>
      <p>{user}</p>
      <button className="fullscreen" onClick={()=>{document.body.requestFullscreen()}}><FontAwesomeIcon icon={faExpand} size="xl"/></button>
    </div>
  </section>
}