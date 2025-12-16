import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { UserService } from '../services/index.service.js';

const router = express.Router();

const secretKey = process.env.JWT_SECRET;

function handleValidation(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return null;
}

// Route pour l'inscription
router.post(
    '/register',
    [
        body('username')
            .trim()
            .notEmpty().withMessage("Le nom d'utilisateur est requis")
            .isLength({ min: 3 }).withMessage("Le nom d'utilisateur doit contenir au moins 3 caractères"),
        body('password')
            .notEmpty().withMessage('Le mot de passe est requis')
            .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    ],
    async (req, res) => {
        const validationErr = handleValidation(req, res);
        if (validationErr) return; // handleValidation a déjà la réponse
        try {
            const { username, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await UserService.createUser({ username, password: hashedPassword });
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
);

// Route pour la connexion
router.post(
    '/login',
    [
        body('username')
            .trim()
            .notEmpty().withMessage("Le nom d'utilisateur est requis"),
        body('password')
            .notEmpty().withMessage('Le mot de passe est requis'),
    ],
    async (req, res) => {
        const validationErr = handleValidation(req, res);
        if (validationErr) return;

        try {
            const { username, password } = req.body;
            const user = await UserService.getUserByUsername(username);
            if (!user) {
                return res.status(400).json({ message: 'Utilisateur non trouvé.' });
            }
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Mot de passe incorrect.' });
            }
            const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
            res.json({ token });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

export default router;