import SanguineGameMediator from "../../server/GameMediator"
import SanguineGame from "../../server/Game"
import Serializer from "../../server/Serializer"
import { transitGame, transitCharacter, transitItem, transitLocation } from "../../server/_types/TransitTypes"

export default class OutboundRequests {
    readonly game: SanguineGame

    constructor(serializer: Serializer) {
        this.game = SanguineGameMediator.getInstance().createGame(serializer)
    }

    /* -----------------------------
                INIT
    ----------------------------- */

    async startGame(): Promise<{gameState: transitGame, regionNames: string[]}> {
        return this.game.startGame()
    }

    async beginCharacterInitialize(): Promise<{ classChoices: string[], weaponChoices: string [] }> {
        return this.game.beginCharacterInitialize()
    }

    async verifyCharacterInitialize(choices: { classChoice: number, weaponChoice: number }): Promise<transitGame> {
        return this.game.verifyCharacterInitialize(choices)
    }
    
    /* -----------------------------
              GAME LOGIC
    ----------------------------- */
    
    async move(targetIndex: number) : Promise<transitLocation | "Invalid Move"> {     
        return this.game.move(targetIndex)
    }

    async gatherBounty(action: "Forage" | "Collect"): Promise<{ drops: string, bounty: number, inventory: transitItem[] }> {
        return this.game.gatherBounty(action)
    }
}