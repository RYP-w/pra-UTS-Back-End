import express from 'express';
import storeProductsRoutes from './routes_store_products.js'

const router = express.Router();

router.post('/', (req, res) => { //? Tambahkan toko
    res.status(200).json({message:"Tambahkan toko"});
});

router.get('/', async (req, res) => { //? Dapatkan semua toko
    res.status(200).json({message:"Dapatkan semua toko"});
});


router.get('/:id', (req, res) => { //? Dapatkan detail toko
    res.status(200).json({message:"Dapatkan detail toko"});
});

router.put('/:id', (req, res) => { //? Update data pada toko
    res.status(200).json({message:"Update data pada toko"});
});

router.delete('/:id', (req, res) => { //? Hapus toko
    res.status(200).json({message:"Hapus toko"});
});

router.use('/:id/products', storeProductsRoutes); //<?> [SUB-ROUTING] 


export default router;