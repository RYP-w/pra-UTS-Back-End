import express from 'express';
import orderController from '../controller/order_controller.js';
import database from '../config/database.js';
import orderProductsRoutes from './orderProducts_routes.js';
import guard from '../guard/guard.js';

const router = express.Router();


router.post('/', async (req, res) => { //? Buat order
    if (!guard.setGuard(req, res, {required:{"id_user":"number","status":"string"}, optional:{}})) {
        return;
    }
    orderController.createOrder(req, res);
}); 

router.get('/', orderController.getAllOrders); //? Dapatkan semua order

router.get('/:idOrder', orderController.getOrder); //? Dapatkan detail order

router.put('/:idOrder/status', async (req, res) => { //? Update status order
    if (!guard.setGuard(req, res, {required:{}, optional:{"status":"string"}})) {
        return;
    }
    orderController.updateStatusOrder(req, res);
}); 

router.delete('/:idOrder', orderController.deleteOrder); //? Hapus order

router.use('/:idOrder/products', orderProductsRoutes); //<?> [SUB-ROUTING]


export default router;
