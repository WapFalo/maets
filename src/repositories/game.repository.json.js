import { write } from "fs";
import fs from "fs/promises";
import { json } from "sequelize";
import { v4 as uuidv4 } from "uuid";

const FILE_PATH = "./games.json";

async function readJSONFile() {
    try {
        const data = await fs.readFile(FILE_PATH, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        if (error.code === "ENOENT") {
            await fs.writeFile(FILE_PATH, JSON.stringify([]));
            return [];
        }
        throw error;
    }
}

async function writeJSONFile(data) {
    await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
}

export async function resetDatabase() {
    await writeJSONFile([]);
}

export async function createGame({ name, releaseDate }) {
    const games = await readJSONFile();
    if (name && await gameExists(name)) {
        throw new Error("Nom déjà utilisé. Chaque jeu doit être unique.");
    }

    const newGame = { id: uuidv4(), name, releaseDate };
    games.push(newGame);
    await writeJSONFile(games);
    return newGame;
}

export async function updateGame(id, updates){
    const games = await readJSONFile();
    const gameIndex = games.findIndex((game) => game.id === id);

    if (gameIndex === -1) return null;

    if (updates.name) {
        if(updates.name && await gameExists(updateGame.name)){
            throw new Error("Nom déjà utilisé. Chaque jeu doit être unique.");
        }
    }
    games[gameIndex] = {...games[gameIndex], ...updates};
    await writeJSONFile(games);
    return games[gameIndex];
}

export async function deleteGame(id){
    const games = await readJSONFile();
    const gameIndex = games.findIndex((game) => game.id === id);
    if (gameIndex === -1) return null;

    const [deletedGame] = games.splice(gameIndex, 1);
    await writeJSONFile(games);
    return deletedGame;
}

export async function getGameById(id) {
    const games = await readJSONFile();
    return games.find((game) => game.id === id) || null;
}

export async function getAllGames() {
    return await readJSONFile();
}

export async function gameExists(name){
    const games = await readJSONFile();
    return games.some((game) => game.name === name);
}