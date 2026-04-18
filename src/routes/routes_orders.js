import express from 'express';
import orderProductsRoutes from './routes_order_products.js';

const router = express.Router();

router.post('/', (req, res) => { //? Buat order
    res.status(200).json({message:"Buat order"});
});

router.get('/', (req, res) => { //? Dapatkan semua order
    res.status(200).json({message:"Dapatkan semua order"});
});

router.get('/:id', (req, res) => { //? Dapatkan detail order
    res.status(200).json({message:"Dapatkan detail order"});
});

router.put('/:id/status', (req, res) => { //? Update status order
    res.status(200).json({message:"Update status order"});
});

router.delete('/:id', (req, res) => { //? Hapus order
    res.status(200).json({message:"Hapus order"});
})

router.use(':id/products', orderProductsRoutes) //<?> [SUB-ROUTING] 

export default router;