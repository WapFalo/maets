import { GameRepository } from "../repositories/index.repository.js";

export async function getGameById(id) {
    const game = await GameRepository.getGameById(id);

    if (!game) {
        throw new Error("Jeu non trouvé");
    }
    return game;
}

export async function getAllGames() {
    const games = await GameRepository.getAllGames();
    return games;
}

export async function createGame({ name, releaseDate }) {
    if (!name) {
        throw new Error("Le nom du jeu est requis");
    }

    if (!releaseDate || isNaN(Date.parse(releaseDate))) {
        throw new Error("La date de sortie est invalide ou manquante");
    }

    if(await GameRepository.gameExists(name)){
        throw new Error("Nom déjà utilisé. Chaque jeu doit être unique.");
    }

    const powerDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(releaseDate));

    const newGame = await GameRepository.createGame({ name, releaseDate: powerDate });
    return newGame;
}

export async function updateGame(id, { name, releaseDate }) {
    if (!name || !releaseDate) {
        throw new Error("Le nom et la date de sortie sont requis pour la mise à jour");
    }

    if(!name){
        throw new Error("Le nom du jeu est requis");
    }

    if(!releaseDate || isNaN(Date.parse(releaseDate))){
        throw new Error("La date de sortie est invalide ou manquante");
    }

    if(await GameRepository.gameExists(name)){
        throw new Error("Nom déjà utilisé. Chaque jeu doit être unique.");
    }

    const updatedGame = await GameRepository.updateGame(id, { name, releaseDate });
    return updatedGame;
}

export async function deleteGame(id) {
    const game = await getGameById(id); // Vérifie si le jeu existe
    if(!game){
        throw new Error("Jeu non trouvé");
    }

    await GameRepository.deleteGame(id);
    return game;
}