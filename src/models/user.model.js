// ./src/models/game.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

// Définition du modèle "User" avec Sequelize
const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Génère automatiquement un UUID
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Chaque nom est unique
  },
  password: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "user", // Rôle par défaut
  },
});

export default User;