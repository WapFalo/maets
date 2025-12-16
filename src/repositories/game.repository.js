import Game from "../models/game.model.js";

export async function createGame({ name, releaseDate }) {
    return await Game.create({ name, releaseDate });
}

// Récupérer un jeu par son ID
export async function getGameById(id) {
    return await Game.findByPk(id);
}

// Mettre un jeu à jour
export async function updateGame(id, updates) {
    const game = await getGameById(id);
    if (!game) return null;
    return await game.update(updates);
}

// Supprimer un jeu
export async function deleteGame(id) {
    const game = await getGameById(id);
    if (!game) return null;
    await game.destroy();
    return game;
}

// Récupérer tous les jeux
export async function getAllGames(){
    return await Game.findAll();
}

// Vérifier si un jeu existe déjà
export async function gameExists(name) {
    const game = await Game.findOne({ where: { name } });
    return Boolean(game);
}