type Props = {
    confirm: Function
}

export default function Auth({confirm}: Props) {
  return <section>
    <input placeholder="user-name"></input>
    <button onClick={(e)=>{
        let input = e.currentTarget.previousElementSibling as HTMLInputElement
        confirm(input.value)
    }}>Login</button>
  </section>
}