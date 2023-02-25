import Serializer from "./Serializer"
import SanguineGame from "./Game"
import { PLAYERS } from "./_data/PLAYER_DATA"

let instance: SanguineGameMediator

export default class SanguineGameMediator {
    private games: SanguineGame[]


    constructor() {
        this.games = new Array<SanguineGame>()
    }

    static getInstance(): SanguineGameMediator {
        if (typeof instance == "undefined") {
            instance = new SanguineGameMediator()
        }
        return instance
    }

    getCharactersFromPassword(password: string): { name: string, characterNames: string[] } | "Invalid Password" {
        const players = PLAYERS

        if (players[password] == null) {
            return "Invalid Password"
        } else {
            const player = players[password]
            const characters = []
            for ( const character of player.saves ) {
                characters.push(character)
            }
            return { name: player.name, characterNames: characters}
        }
    }

    async createTestGame(): Promise<SanguineGame> {
        let serializer = new Serializer("testDFGData", "testDFGData")
        serializer = await serializer.loadTestGame()
        return this.createGame(serializer)
    }

    async createGameFromCharacter(password: string, characterName: string): Promise<SanguineGame | "Invalid Password" | "Invalid Character"> {
        const players = PLAYERS

        if (players[password] == null) return "Invalid Password"

        const player = players[password]
        for ( const character of player.saves ) {
            if ( character == characterName) {
                let serializer = new Serializer(player.name, character)
                serializer = await serializer.loadGame()
                return this.createGame(serializer)
            }
        }
        return "Invalid Character"
    }

    createGame(serializer: Serializer): SanguineGame {
        console.log(serializer)
        const game = new SanguineGame(serializer)
        this.games.push(game)
        return game
    }
}