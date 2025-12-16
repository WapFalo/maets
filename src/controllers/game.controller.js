import { GameService } from "../services/index.service.js";

export async function getAllGames(req, res){
    try {
        const games = await GameService.getAllGames();
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function createGame(req, res) {
    try {
        const { name, releaseDate } = req.body;
        const newGame = await GameService.createGame({ name, releaseDate });
        res.status(201).json(newGame);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function updateGame(req, res) {
    try {
        const { id } = req.params;
        const { name, releaseDate } = req.body;
        const updatedGame = await GameService.updateGame(id, { name, releaseDate });
        res.json(updatedGame);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function deleteGame(req, res) {
    try {
        const { id } = req.params;
        const deletedGame = await GameService.deleteGame(id);
        res.json(deletedGame);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}