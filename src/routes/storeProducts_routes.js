import express from 'express';
import storeProductController from '../controller/storeProducts_controller.js'
import database from '../config/database.js'

const router = express.Router({mergeParams:true});

router.post('/', storeProductController.addProduct_To_Store) //? Tambahkan produk pada toko
router.get('/', storeProductController.getAllProducts_In_Store) //? Dapatkan semua produk pada toko
router.get('/:idProduct', storeProductController.getProductDetails_In_Store) //? Dapatkan detail pada produk di toko
router.put('/:idProduct', storeProductController.updateProductData_In_Store) //? Update data pada produk di toko
router.delete('/:idProduct', storeProductController.removeProduct_From_Store) //? Hapus produk pada toko

export default router;