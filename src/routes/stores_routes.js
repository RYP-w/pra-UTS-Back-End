import express from 'express';
import storeController from '../controller/storeController.js';
import database from '../config/database.js';
import storeProductsRoutes from './storeProducts_routes.js';

const router = express.Router();

router.post('/', storeController.createStore); //? Tambahkan toko
router.get('/', storeController.getAllStores); //? Dapatkan semua toko
router.get('/:idStore', storeController.getStoreDetails); //? Dapatkan detail toko
router.put('/:idStore', storeController.updateStoreData); //? Update data pada toko
router.delete('/:idStore', storeController.deleteStore); //? Hapus toko
router.use('/:idStore/products', storeProductsRoutes); //<?> [SUB-ROUTING]

export default router;
