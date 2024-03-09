type Props = {
    confirm: Function
}

export default function Auth({confirm}: Props) {
  return <section className="auth-screen">
    <h1>Login</h1>
    <input placeholder="user-name"></input>
    <button onClick={(e)=>{
        let input = e.currentTarget.previousElementSibling as HTMLInputElement
        confirm(input.value)
    }}>Login</button>
  </section>
}