import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faDragon, faFire, faFlask, faHandFist, faShield, faShoePrints } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { cardsD } from "../assets/cardsList"

type router = {
  [key:string] : IconDefinition
}

type Props = {
    className: string, clickCard: Function, style: any, card: string, id?: string, dataDamage?:string
}

export const Card = ({className, clickCard, style, card, id, dataDamage}:Props) => {
    const iconSelector: router = {
        "Attack": faFire,
        "Invocation": faDragon,
        "Defense": faShield,
        "Support": faFlask
    }
    return <div
        id={id ? id : ""}
        data-damage={dataDamage ? dataDamage : ""}
        className={className}
        onClick={()=>{clickCard()}}
        style={style}
        data-type={cardsD[card].type}
    >
        <h4 className="card-text">{cardsD[card].name}</h4>
        <div className='card-image' style={{ color: cardsD[card].image }}>
            <FontAwesomeIcon icon={iconSelector[cardsD[card].type]} />
        </div>
        <div className='d-flex'>
            <div className='d-flex'>
                <h5>{cardsD[card].strength}</h5>
                <FontAwesomeIcon icon={faHandFist} />
            </div>
            <div className='d-flex'>
                <h5 className="defense-stat" data-defense={cardsD[card].defense}></h5>
                <FontAwesomeIcon icon={faShield} />
            </div>
            <div className='d-flex'>
                <h5>{cardsD[card].speed}</h5>
                <FontAwesomeIcon icon={faShoePrints} />
            </div>
        </div>
    </div>
}