import { faBolt, faCrown, faJoint, faKiwiBird, faLightbulb, faRocket, faSpoon, faUser } from "@fortawesome/free-solid-svg-icons"

export const iconSelector = (name: string)=>{
    const icons = [faBolt, faRocket, faCrown, faJoint, faLightbulb, faKiwiBird, faSpoon]
    console.log(name, icons)
    return faUser
}