import database from '../config/database.js';
import { sendResponseFormat } from '../helper/responseFormat.js';

const SELECT_STORE_PRODUCT = `
  SELECT 
    sp.id,
    sp.id_store,
    s.name      AS store_name,
    sp.id_product,
    p.name      AS product_name,
    p.description,
    sp.price,
    sp.quantity
  FROM store_products sp
  JOIN stores   s ON sp.id_store   = s.id
  JOIN products p ON sp.id_product = p.id
`;

async function addProduct_To_Store(req, res) {
  const { idStore } = req.params;
  const { id_product, price, quantity } = req.body;

  try {
    // Cek apakah produk sudah ada di toko ini
    const [existing] = await database.query('SELECT id FROM store_products WHERE id_store = ? AND id_product = ?', [idStore, id_product]);

    if (existing.length > 0) {
      return sendResponseFormat(res, 400, 'Produk ini sudah ada di toko', null, 'DUPLICATE_ENTRY');
    }

    const [result] = await database.query('INSERT INTO store_products (id_store, id_product, price, quantity) VALUES (?, ?, ?, ?)', [idStore, id_product, price, quantity]);

    // Ambil data baru beserta nama produk dan toko
    const [newItem] = await database.query(`${SELECT_STORE_PRODUCT} WHERE sp.id = ?`, [result.insertId]);

    return sendResponseFormat(res, 201, 'Produk berhasil ditambahkan ke toko', newItem[0]);
  } catch (err) {
    return sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

async function getAllProducts_In_Store(req, res) {
  try {
    const { idStore } = req.params;
    const { name, min_price, max_price, page, limit } = req.query;

    const conditions = ['sp.id_store = ?'];
    const values = [idStore];

    if (name) {
      conditions.push('p.name LIKE ?');
      values.push(`%${name}%`);
    }

    if (min_price) {
      conditions.push('sp.price >= ?');
      values.push(Number(min_price));
    }

    if (max_price) {
      conditions.push('sp.price <= ?');
      values.push(Number(max_price));
    }

    const whereS = `WHERE ${conditions.join(' AND ')}`;

    const [countResult] = await database.query(
      `SELECT COUNT(*) AS total
       FROM store_products sp
       JOIN products p ON sp.id_product = p.id
       ${whereS}`,
      values,
    );
    const totalData = countResult[0].total;

    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const offset = (currentPage - 1) * itemsPerPage;
    const totalPages = Math.ceil(totalData / itemsPerPage);

    const [rows] = await database.query(`${SELECT_STORE_PRODUCT} ${whereS} LIMIT ? OFFSET ?`, [...values, itemsPerPage, offset]);

    const filterInfo = {
      id_store: Number(idStore),
      name: name || null,
      min_price: min_price || null,
      max_price: max_price || null,
    };

    const paginationInfo = {
      current_page: currentPage,
      items_per_page: itemsPerPage,
      total_data: totalData,
      total_pages: totalPages,
      next_page: currentPage < totalPages,
      prev_page: currentPage > 1,
    };

    return sendResponseFormat(res, 200, rows.length === 0 ? 'Tidak ada produk yang cocok dengan filter' : 'Berhasil mengambil semua produk dalam toko', rows, null, filterInfo, paginationInfo);
  } catch (err) {
    return sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

async function getProductDetails_In_Store(req, res) {
  try {
    const { idStore, idProduct } = req.params;

    const [result] = await database.query(`${SELECT_STORE_PRODUCT} WHERE sp.id_store = ? AND sp.id_product = ?`, [idStore, idProduct]);

    if (result.length === 0) {
      return sendResponseFormat(res, 404, 'Produk tidak ditemukan di toko ini', null, 'NOT_FOUND');
    }

    return sendResponseFormat(res, 200, 'Berhasil mengambil detail produk dalam toko', result[0]);
  } catch (err) {
    return sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

async function updateProductData_In_Store(req, res) {
  const { idStore, idProduct } = req.params;

  try {
    const [existing] = await database.query('SELECT id FROM store_products WHERE id_store = ? AND id_product = ?', [idStore, idProduct]);

    if (existing.length === 0) {
      return sendResponseFormat(res, 404, 'Produk tidak ditemukan di toko ini', null, 'NOT_FOUND');
    }

    await database.query('UPDATE store_products SET ? WHERE id_store = ? AND id_product = ?', [req.body, idStore, idProduct]);

    // Ambil data terbaru setelah update
    const [updated] = await database.query(`${SELECT_STORE_PRODUCT} WHERE sp.id_store = ? AND sp.id_product = ?`, [idStore, idProduct]);

    return sendResponseFormat(res, 200, 'Berhasil mengupdate data produk dalam toko', updated[0]);
  } catch (err) {
    return sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

async function removeProduct_From_Store(req, res) {
  const { idStore, idProduct } = req.params;

  try {
    // Ambil data sebelum dihapus
    const [existing] = await database.query(`${SELECT_STORE_PRODUCT} WHERE sp.id_store = ? AND sp.id_product = ?`, [idStore, idProduct]);

    if (existing.length === 0) {
      return sendResponseFormat(res, 404, 'Produk tidak ditemukan di toko ini', null, 'NOT_FOUND');
    }

    await database.query('DELETE FROM store_products WHERE id_store = ? AND id_product = ?', [idStore, idProduct]);

    return sendResponseFormat(res, 200, 'Produk berhasil dihapus dari toko', existing[0]);
  } catch (err) {
    return sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

const storeProductController = {
  addProduct_To_Store,
  getAllProducts_In_Store,
  getProductDetails_In_Store,
  updateProductData_In_Store,
  removeProduct_From_Store,
};

export default storeProductController;
