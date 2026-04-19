import express from 'express';
import userController from '../controller/user_controller.js'
import database from '../config/database.js';

const router = express.Router();

router.post('/', userController.createUser); //? Tambahkan user
router.get('/', userController.getAllUsers); //? Dapatkan semua user
router.get('/:idUser', userController.getUserDetail); //? Dapatkan detail user
router.put('/:idUser', userController.updateUserData); //? Update data pada user
router.delete('/:idUser', userController.deleteUser); //? Hapus user

export default router;