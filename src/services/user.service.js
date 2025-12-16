import { UserRepository } from "../repositories/index.repository.js";

export async function getUserById(id) {
    const user = await UserRepository.getUserById(id);
    
    if (!user) {
        throw new Error("Utilisateur non trouvé");
    }
    return user;
}

export async function getAllUsers() {
    const users = await UserRepository.getAllUsers();
    return users;
}

export async function createUser({ username, password, role }) {
    if (!username) {
        throw new Error("Le nom d'utilisateur est requis");
    }

    if (!password) {
        throw new Error("Le mot de passe est requis");
    }

    if (!role){
        throw new Error("Le rôle est requis");
    }

    if (await UserRepository.userExists(username)) {
        throw new Error("Nom d'utilisateur déjà utilisé. Chaque utilisateur doit être unique.");
    }

    const newUser = await UserRepository.createUser({ username, password, role });
    return newUser;
}

export async function updateUser(id, { username, password, role }) {
    if (!username || !password || !role) {
        throw new Error("Le nom d'utilisateur, le mot de passe et le rôle sont requis pour la mise à jour");
    }

    if (await UserRepository.userExists(username)) {
        throw new Error("Nom d'utilisateur déjà utilisé. Chaque utilisateur doit être unique.");
    }

    if(!username){
        throw new Error("Le nom d'utilisateur est requis");
    }

    if(!password){
        throw new Error("Le mot de passe est requis");
    }

    if(!role){
        throw new Error("Le rôle est requis");
    }

    const updatedUser = await UserRepository.updateUser(id, { username, password, role });
    return updatedUser;
}

export async function deleteUser(id) {
    const user = await getUserById(id); // Vérifie si l'utilisateur existe
    if(!user){
        throw new Error("Utilisateur non trouvé");
    }

    await UserRepository.deleteUser(id);
    return user;
}