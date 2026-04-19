import express from 'express';
import orderProductController from '../controller/orderProducts_controller.js'
import database from '../config/database.js'

const router = express.Router({mergeParams:true});

router.post('/', orderProductController.addProduct_to_order) //? Tambahkan produk pada order
router.get('/', orderProductController.getAllProducts_in_Oorder) //? Dapatkan semua produk pada order
router.put('/:idProduct', orderProductController.updateProductData_in_order) //? Update data pada produk di order
router.delete('/:idProduct', orderProductController.removeProduct_from_order) //? Hapus produk pada order

export default router;