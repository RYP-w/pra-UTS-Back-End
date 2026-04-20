import express from 'express';
import orderController from '../controller/orderController.js';
import database from '../config/database.js';
import orderProductsRoutes from './orderProducts_routes.js';

const router = express.Router();

router.post('/', orderController.createOrder); //? Buat order
router.get('/', orderController.getAllOrders); //? Dapatkan semua order
router.get('/:idOrder', orderController.getOrder); //? Dapatkan detail order
router.put('/:idOrder/status', orderController.updateStatusOrder); //? Update status order
router.delete('/:idOrder', orderController.deleteOrder); //? Hapus order
router.use('/:idOrder/products', orderProductsRoutes); //<?> [SUB-ROUTING]

export default router;
