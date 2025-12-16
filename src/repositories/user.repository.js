import User from "../models/user.model.js";

export async function createUser({ username, password, role }) {
    return await User.create({ username, password, role });
}

// Récupérer un utilisateur par son ID
export async function getUserById(id) {
    return await User.findByPk(id);
}

// Mettre un utilisateur à jour
export async function updateUser(id, updates) {
    const user = await getUserById(id);
    if (!user) return null;
    return await user.update(updates);
}

// Supprimer un utilisateur
export async function deleteUser(id) {
    const user = await getUserById(id);
    if (!user) return null;
    await user.destroy();
    return user;
}

// Récupérer tous les utilisateurs
export async function getAllUsers(){
    return await User.findAll();
}

// Vérifier si un utilisateur existe déjà
export async function userExists(username) {
    const user = await User.findOne({ where: { username } });
    return Boolean(user);
}