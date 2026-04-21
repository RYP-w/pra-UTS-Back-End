import database from '../config/database.js';
import { sendResponseFormat } from '../helper/responseFormat.js';

async function createProduct(req, res) {
  const q = 'insert into products set ?';
  try {
    const [result] = await database.query(q, [req.body]);
    return sendResponseFormat(res, 201, 'Berhasil menambahkan product', { id: result.insertId });
  } catch (err) {
    return sendResponseFormat(res, 500, 'Internal server error', null, err.message);
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

    return sendResponseFormat(res, 200, rows.length === 0 ? 'Tidak ada data yang cocok dengan filter' : 'Berhasil ambil semua data product', rows, null, filterInfo, paginationInfo);
  } catch (err) {
    return sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

async function getProductDetail(req, res) {
  const q = 'select * from products where id = ?';
  try {
    const [result] = await database.query(q, [req.params.idProduct]);
    if (result.length === 0) {
      return sendResponseFormat(res, 404, `Product dengan id ${req.params.idProduct} tidak ditemukan`, null, 'NOT_FOUND');
    }
    return sendResponseFormat(res, 200, 'Berhasil ambil detail product', result[0]);
  } catch (err) {
    return sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

async function updateProductData(req, res) {
  const q = 'update products set ? where id = ?';
  try {
    const [result] = await database.query(q, [req.body, req.params.idProduct]);
    if (result.affectedRows == 0) {
      return sendResponseFormat(res, 404, `Product dengan id ${req.params.idProduct} tidak ditemukan`, null, 'NOT_FOUND');
    }
    return sendResponseFormat(res, 200, 'Berhasil update data product', null);
  } catch (err) {
    sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

async function deleteProduct(req, res) {
  const q = 'delete from products where id = ?';
  try {
    const [result] = await database.query(q, [req.params.idProduct]);
    if (result.affectedRows == 0) {
      return sendResponseFormat(res, 404, `Product dengan id ${req.params.idProduct} tidak ditemukan`, null, 'NOT_FOUND');
    }
    return sendResponseFormat(res, 200, `Berhasil menghapus product dengan id ${req.params.idProduct}`, null);
  } catch (err) {
    return sendResponseFormat(res, 500, 'Internal server error', null, err.message);
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
