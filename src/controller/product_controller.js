import database from '../config/database.js';
import responseFormat from '../helper/responseFormat.js';

async function createProduct(req, res) {
  const q = 'insert into products set ?';
  try {
    const [result] = await database.query(q, [req.body]);
    return responseFormat.sendResponseFormat(res, 201, 'Berhasil menambahkan product', { id: result.insertId });
  } catch (err) {
    return responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

async function getAllProducts(req, res) {
  try {
    const { name, page, limit } = req.query;

    const conditions = [];
    const values = [];

    if (name) {
      conditions.push('name LIKE ?');
      values.push(`%${name}%`);
    }

    let whereS = '';
    if (conditions.length > 0) {
      whereS = `WHERE ${conditions.join(' AND ')}`;
    }

    const [countResult] = await database.query(`SELECT COUNT(*) AS total FROM products ${whereS}`, values);
    const totalData = countResult[0].total;

    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const offset = (currentPage - 1) * itemsPerPage;
    const totalPages = Math.ceil(totalData / itemsPerPage);

    const [rows] = await database.query(`SELECT * FROM products ${whereS} LIMIT ? OFFSET ?`, [...values, itemsPerPage, offset]);

    const filterInfo = {
      name: name || null,
    };

    const paginationInfo = {
      current_page: currentPage,
      items_per_page: itemsPerPage,
      total_data: totalData,
      total_pages: totalPages,
      next_page: currentPage < totalPages,
      prev_page: currentPage > 1,
    };

    return responseFormat.sendResponseFormat(res, 200, rows.length === 0 ? 'Tidak ada data yang cocok dengan filter' : 'Berhasil ambil semua data product', rows, null, filterInfo, paginationInfo);
  } catch (err) {
    return responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

async function getProductDetail(req, res) {
  const q = 'select * from products where id = ?';
  try {
    const [result] = await database.query(q, [req.params.idProduct]);
    if (result.length === 0) {
      return responseFormat.sendResponseFormat(res, 404, `Product dengan id ${req.params.idProduct} tidak ditemukan`, null, 'NOT_FOUND');
    }
    return responseFormat.sendResponseFormat(res, 200, 'Berhasil ambil detail product', result[0]);
  } catch (err) {
    return responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

async function updateProductData(req, res) {
  const q = 'update products set ? where id = ?';
  try {
    const [result] = await database.query(q, [req.body, req.params.idProduct]);
    if (result.affectedRows == 0) {
      return responseFormat.sendResponseFormat(res, 404, `Product dengan id ${req.params.idProduct} tidak ditemukan`, null, 'NOT_FOUND');
    }
    return responseFormat.sendResponseFormat(res, 200, 'Berhasil update data product', null);
  } catch (err) {
    responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

async function deleteProduct(req, res) {
  const { idProduct } = req.params;
  const connection = await database.getConnection();

  try {
    const [product] = await connection.query(
      `SELECT * FROM products WHERE id = ?`,
      [idProduct]
    );

    if (product.length === 0) {
      return responseFormat.sendResponseFormat(res, 404,`Product dengan id ${idProduct} tidak ditemukan`,null, 'NOT_FOUND');
    }

    await connection.beginTransaction();

    // 1. Ambil semua id_order yang terdampak sebelum dihapus
    const [affectedOrders] = await connection.query(`
      SELECT DISTINCT op.id_order
        FROM order_products op
        JOIN store_products sp ON sp.id = op.id_store_product
        WHERE sp.id_product = ?`,
      [idProduct]
    );

    // 2. Hapus order_products yang terkait produk ini
    await connection.query(`
      DELETE op FROM order_products op
        JOIN store_products sp ON sp.id = op.id_store_product
        WHERE sp.id_product = ?`,
      [idProduct]
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

    // 4. Hapus store_products yang terkait produk ini
    await connection.query(`DELETE FROM store_products WHERE id_product = ?`,[idProduct]);

    // 5. Hapus produk
    await connection.query(`DELETE FROM products WHERE id = ?`,[idProduct]);

    await connection.commit();

    return responseFormat.sendResponseFormat(res, 200,`Berhasil menghapus product dengan id ${idProduct}`,product[0]);

  } catch (err) {
    await connection.rollback();
    return responseFormat.sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  } finally {
    connection.release();
  }
}

const productController = {
  createProduct,
  getAllProducts,
  getProductDetail,
  updateProductData,
  deleteProduct,
};

export default productController;
