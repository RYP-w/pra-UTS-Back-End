import database from '../config/database.js'

async function addProduct_to_order(req, res) {
    //[*] query ini masih belum di beri logic total_ptoce order yang bertambah sesuai dengan order_products yang di tambahkan
    const q = "insert into order_products set id_order = ?, ?";
    try {
        const [result] = await database.query(q, [req.params.idOrder, req.body]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function getAllProducts_in_Oorder(req, res) {
    const q = "select * from order_products where id_order = ?;";
    try {
        const [result] = await database.query(q, [req.params.idOrder]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function updateProductData_in_order(req, res) {
    //[*] query ini masih belum di beri logic untuk mengubah total price pada order ketika order_products <price/quantity> di ubah
    const q = "update order_products set ? where id_order = ? and id_store_product = ?";
    try {
        const [result] = await database.query(q, [req.body, req.params.idOrder, req.params.idProduct]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function removeProduct_from_order(req, res) {
    //[*] query ini masih belum di beri logic untuk mengubah total price pada order ketika order_products di hapus
    const q = "delete from order_products where id_order = ? and  id_store_product = ?";
    try {
        const [result] = await database.query(q, [req.params.idOrder, req.params.idProduct]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

const orderProductController = {
    addProduct_to_order,
    getAllProducts_in_Oorder,
    updateProductData_in_order,
    removeProduct_from_order,
};

export default orderProductController;