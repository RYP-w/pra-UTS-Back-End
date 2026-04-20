import database from '../config/database.js';

async function addProduct_To_Store(req, res) {
    const q = "insert into store_products set id_store = ?, ?";
    try {
        const [result] = await database.query(q, [req.params.idStore, req.body]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function getAllProducts_In_Store(req, res) {
    //[*] mungkin bisa di coba untuk menampilkan juga nama dan deskripsi dari produknya, bukan hanya id saja
    const q = "select * from store_products where id_store = ?";
    try {
        const [result] = await database.query(q, [req.params.idStore]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function getProductDetails_In_Store(req, res) {
    //[*] mungkin bisa di coba untuk menampilkan juga nama dan deskripsi dari produknya, bukan hanya id saja
    const q = "select * from store_products where id_store = ? and  id_product = ?;";
    try {
        const [result] = await database.query(q, [req.params.idStore, req.params.idProduct]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function updateProductData_In_Store(req, res) {
    //! yang bisa di ubah hanya <price, quantity>
    const q = "update store_products set ? where id_store = ? and id_product = ?;";
    try {
        const [result] = await database.query(q, [req.body, req.params.idStore, req.params.idProduct]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function removeProduct_From_Store(req, res) {
    const q = "delete from store_products where id_store = ? and id_product = ?;";
    try {
        const [result] = await database.query(q, [req.body, req.params.idStore, req.params.idProduct]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

const storeProductController = {
    addProduct_To_Store,
    getAllProducts_In_Store,
    getProductDetails_In_Store,
    updateProductData_In_Store,
    removeProduct_From_Store
};

export default storeProductController;