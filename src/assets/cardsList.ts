
type cardsList = {
    [key: string]: {
        _id: string
        name: string
        image: string
        type: string
        strength: number
        speed: number
        defense: number
    }
}

export const cardsD: cardsList = {
    "0000": {
        _id: "0000",
        name: "Dragon 1",
        image: "green",
        type: "Invocation",
        strength: 2,
        speed: 3,
        defense: 1
    },
    "0001": {
        _id: "0001",
        name: "Dragon 2",
        image: "green",
        type: "Invocation",
        strength: 3,
        speed: 2,
        defense: 1
    },
    "0002": {
        _id: "0001",
        name: "Fire Ball",
        image: "red",
        type: "Attack",
        strength: 4,
        speed: 4,
        defense: 0
    },
    "0003": {
        _id: "0003",
        name: "Wall",
        image: "blue",
        type: "Defense",
        strength: 0,
        speed: 4,
        defense: 3
    },
    "0004": {
        _id: "0004",
        name: "Potion 2",
        image: "yellow",
        type: "Support",
        strength: 1,
        speed: 1,
        defense: 1
    },
    "0005": {
        _id: "0005",
        name: "Water Ball",
        image: "red",
        type: "Attack",
        strength: 2,
        speed: 4,
        defense: 0
    },
    "0006": {
        _id: "0006",
        name: "Wall 2",
        image: "blue",
        type: "Defense",
        strength: 0,
        speed: 3,
        defense: 5
    },
    "0007": {
        _id: "0007",
        name: "Potion",
        image: "yellow",
        type: "Support",
        strength: 1,
        speed: 2,
        defense: 1
    },
}
