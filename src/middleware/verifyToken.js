const jwt = require('jsonwebtoken');

require('dotenv').config();
const secretKey = process.env.JWT_SECRET;

module.exports = function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Récupère le token Bearer

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.id; // Ajoute l'ID utilisateur décodé à la requête
        next(); // Passe au middleware suivant
    } catch (error) {
        return res.status(403).json({ message: 'Token invalide.' });
    }
};
