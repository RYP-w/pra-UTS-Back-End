import express from 'express';
import storeController from '../controller/store_controller.js';
import database from '../config/database.js';
import storeProductsRoutes from './storeProducts_routes.js';
import guard from '../guard/guard.js';

const router = express.Router();

router.post('/', async (req, res) => { //? Tambahkan toko
    if (!guard.setGuard(req, res, {required:{"name":"string","address":"string"}, optional:{}})) {
        return;
    }
    storeController.createStore(req, res);
});

router.get('/', storeController.getAllStores); //? Dapatkan semua toko

router.get('/:idStore', storeController.getStoreDetails); //? Dapatkan detail toko

router.put('/:idStore', async (req, res) => { //? Update data pada toko
    if (!guard.setGuard(req, res, {required:{}, optional:{"name":"string","address":"string"}})) {
        return;
    }
    storeController.updateStoreData(req, res);
});

router.delete('/:idStore', storeController.deleteStore); //? Hapus toko

router.use('/:idStore/products', storeProductsRoutes); //<?> [SUB-ROUTING] 

export default router;
