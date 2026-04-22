import database from '../config/database.js';
import responseFormat from '../helper/responseFormat.js';

async function createOrder(req, res) {
    const q = 'insert into orders set ?';
    try {
        const [result] = await database.query(q, [req.body]);
        return responseFormat.sendResponseFormat(res, 201, 'Berhasil menambahkan order', { id: result.insertId });
    } catch (err) {
        return responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
    }
}

const VALID_STATUS = ['pending', 'proses', 'dikirim', 'selesai'];

async function getAllOrders(req, res) {
    try {
        const { status, id_user, page, limit } = req.query;

        // Validasi status jika dikirim
        if (status && !VALID_STATUS.includes(status)) {
            return responseFormat.sendResponseFormat(res, 400, `Status tidak valid. Gunakan salah satu dari: ${VALID_STATUS.join(', ')}`, null, 'BAD_REQUEST');
        }

        const conditions = [];
        const values = [];

        if (status) {
            conditions.push('o.status = ?');
            values.push(status); // status harus exact match, bukan LIKE
        }

        if (id_user) {
            conditions.push('o.id_user = ?');
            values.push(id_user);
        }

        let whereS = '';
        if (conditions.length > 0) {
            whereS = `WHERE ${conditions.join(' AND ')}`;
        }

        const [countResult] = await database.query(`SELECT COUNT(*) AS total FROM orders o ${whereS}`, values);
        const totalData = countResult[0].total;

        const currentPage = parseInt(page) || 1;
        const itemsPerPage = parseInt(limit) || 10;
        const offset = (currentPage - 1) * itemsPerPage;
        const totalPages = Math.ceil(totalData / itemsPerPage);

        // JOIN ke users supaya nama user ikut tampil
        const [rows] = await database.query(
        `SELECT 
            o.id,
            o.id_user,
            u.name  AS user_name,
            o.date,
            o.status,
            o.total_price
        FROM orders o
        JOIN users u ON o.id_user = u.id
        ${whereS}
        ORDER BY o.date DESC
        LIMIT ? OFFSET ?`,
        [...values, itemsPerPage, offset],
        );

        const filterInfo = {
        status: status || null,
        id_user: id_user || null,
        };

        const paginationInfo = {
        current_page: currentPage,
        items_per_page: itemsPerPage,
        total_data: totalData,
        total_pages: totalPages,
        next_page: currentPage < totalPages,
        prev_page: currentPage > 1,
        };

        return responseFormat.sendResponseFormat(res, 200, rows.length === 0 ? 'Tidak ada data yang cocok dengan filter' : 'Berhasil mengambil semua data order', rows, null, filterInfo, paginationInfo);
    } catch (err) {
        return responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
    }
}

async function getOrder(req, res) {
    const q = `
        SELECT 
        o.id,
        o.id_user,
        u.name  AS user_name,
        o.date,
        o.status,
        o.total_price
        FROM orders o
        JOIN users u ON o.id_user = u.id
        WHERE o.id = ?`;
    try {
        const [result] = await database.query(q, [req.params.idOrder]);
        if (result.length === 0) {
            return responseFormat.sendResponseFormat(res, 404, `Order dengan id ${req.params.idOrder} tidak ditemukan`, null, 'NOT_FOUND');
        }
        return responseFormat.sendResponseFormat(res, 200, 'Berhasil mengambil detail order', result[0]);
    } catch (err) {
        return responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
    }
}

async function updateStatusOrder(req, res) {
    // Validasi status jika dikirim di body
    if (req.body.status && !VALID_STATUS.includes(req.body.status)) {
        return responseFormat.sendResponseFormat(res, 400, `Status tidak valid. Gunakan salah satu dari: ${VALID_STATUS.join(', ')}`, null, 'BAD_REQUEST');
    }

    const q = 'update orders set ? where id = ?';
    try {
        const [result] = await database.query(q, [req.body, req.params.idOrder]);
        if (result.affectedRows === 0) {
            return responseFormat.sendResponseFormat(res, 404, `Order dengan id ${req.params.idOrder} tidak ditemukan`, null, 'NOT_FOUND');
        }
        return responseFormat.sendResponseFormat(res, 200, 'Berhasil mengupdate status order', null);
    } catch (err) {
        return responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
    }
}

async function deleteOrder(req, res) {
    const id_order = req.params.idOrder;
    const connection = await database.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Hapus semua order_products yang berelasi dulu (karena ada foreign key)
        await connection.query('DELETE FROM order_products WHERE id_order = ?', [id_order]);

        // 2. hapus order
        const [result] = await connection.query('DELETE FROM orders WHERE id = ?', [id_order]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return responseFormat.sendResponseFormat(res, 404, `Order dengan id ${id_order} tidak ditemukan`, null, 'NOT_FOUND');
        }

        await connection.commit();
        return responseFormat.sendResponseFormat(res, 200, `Berhasil menghapus order dengan id ${id_order}`, null);
    } catch (err) {
        await connection.rollback();
        return responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
    } finally {
        connection.release();
    }
}

const orderController = {
    createOrder,
    getAllOrders,
    getOrder,
    updateStatusOrder,
    deleteOrder,
};

export default orderController;
