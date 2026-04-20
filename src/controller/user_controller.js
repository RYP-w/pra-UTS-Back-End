import database from '../config/database.js'
import responseFormat from '../helper/responseFormat.js'

async function createUser(req, res) {
    const q = "insert into users set ?";
    try {
        const [result] = await database.query(q, [req.body]);
        res.send(result);
    } catch (err) {
        res.status(500).send({error: err.message});
    }
}

async function getAllUsers(req, res) {
    const q = "select * from users;";
    try {
        const [result] = await database.query(q);
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

async function getUserDetail(req, res) {
    const q = "select * from users where id = ?";
    try {
        const [result] = await database.query(q,[req.params.idUser]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error:err.message});
    }
}

async function updateUserData(req, res) {
    const q = "update users set ? where id = ?";
    try {
        const [result] = await database.query(q, [req.body, req.params.idUser]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function deleteUser(req, res) {
    const q = "delete from users where id = ?";
    try {
        const [result] = await database.query(q, [req.params.idUser]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

const userController = {
    createUser,
    getAllUsers,
    getUserDetail,
    updateUserData,
    deleteUser
};

export default userController;