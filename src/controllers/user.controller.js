import { UserService } from "../services/index.service.js";

export async function getAllUsers(req, res){
    try {
        const users = await UserService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function createUser(req, res) {
    try {
        const { username, password, role } = req.body;
        const newUser = await UserService.createUser({ username, password, role });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { username, password, role } = req.body;
        const updatedUser = await UserService.updateUser(id, { username, password, role });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const deletedUser = await UserService.deleteUser(id);
        res.json(deletedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}