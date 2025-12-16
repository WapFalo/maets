// ./config/database.js
import { Sequelize } from "sequelize";

// Pour ce cours, nous utilisons une base SQLite locale "games.db"
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "databse.sqlite3", // Fichier SQLite
  logging: console.log,       // Active les logs SQL pour plus de clarté (sinon → false)
});

// On exporte l'instance Sequelize
export default sequelize;