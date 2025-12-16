// ./src/models/game.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

// Définition du modèle "Game" avec Sequelize
const Game = sequelize.define("Game", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Génère automatiquement un UUID
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Chaque nom est unique
  },
  releaseDate: {
    type: DataTypes.STRING, // On va stocker la date en format string pour simplifier
    allowNull: false,
  },
});

export default Game;