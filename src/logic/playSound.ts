import click from '../assets/sounds/buttonClick.mp3'
import error from '../assets/sounds/Error.mp3'
import fold from '../assets/sounds/Fold.mp3'
import pick from '../assets/sounds/PickFromDeck.mp3'
import dice from '../assets/sounds/dice.mp3'
import attack from '../assets/sounds/Attack.mp3'
import defense from '../assets/sounds/Defense.mp3'
import heal from '../assets/sounds/Heal.mp3'

type Sounds = {
    [key: string] : string
}

export default function PlaySoundMp3 (sound: string){
    let sounds: Sounds = {
        "click": click,
        "error": error,
        "fold": fold,
        "pick": pick,
        "dice": dice,
        "attack": attack,
        "defense": defense,
        "heal": heal,
    }
    let audio = new Audio(sounds[sound])
    audio.play()
}