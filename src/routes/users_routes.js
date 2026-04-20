import express from 'express';
import userController from '../controller/user_controller.js';
import database from '../config/database.js';
import guard from '../guard/guard.js';

const router = express.Router();

router.post('/', async (req, res) => { //? Tambahkan user
    if (guard.setGuard(req, res, {required:{"name":"string", "address":"string", "email":"string"}, optional:{}})) {
        return;
    }
    userController.createUser(req, res);
}); 

router.get('/', userController.getAllUsers); //? Dapatkan semua user

router.get('/:idUser', userController.getUserDetail); //? Dapatkan detail user

router.put('/:idUser', async (req, res) => { //? Update data pada user
    if (guard.setGuard(req, res, {required:{}, optional:{"name":"string", "address":"string", "email":"string"}})) {
        return;
    }
    userController.updateUserData(req, res);
}); 

router.delete('/:idUser', userController.deleteUser); //? Hapus user

export default router;
