import express from 'express';

const router = express.Router();

router.post('/', (req, res) => { //? Tambahkan produk pada toko
    res.status(200).json({message:"Tambahkan produk pada toko"});
});

router.get('/', (req, res) => { //? Dapatkan semua produk pada toko
    res.status(200).json({message:"Dapatkan semua produk pada toko"});
});

router.get('/:productId', (req, res) => { //? Dapatkan detail pada produk
    res.status(200).json({message:"Dapatkan detail pada produk"});
});

router.put('/:productId', (req, res) => { //? Update data pada produk di toko
    res.status(200).json({message:"Update data pada produk di toko"});
});

router.delete('/:productId', (req, res) => { //? Hapus produk pada toko
    res.status(200).json({message:"Hapus produk pada toko"});
});

export default router;