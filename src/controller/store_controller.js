import database from '../config/database.js';

async function createStore(req, res) {
    const q = "insert into stores set ?";
    try {
        const [result] = await database.query(q, [req.body]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function getAllStores(req, res) {
    const q = "select * from stores";
    try {
        const [result] = await database.query(q);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function getStoreDetails(req, res) {
    const q = "select * from stores where id = ?";
    try {
        const [result] = await database.query(q, [req.params.idStore]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function updateStoreData(req, res) {
    const q = "update stores set ? where id = ?";
    try {
        const [result] = await database.query(q, [req.body, req.params.idStore]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function deleteStore(req, res) {
    const q = "delete from stores where id = ?";
    try {
        const [result] = await database.query(q, [req.params.idStore]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

const storeController = {
    createStore,
    getAllStores,
    getStoreDetails,
    updateStoreData,
    deleteStore
};

export default storeController;