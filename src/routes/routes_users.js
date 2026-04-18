import express from 'express';

const router = express.Router();

router.post('/', (req, res) => { //? Tambahkan user
    res.status(200).json({message:"Tambahkan user"});
});

router.get('/', async (req, res) => { //? Dapatkan semua user
    res.status(200).json({message:"Dapatkan semua user"});
});

router.get('/:id', (req, res) => { //? Dapatkan detail user
    res.status(200).json({message:"Dapatkan detail user"});
});

router.put('/:id', (req, res) => { //? Update data user
    res.status(200).json({message:"Update data user"});
});

router.delete('/:id', (req, res) => { //? Hapus user
    res.status(200).json({message:"Hapus user"});
});


export default router;