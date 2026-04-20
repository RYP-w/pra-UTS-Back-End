import database from '../config/database.js'

async function createOrder(req, res) {
    const q = "insert into orders set ?";
    try {
        const [result] = await database.query(q, [req.body]);
        res.send(result);
    } catch (err) {
        res.status(500).send({error: err.message});
    }
}

async function getAllOrders(req, res) {
    const q = "select * from orders;";
    try {
        const [result] = await database.query(q);
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

async function getOrder(req, res) {
    const q = "select * from orders where id = ?";
    try {
        const [result] = await database.query(q,[req.params.idOrder]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error:err.message});
    }
}

async function updateStatusOrder(req, res) {
    const q = "update orders set ? where id = ?";
    try {
        const [result] = await database.query(q, [req.body, req.params.idOrder]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function deleteOrder(req, res) {
    const q = "delete from orderss where id = ?";
    try {
        const [result] = await database.query(q, [req.params.idOrder]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

const productController = {
    createOrder,
    getAllOrders,
    getOrder,
    updateStatusOrder,
    deleteOrder
};

export default productController;