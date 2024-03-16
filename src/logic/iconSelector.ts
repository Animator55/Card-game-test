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

    let letter = name.charAt(0).toUpperCase()
    let index = letter.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
    
    let length = name.split("").length
    let index2 = length % colors.length
    let filteredIndex = (index + index2) % colors.length
    return colors[filteredIndex]
}