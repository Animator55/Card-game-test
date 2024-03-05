import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faDragon, faFire, faHandFist, faShield, faShoePrints } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { cardsD } from "../assets/cardsList"

type router = {
  [key:string] : IconDefinition
}

type Props = {
    className: string, clickCard: Function, style: any, card: string
}

export const Card = ({className, clickCard, style, card}:Props) => {
    const iconSelector: router = {
        "Attack": faFire,
        "Invocation": faDragon,
        "Defense": faShield
    }
    return <div
        className={className}
        onClick={()=>{clickCard()}}
        key={Math.random()}
        style={style}
    >
        <h4>{cardsD[card].name}</h4>
        <div className='card-image' style={{ color: cardsD[card].image }}>
            <FontAwesomeIcon icon={iconSelector[cardsD[card].type]} />
        </div>
        <div className='d-flex'>
            <div className='d-flex'>
                <h5>{cardsD[card].strength}</h5>
                <FontAwesomeIcon icon={faHandFist} />
            </div>
            <div className='d-flex'>
                <h5>{cardsD[card].defense}</h5>
                <FontAwesomeIcon icon={faShield} />
            </div>
            <div className='d-flex'>
                <h5>{cardsD[card].speed}</h5>
                <FontAwesomeIcon icon={faShoePrints} />
            </div>
        </div>
    </div>
}