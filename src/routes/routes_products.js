import express from 'express';

const router = express.Router();

router.post('/', (req, res) => { //? Tambahkan produk
    res.status(200).json({message:"Tambahkan produk"});
});

router.get('/', async (req, res) => { //? Dapatkan semua produk
    res.status(200).json({message:"Dapatkan semua produk"});
});

router.get('/:id', (req, res) => { //? Dapatkan detail produk
    res.status(200).json({message:"Dapatkan detail produk"});
});

router.put('/:id', (req, res) => { //? Update data pada produk
    res.status(200).json({message:"Update data pada produk"});
});

router.delete('/:id', (req, res) => { //? Hapus produk
    res.status(200).json({message:"Hapus produk"});
});


export default router;