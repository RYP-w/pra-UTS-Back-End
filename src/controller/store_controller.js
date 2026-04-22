import database from '../config/database.js';
import { sendResponseFormat } from '../helper/responseFormat.js';

async function createStore(req, res) {
  const q = 'insert into stores set ?';
  try {
    const [result] = await database.query(q, [req.body]);
    return sendResponseFormat(res, 201, 'Berhasil menambahkan store', { id: result.insertId });
  } catch (err) {
    return sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

async function getAllStores(req, res) {
  try {
    const { name, address, page, limit } = req.query;

    const conditions = [];
    const values = [];

    if (name) {
      conditions.push('name LIKE ?');
      values.push(`%${name}%`);
    }

    if (address) {
      conditions.push('address LIKE ?');
      values.push(`%${address}%`);
    }

    let whereS = '';
    if (conditions.length > 0) {
      whereS = `WHERE ${conditions.join(' AND ')}`;
    }

    const [countResult] = await database.query(`SELECT COUNT(*) AS total FROM stores ${whereS}`, values);
    const totalData = countResult[0].total;

    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const offset = (currentPage - 1) * itemsPerPage;
    const totalPages = Math.ceil(totalData / itemsPerPage);

    const [rows] = await database.query(`SELECT * FROM stores ${whereS} LIMIT ? OFFSET ?`, [...values, itemsPerPage, offset]);

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

    return sendResponseFormat(res, 200, rows.length === 0 ? 'Tidak ada data yang cocok dengan filter' : 'Berhasil mengambil semua data store', rows, null, filterInfo, paginationInfo);
  } catch (err) {
    return sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

async function getStoreDetails(req, res) {
  const q = 'select * from stores where id = ?';
  try {
    const [result] = await database.query(q, [req.params.idStore]);
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateStoreData(req, res) {
  const q = 'update stores set ? where id = ?';
  try {
    const [result] = await database.query(q, [req.body, req.params.idStore]);
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteStore(req, res) {
  const q = 'delete from stores where id = ?';
  try {
    const [result] = await database.query(q, [req.params.idStore]);
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const storeController = {
  createStore,
  getAllStores,
  getStoreDetails,
  updateStoreData,
  deleteStore,
};

export default storeController;
