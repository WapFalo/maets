import { GameService } from "./index.service.js";
import { GameRepository } from "../repositories/index.repository.js";
import { gamesMock } from "../../mocks/games.mock.js"
import { gameExists } from "../repositories/game.repository.js";

console.log("GameRepository import:", GameRepository);
console.log("Keys:", Object.keys(GameRepository || {}));

export async function initializeGameMock() {
    console.log("====START MOCK====");

    for (const game of gamesMock) {
        const exists = await GameRepository.gameExists(game.name);
        if (!exists) {
            const newGame = await GameService.createGame(game);
            console.log("Jeu mock ajouté :", newGame.name);
        } else {
            console.log("Jeu mock déjà existant, non ajouté :", game.name);
        }
    }
    console.log("====END MOCK====");

    return await GameService.getAllGames();
}