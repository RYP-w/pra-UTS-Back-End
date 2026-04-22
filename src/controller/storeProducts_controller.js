import database from '../config/database.js';
import responseFormat from '../helper/responseFormat.js';

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
    const q = "select * from store_products where id_store = ?";
    try {
        const [result] = await database.query(q, [req.params.idStore]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function getProductDetails_In_Store(req, res) {
    const q = "select * from store_products where id_store = ? and  id_product = ?;";
    try {
        const [result] = await database.query(q, [req.params.idStore, req.params.idProduct]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function updateProductData_In_Store(req, res) {
    const q = "update store_products set ? where id_store = ? and id_product = ?;";
    try {
        const [result] = await database.query(q, [req.body, req.params.idStore, req.params.idProduct]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function removeProduct_From_Store(req, res) {
    const { idStore, idProduct } = req.params;
    const connection = await database.getConnection();

    try {
        const [storeProduct] = await connection.query(
            `SELECT * FROM store_products WHERE id_store = ? AND id_product = ?`,
            [idStore, idProduct]
        );

        if (storeProduct.length === 0) {
            return responseFormat.sendResponseFormat(
                res, 404,
                `Produk tidak ditemukan di toko ini`,
                null, 'NOT_FOUND'
            );
        }

        await connection.beginTransaction();

        // 1. Ambil semua id_order yang terdampak sebelum dihapus
        const [affectedOrders] = await connection.query(`SELECT DISTINCT id_order FROM order_products WHERE id_store_product = ?`, [storeProduct[0].id]);

        // 2. Hapus order_products yang mereferensikan store_product ini
        await connection.query(`DELETE FROM order_products WHERE id_store_product = ?`,[storeProduct[0].id]);

        // 3. Recalculate total_price order yang terdampak
        if (affectedOrders.length > 0) {const affectedIds = affectedOrders.map(o => o.id_order);
            await connection.query(`
                UPDATE orders
                SET total_price = (
                    SELECT COALESCE(SUM(price * quantity), 0)
                    FROM order_products
                    WHERE id_order = orders.id
                )
                WHERE id IN (?)`,
                [affectedIds]
            );
        }

        // 4. Hapus store_product
        await connection.query( `DELETE FROM store_products WHERE id_store = ? AND id_product = ?`, [idStore, idProduct]);

        await connection.commit();

        return responseFormat.sendResponseFormat( res, 200, `Berhasil menghapus produk dari toko`, storeProduct[0]);

    } catch (err) {
        await connection.rollback();
        return responseFormat.sendResponseFormat( res, 500, 'Internal server error', null, err.message);
    } finally {
        connection.release();
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