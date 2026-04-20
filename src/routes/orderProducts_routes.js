import express from 'express';
import orderProductsController from '../controller/orderProducts_controller.js';
import database from '../config/database.js';

const router = express.Router({ mergeParams: true });

router.post('/', orderProductsController.addProduct_to_order); //? Tambahkan produk pada order
router.get('/', orderProductsController.getAllProducts_in_Oorder); //? Dapatkan semua produk pada order
router.put('/:idProduct', orderProductsController.updateProductData_in_order); //? Update data pada produk di order
router.delete('/:idProduct', orderProductsController.removeProduct_from_order); //? Hapus produk pada order

export default router;
