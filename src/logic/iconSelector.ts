import { faBolt, faCrown, faJoint, faKiwiBird, faLightbulb, faRocket, faSpoon, faUser } from "@fortawesome/free-solid-svg-icons"

export const iconSelector = (name: string)=>{
    const icons = [faBolt, faRocket, faCrown, faJoint, faLightbulb, faKiwiBird, faSpoon, faUser]
    let length = name.split("").length
    let index = length % icons.length
    return icons[index]
}

export const colorGenerator = (name: string)=>{
    const colors = [
        "#ff1a83",
        "#ff771a",
        "#19b71d",
        "#0e7dc9",
        "#560ec9",
        "#dfa908",
        "#ff1a1a",
    ]
    let length = name.split("").length
    let index = length % colors.length
    return colors[index]
}