import React from "react"
import PlaySoundMp3 from "../logic/playSound"

type Props = {
  confirm: Function
  loginState: string
}

export default function Auth({ confirm, loginState }: Props) {
  const [error, setError] = React.useState(loginState)
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let input = e.currentTarget[0] as HTMLInputElement

    if (input.value === "") return setError("Complete input")

    let submit = e.currentTarget[1] as HTMLButtonElement

    submit.classList.add('loading-button')
    input.blur()

    setError("")
    PlaySoundMp3("click")
    confirm(input.value)
  }

  React.useEffect(()=>{
    let auth = document.querySelector(".form")
    let input = auth?.firstChild as HTMLInputElement
    if(input) input.focus()
  })

  React.useEffect(()=>{
    if(loginState !== "") {
      setError(loginState)
      PlaySoundMp3("error")
      let auth = document.querySelector(".form")
      let button = auth?.lastChild as HTMLInputElement
      if(button)button.classList.remove('loading-button')    
    }
  }, [loginState])

  React.useEffect(()=>{
    let data = window.localStorage
    if(data.length !== 0) {
      let first = Object.keys(data)[0]
      
      let auth = document.querySelector(".form")
      let input = auth?.firstChild as HTMLInputElement
      input.value = first 
      let button = input.nextElementSibling as HTMLButtonElement 
      button.click() 
    }
  }, [])


  return <section className="auth-screen">
    <h1>Login</h1>
      <section className='error-box'>{error}</section>
    <form onSubmit={submit} className="form" >
      <input placeholder="Username"></input>
      <button type='submit' data-text="Login"></button>
    </form>
  </section>
}