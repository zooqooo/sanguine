import SanguineGameMediator from "../../server/GameMediator"
import SanguineGame from "../../server/Game"
import { transitGame, transitCharacter, transitItem, transitLocation } from "../../server/_types/TransitTypes"

export default class OutboundRequests {
    private game: SanguineGame

    constructor(game: SanguineGame) {
        this.game = game
    }

    /* -----------------------------
                LOAD
    ----------------------------- */

    static async getCharactersFromPassword(password: string): Promise<{ name: string, characterNames: string[] } | "Invalid Password"> {
        return SanguineGameMediator.getInstance().getCharactersFromPassword(password)
    }

    static async getCharacterFromPassword(password: string, character: string): Promise<OutboundRequests | "Invalid Password" | "Invalid Character"> {
        const game = await SanguineGameMediator.getInstance().createGameFromCharacter(password, character)
        if ( game == "Invalid Password" ) return "Invalid Password"
        if ( game == "Invalid Character" ) return "Invalid Character"
        return new OutboundRequests(game)
    }

    static async createTestGame(): Promise<OutboundRequests> {
        const game = await SanguineGameMediator.getInstance().createTestGame()
        return new OutboundRequests(game)
    }
    
    /* -----------------------------
              GAME LOGIC
    ----------------------------- */

    async startGame(): Promise<{gameState: transitGame, regionNames: string[]}> {
        return this.game.startGame()
    }

    /* ----   RESPAWN    ---- */

    async beginCharacterInitialize(): Promise<{ classChoices: string[], weaponChoices: string [] }> {
        return this.game.beginCharacterInitialize()
    }

    async verifyCharacterInitialize(choices: { classChoice: number, weaponChoice: number }): Promise<transitGame> {
        return this.game.verifyCharacterInitialize(choices)
    }

    /* ----   MOVE    ---- */
    
    async move(targetIndex: number) : Promise<transitLocation | "Invalid Move"> {     
        return this.game.move(targetIndex)
    }

    /* ----   BOUNTY    ---- */

    async gatherBounty(action: "Forage" | "Collect"): Promise<{ drops: string, bounty: number, inventory: transitItem[] }> {
        return this.game.gatherBounty(action)
    }
}