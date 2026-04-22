import database from '../config/database.js';
import responseFormat from '../helper/responseFormat.js';

async function createStore(req, res) {
  const q = 'insert into stores set ?';
  try {
    const [result] = await database.query(q, [req.body]);
    return responseFormat.sendResponseFormat(res, 201, 'Berhasil menambahkan store', { id: result.insertId });
  } catch (err) {
    return responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
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

    return responseFormat.sendResponseFormat(res, 200, rows.length === 0 ? 'Tidak ada data yang cocok dengan filter' : 'Berhasil ambil semua data store', rows, null, filterInfo, paginationInfo);
  } catch (err) {
    return responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

async function getStoreDetails(req, res) {
  const q = 'select * from stores where id = ?';
  try {
    const [result] = await database.query(q, [req.params.idStore]);
    if (result.length === 0) {
      return responseFormat.sendResponseFormat(res, 404, `Store dengan id ${req.params.idStore} tidak ditemukan`, null, 'NOT_FOUND');
    }
    return responseFormat.sendResponseFormat(res, 200, 'Berhasil mengambil detail store', result[0]);
  } catch (err) {
    return responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

async function updateStoreData(req, res) {
  const q = 'update stores set ? where id = ?';
  try {
    const [result] = await database.query(q, [req.body, req.params.idStore]);
    if (result.affectedRows === 0) {
      return responseFormat.sendResponseFormat(res, 404, `Store dengan id ${req.params.idStore} tidak ditemukan`, null, 'NOT_FOUND');
    }
    const [updated] = await database.query('SELECT * FROM stores WHERE id=?', [req.params.idStore])
    return responseFormat.sendResponseFormat(res, 200, 'Berhasil mengupdate data store', updated[0]);
  } catch (err) {
    return responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

async function deleteStore(req, res) {
  const { idStore } = req.params;
  const connection = await database.getConnection();

  try {
    const [store] = await connection.query(
      `SELECT * FROM stores WHERE id = ?`,
      [idStore]
    );

    if (store.length === 0) {
      return responseFormat.sendResponseFormat(
        res, 404,
        `Store dengan id ${idStore} tidak ditemukan`,
        null, 'NOT_FOUND'
      );
    }

    await connection.beginTransaction();

    // 1. Ambil semua id_order yang terdampak sebelum dihapus
    const [affectedOrders] = await connection.query(`
      SELECT DISTINCT op.id_order
      FROM order_products op
      JOIN store_products sp ON sp.id = op.id_store_product
      WHERE sp.id_store = ?`,
      [idStore]
    );

    // 2. Hapus order_products yang terkait store ini
    await connection.query(`
      DELETE op FROM order_products op
      JOIN store_products sp ON sp.id = op.id_store_product
      WHERE sp.id_store = ?`,
      [idStore]
    );

    // 3. Recalculate total_price order yang terdampak
    if (affectedOrders.length > 0) {
      const affectedIds = affectedOrders.map(o => o.id_order);
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

    // 4. Hapus store_products
    await connection.query(`DELETE FROM store_products WHERE id_store = ?`,[idStore]);

    // 5. Hapus store
    await connection.query(`DELETE FROM stores WHERE id = ?`,[idStore]);

    await connection.commit();

    responseFormat.sendResponseFormat( res, 200, `Berhasil menghapus store dengan id ${idStore}`, store[0]);

  } catch (err) {
    await connection.rollback();
    responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  } finally {
    connection.release();
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
