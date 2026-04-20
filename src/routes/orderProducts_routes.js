import express from 'express';
import orderProductsController from '../controller/orderProducts_controller.js';
import database from '../config/database.js';
import guard from '../guard/guard.js';

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => { //? Tambahkan produk pada order
    guard.setGuard(req, res, {required:{"id_store_product":"number", "quantity":"number"}, optional:{}});
    orderProductsController.addProduct_to_order(req, res);
}); 

router.get('/', orderProductsController.getAllProducts_in_Oorder); //? Dapatkan semua produk pada order

router.put('/:idProduct', async (req, res) => { //? Update data pada produk di order
    guard.setGuard(req, res, {required:{}, optional:{"quantity":"number"}});
    orderProductsController.updateProductData_in_order(req, res);
}); 

router.delete('/:idProduct', orderProductsController.removeProduct_from_order); //? Hapus produk pada order

export default router;
