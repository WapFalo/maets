import { write } from "fs";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { json } from "sequelize";

const FILE_PATH = "./users.json";

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

export async function createUser({ username, password, role }) {
    const users = await readJSONFile();
    if (username && await userExists(username)) {
        throw new Error("Nom d'utilisateur déjà utilisé. Chaque utilisateur doit être unique.");
    }

    const newUser = { id: uuidv4(), username, password, role };
    users.push(newUser);
    await writeJSONFile(users);
    return newUser;
}

export async function updateUser(id, updates){
    const users = await readJSONFile();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) return null;

    if (updates.username) {
        if(updates.username && await userExists(updateUser.username)){
            throw new Error("Nom d'utilisateur déjà utilisé. Chaque utilisateur doit être unique.");
        }
    }
    users[userIndex] = {...users[userIndex], ...updates};
    await writeJSONFile(users);
    return users[userIndex];
}

export async function deleteUser(id){
    const users = await readJSONFile();
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) return null;

    const [deletedUser] = users.splice(userIndex, 1)[0];
    await writeJSONFile(users);
    return deletedUser;
}

export async function getUserById(id) {
    const users = await readJSONFile();
    return users.find((user) => user.id === id) || null;
}

export async function getAllUsers() {
    return await readJSONFile();
}

export async function userExists(username) {
    const users = await readJSONFile();
    return users.some((user) => user.username === username);
}