
type cardsList = {
    [key: string]: cardType
}

export type cardType = {
    _id: string
    name: string
    image: string
    type: string
    strength: number
    speed: number
    defense: number
}

export const cardsD: cardsList = {
    "0000": {
        _id: "0000",
        name: "Fire Dragon",
        image: "#ff00d4",
        type: "Invocation",
        strength: 3,
        speed: 4,
        defense: 2
    },
    "0001": {
        _id: "0001",
        name: "Ice Dragon",
        image: "#56ceb6",
        type: "Invocation",
        strength: 4,
        speed: 2,
        defense: 3
    },
    "0002": {
        _id: "0002",
        name: "Fire Ball",
        image: "#ff0000",
        type: "Attack",
        strength: 5,
        speed: 2,
        defense: 0
    },
    "0003": {
        _id: "0003",
        name: "Ice Wall",
        image: "#aee5ff",
        type: "Defense",
        strength: 0,
        speed: 5,
        defense: 2
    },
    "0004": {
        _id: "0004",
        name: "Small Potion",
        image: "#ffe400",
        type: "Support",
        strength: 5,
        speed: 1,
        defense: 0
    },
    "0005": {
        _id: "0005",
        name: "Water Ball",
        image: "#338fff",
        type: "Attack",
        strength: 3,
        speed: 5,
        defense: 0
    },
    "0006": {
        _id: "0006",
        name: "Stone Wall",
        image: "#8a4e14",
        type: "Defense",
        strength: 0,
        speed: 3,
        defense: 7
    },
    "0007": {
        _id: "0007",
        name: "Big Potion",
        image: "#ff9b00",
        type: "Support",
        strength: 10,
        speed: 5,
        defense: 0
    },
}
