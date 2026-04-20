import express from 'express';
import productController from '../controller/productController.js';
import database from '../config/database.js';

const router = express.Router();

router.post('/', productController.createProduct); //? Tambahkan produk
router.get('/', productController.getAllProducts); //? Dapatkan semua produk
router.get('/:idProduct', productController.getProductDetail); //? Dapatkan detail produk
router.put('/:idProduct', productController.updateProductData); //? Update data pada produk
router.delete('/:idProduct', productController.deleteProduct); //? Hapus produk

export default router;
