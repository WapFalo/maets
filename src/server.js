// ./src/server.js
import sequelize from "./config/database.js";
import Game from "./models/game.model.js";
import express from "express";
import { GameService } from "./services/index.service.js";
import { initializeGameMock } from "./services/mock.service.js";
import { GameController } from "./controllers/index.controller.js";
import require from 'requirejs';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs/promises';

// Synchronisation DB
await sequelize.sync();
console.log("Base de données synchronisée !");

// Charger les variables locales
require ('dotenv').config();

// Charger Swagger
const swaggerDocument = JSON.parse(
  await fs.readFile(new URL("./config/swagger.json", import.meta.url), "utf8")
);

// Configuration du serveur Express

const app = express();
const authRoutes = import('./routes/auth.js');
const port = 3000;

// Récupération clé
const secretKey = process.env.JWT_SECRET;
console.log("Clé secrète JWT chargée");

// Middleware pour lire le JSON dans le corps de la requête
app.use(express.json());
// Middleware pour lire les données encodées dans l'URL
app.use(express.urlencoded({ extended: true }));

// Lancer Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//initialisation premier jeu
const game = await GameService.createGame[{
    name: "The Legend of Zelda: Breath of the Wild",
    releaseDate: "2017-03-03"
}];
console.log("Jeu initialisé :", game);

const games = await initializeGameMock();

console.log((await GameService.getAllGames()).map(g => g.name)); // Affiche les noms des jeux

// Accueil du service : route GET /
app.get("/", (req, res) => {
  res.send(`<h1>Hello from Maets API!</h1>
    The API is located on <a href="/api/v1">/api/v1/</a>`);
});

app.get("/api/v1", (req, res) => {
  res.json({message:"Hello api !"})
})

app.get("/api/v1/games", GameController.getAllGames);

// route POST /
app.post("/api/v1/games/post", async (req, res) => {
  try {
    const { name, releaseDate } = req.body;
    const newGame = await GameService.createGame({ name, releaseDate });
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// route DELETE /
app.delete("/api/v1/games/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGame = await GameService.deleteGame(id);
    res.json(deletedGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});