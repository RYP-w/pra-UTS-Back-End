import express from 'express';
import productController from '../controller/product_controller.js';
import database from '../config/database.js';
import guard from '../guard/guard.js';

const router = express.Router();


router.post('/', async (req, res) => { //? Tambahkan produk
    guard.setGuard(req, res, {required:{"name":"string","description":"string"}, optional:{}});
    productController.createProduct(req, res);
}) 

router.get('/', productController.getAllProducts) //? Dapatkan semua produk

router.get('/:idProduct', productController.getProductDetail) //? Dapatkan detail produk

router.put('/:idProduct', async (req, res) => { //? Update data pada produk
    guard.setGuard(req, res, {required:{}, optional:{"name":"string","description":"string"}});
    productController.updateProductData(req, res);
}) 

router.delete('/:idProduct', productController.deleteProduct) //? Hapus produk


export default router;
