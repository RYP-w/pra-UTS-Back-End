import express from 'express';
import storeProductController from '../controller/storeProducts_controller.js';
import database from '../config/database.js';
import guard from '../guard/guard.js';

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
    guard.setGuard(req, res, {required:{"price":"number", "quantity":"number"}, optional:{}});
    storeProductController.addProduct_To_Store(req, res);
}) //? Tambahkan produk pada toko

router.get('/', storeProductController.getAllProducts_In_Store) //? Dapatkan semua produk pada toko

router.get('/:idProduct', storeProductController.getProductDetails_In_Store) //? Dapatkan detail pada produk di toko

router.put('/:idProduct', async (req, res) => {
    guard.setGuard(req, res, {required:{}, optional:{"price":"number", "quantity":"number"}});
    storeProductController.updateProductData_In_Store(req, res);
}) //? Update data pada produk di toko

router.delete('/:idProduct', storeProductController.removeProduct_From_Store) //? Hapus produk pada toko

export default router;
