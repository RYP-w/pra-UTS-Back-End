import database from '../config/database.js'

async function createProduct(req, res) {
    const q = "insert into products set ?";
    try {
        const [result] = await database.query(q, [req.body]);
        res.send(result);
    } catch (err) {
        res.status(500).send({error: err.message});
    }
}

async function getAllProducts(req, res) {
    const q = "select * from products;";
    try {
        const [result] = await database.query(q);
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

async function getProductDetail(req, res) {
    const q = "select * from products where id = ?";
    try {
        const [result] = await database.query(q,[req.params.idProduct]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error:err.message});
    }
}

async function updateProductData(req, res) {
    const q = "update products set ? where id = ?";
    try {
        const [result] = await database.query(q, [req.body, req.params.idProduct]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function deleteProduct(req, res) {
    const q = "delete from products where id = ?";
    try {
        const [result] = await database.query(q, [req.params.idProduct]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

const productController = {
    createProduct,
    getAllProducts,
    getProductDetail,
    updateProductData,
    deleteProduct
};

export default productController;