import database from '../config/database.js';
import responseFormat from '../helper/responseFormat.js';

// createUser untuk buat user baru
async function createUser(req, res) {
    const q = 'insert into users set ?'; // command sql nya
    try {
        const [result] = await database.query(q, [req.body]); // ambil data dari body
        return responseFormat.sendResponseFormat(res, 201, 'Berhasil menambahkan user', { id: result.insertId });
    } catch (err) {
        return responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
    }
}

// getAllUser untuk dapatkan semua data user, ada include filter dan pagination
async function getAllUsers(req, res) {
    try {
        const { name, address, page, limit } = req.query; // ambil name, address, page, limit dari query

        const conditions = [];
        const values = [];

        if (name) {
            conditions.push('name LIKE ?');
            values.push(`%${name}%`); // cari name
        }

        if (address) {
            conditions.push('address LIKE ?');
            values.push(`%${address}%`); // cari address
        }

        // command where
        let whereS = '';
        if (conditions.length > 0) {
            whereS = `WHERE ${conditions.join(' AND ')}`; // penambahan command sql
        }

        const [countResult] = await database.query(`SELECT COUNT(*) AS total FROM users ${whereS}`, values); // sql
        const totalData = countResult[0].total; // total semua data orang di database

        const currentPage = parseInt(page) || 1; // halaman sekarang, defaultnya 1
        const itemsPerPage = parseInt(limit) || 10; //  jumlah item per halaman, defaultnya 10
        const offset = (currentPage - 1) * itemsPerPage; // data keberapa yang harus diambil?
        const totalPages = Math.ceil(totalData / itemsPerPage); // logika menghitung total halaman

        // ambil data sesuai apa yang diinginkan user
        const [rows] = await database.query(`SELECT * FROM users ${whereS} LIMIT ? OFFSET ?`, [...values, itemsPerPage, offset]);

        const filterInfo = {
            name: name || null,
            address: address || null,
        };

        const paginationInfo = {
            current_page: currentPage,
            items_per_page: itemsPerPage,
            total_data: totalData,
            total_pages: totalPages,
            next_page: currentPage < totalPages,
            prev_page: currentPage > 1,
        };

        return responseFormat.sendResponseFormat(res, 200, 'Berhasil mengambil semua data user', rows, null, filterInfo, paginationInfo);
    } catch (err) {
        return responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
    }
}

async function getUserDetail(req, res) {
    const q = 'select * from users where id = ?';
    try {
        const [result] = await database.query(q, [req.params.idUser]);
        if (result.length === 0) {
        return responseFormat.sendResponseFormat(res, 404, `User dengan id ${req.params.idUser} tidak ditemukan`, null, 'NOT_FOUND');
        }
        return responseFormat.sendResponseFormat(res, 200, 'Berhasil mengambil detail user', result[0]);
    } catch (err) {
        return responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
    }
}

async function updateUserData(req, res) {
    const q = 'update users set ? where id = ?';
    try {
        const [result] = await database.query(q, [req.body, req.params.idUser]);
        if (result.affectedRows === 0) {
        return responseFormat.sendResponseFormat(res, 404, `User dengan id ${req.params.idUser} tidak ditemukan`, null, 'NOT_FOUND');
        }
        return responseFormat.sendResponseFormat(res, 200, 'Berhasil mengupdate data user', null);
    } catch (err) {
        return responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
    }
}

async function deleteUser(req, res) {
    const q = 'delete from users where id = ?';
    try {
        const [result] = await database.query(q, [req.params.idUser]);
        if (result.affectedRows === 0) {
        return responseFormat.sendResponseFormat(res, 404, `User dengan id ${req.params.idUser} tidak ditemukan`, null, 'NOT_FOUND');
        }
        return responseFormat.sendResponseFormat(res, 200, `Berhasil menghapus user dengan id ${req.params.idUser}`, null);
    } catch (err) {
        return responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
    }
}

const userController = {
    createUser,
    getAllUsers,
    getUserDetail,
    updateUserData,
    deleteUser,
};

export default userController;
