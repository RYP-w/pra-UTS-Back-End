import express from 'express';

const router = express.Router();

router.post('/', (req, res) => { //? Tambahkan item pada order
    res.status(200).json({message:"Tambahkan item pada order"});
});

router.get('/', (req, res) => { //? Dapatkan semua item pada order
    res.status(200).json({message:"Dapatkan semua item pada order"});
});

router.put('/:itemId', (req, res) => { //? Update data pada item di order
    res.status(200).json({message:"Update data pada item di order"});
});

router.delete('/:itemsId', (req, res) => { //? Hapus item pada order
    res.status(200).json({message:"Hapus item pada order"});
});


export default router;