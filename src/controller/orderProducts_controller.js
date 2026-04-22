import database from '../config/database.js';
import { sendResponseFormat } from '../helper/responseFormat.js';

const SELECT_ORDER_PRODUCT = `
  SELECT
    op.id,
    op.id_order,
    op.id_store_product,
    p.name  AS product_name,
    s.name  AS store_name,
    op.price,
    op.quantity,
    (op.price * op.quantity) AS subtotal
  FROM order_products op
  JOIN store_products sp ON op.id_store_product = sp.id
  JOIN products       p  ON sp.id_product       = p.id
  JOIN stores         s  ON sp.id_store         = s.id
`;

async function addProduct_to_order(req, res) {
  const id_order = req.params.idOrder;
  const { id_store_product, quantity } = req.body;

  const connection = await database.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Cek stok di store_products dan kunci baris (FOR UPDATE)
    const [rows] = await connection.query('SELECT quantity, price FROM store_products WHERE id = ? FOR UPDATE', [id_store_product]);

    if (rows.length === 0) {
      throw new Error('Produk tidak ditemukan di toko.');
    }

    const stokTersedia = rows[0].quantity;
    const productPrice = rows[0].price;

    // 2. Validasi stok mencukupi
    if (stokTersedia < quantity) {
      throw new Error(`Stok produk tidak mencukupi (Tersisa: ${stokTersedia}).`);
    }

    // 3. Kurangi stok di store_products
    await connection.query('UPDATE store_products SET quantity = quantity - ? WHERE id = ?', [quantity, id_store_product]);

    // 4. Insert ke order_products
    const [insertResult] = await connection.query('INSERT INTO order_products (id_order, id_store_product, quantity, price) VALUES (?, ?, ?, ?)', [id_order, id_store_product, quantity, productPrice]);

    // 5. Update total_price di orders
    await connection.query(
      `UPDATE orders SET total_price = (
        SELECT SUM(price * quantity) FROM order_products WHERE id_order = ?
      ) WHERE id = ?`,
      [id_order, id_order],
    );

    await connection.commit();

    // Ambil data baru yang diinsert
    const [newItem] = await database.query(`${SELECT_ORDER_PRODUCT} WHERE op.id = ?`, [insertResult.insertId]);

    return sendResponseFormat(res, 201, 'Produk berhasil ditambahkan ke order', newItem[0]);
  } catch (err) {
    await connection.rollback();
    return sendResponseFormat(res, 400, 'Gagal menambahkan produk ke order', null, err.message);
  } finally {
    connection.release();
  }
}

async function getAllProducts_in_Order(req, res) {
  try {
    const { idOrder } = req.params;
    const { id_store_product, page, limit } = req.query;

    const conditions = ['op.id_order = ?'];
    const values = [idOrder];

    if (id_store_product) {
      conditions.push('op.id_store_product = ?');
      values.push(id_store_product);
    }

    const whereS = `WHERE ${conditions.join(' AND ')}`;

    const [countResult] = await database.query(`SELECT COUNT(*) AS total FROM order_products op ${whereS}`, values);
    const totalData = countResult[0].total;

    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const offset = (currentPage - 1) * itemsPerPage;
    const totalPages = Math.ceil(totalData / itemsPerPage);

    const [rows] = await database.query(`${SELECT_ORDER_PRODUCT} ${whereS} LIMIT ? OFFSET ?`, [...values, itemsPerPage, offset]);

    const filterInfo = {
      id_order: Number(idOrder),
      id_store_product: id_store_product || null,
    };

    const paginationInfo = {
      current_page: currentPage,
      items_per_page: itemsPerPage,
      total_data: totalData,
      total_pages: totalPages,
      next_page: currentPage < totalPages,
      prev_page: currentPage > 1,
    };

    return sendResponseFormat(res, 200, rows.length === 0 ? 'Tidak ada produk dalam order ini' : 'Berhasil mengambil semua produk dalam order', rows, null, filterInfo, paginationInfo);
  } catch (err) {
    return sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

async function updateProductData_in_order(req, res) {
  const id_order = req.params.idOrder;
  const id_store_product = req.params.idProduct;
  const newQuantity = req.body.quantity;

  if (newQuantity === undefined) {
    return sendResponseFormat(res, 400, 'Field quantity wajib diisi', null, 'BAD_REQUEST');
  }

  const connection = await database.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Ambil quantity lama dan kunci baris
    const [orderItemRows] = await connection.query('SELECT quantity FROM order_products WHERE id_order = ? AND id_store_product = ? FOR UPDATE', [id_order, id_store_product]);

    if (orderItemRows.length === 0) {
      throw new Error('Produk tidak ditemukan dalam order ini.');
    }

    const oldQuantity = orderItemRows[0].quantity;
    const difference = newQuantity - oldQuantity;

    if (difference !== 0) {
      // 2. Cek stok di store_products
      const [storeRows] = await connection.query('SELECT quantity FROM store_products WHERE id = ? FOR UPDATE', [id_store_product]);

      if (storeRows.length === 0) {
        throw new Error('Produk tidak ditemukan di toko.');
      }

      if (difference > 0 && storeRows[0].quantity < difference) {
        throw new Error(`Stok toko tidak mencukupi (Tersisa: ${storeRows[0].quantity}).`);
      }

      // 3. Update stok store_products
      await connection.query('UPDATE store_products SET quantity = quantity - ? WHERE id = ?', [difference, id_store_product]);

      // 4. Update quantity di order_products
      await connection.query('UPDATE order_products SET quantity = ? WHERE id_order = ? AND id_store_product = ?', [newQuantity, id_order, id_store_product]);

      // 5. Update total_price di orders
      await connection.query(
        `UPDATE orders SET total_price = (
          SELECT SUM(price * quantity) FROM order_products WHERE id_order = ?
        ) WHERE id = ?`,
        [id_order, id_order],
      );
    }

    await connection.commit();

    // Ambil data terbaru setelah update
    const [updated] = await database.query(`${SELECT_ORDER_PRODUCT} WHERE op.id_order = ? AND op.id_store_product = ?`, [id_order, id_store_product]);

    return sendResponseFormat(res, 200, 'Data produk dalam order berhasil diupdate', updated[0]);
  } catch (err) {
    await connection.rollback();
    return sendResponseFormat(res, 500, 'Gagal mengupdate kuantitas produk', null, err.message);
  } finally {
    connection.release();
  }
}

async function removeProduct_from_order(req, res) {
  const id_order = req.params.idOrder;
  const id_store_product = req.params.idProduct;

  const connection = await database.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Cek order ada dan kunci baris
    const [orderRows] = await connection.query('SELECT status FROM orders WHERE id = ? FOR UPDATE', [id_order]);

    if (orderRows.length === 0) {
      throw new Error('Order tidak ditemukan.');
    }

    // 2. Ambil data produk sebelum dihapus
    const [orderItemRows] = await connection.query(`${SELECT_ORDER_PRODUCT} WHERE op.id_order = ? AND op.id_store_product = ? FOR UPDATE`, [id_order, id_store_product]);

    if (orderItemRows.length === 0) {
      throw new Error('Produk tidak ditemukan dalam order ini.');
    }

    const deletedItem = orderItemRows[0];
    const itemQuantity = deletedItem.quantity;
    const orderStatus = orderRows[0].status;

    // 3. Kembalikan stok ke toko jika order belum selesai
    if (orderStatus !== 'selesai') {
      await connection.query('UPDATE store_products SET quantity = quantity + ? WHERE id = ?', [itemQuantity, id_store_product]);
    }

    // 4. Hapus dari order_products
    await connection.query('DELETE FROM order_products WHERE id_order = ? AND id_store_product = ?', [id_order, id_store_product]);

    // 5. Hitung ulang total_price
    await connection.query(
      `UPDATE orders SET total_price = IFNULL((
        SELECT SUM(price * quantity) FROM order_products WHERE id_order = ?
      ), 0) WHERE id = ?`,
      [id_order, id_order],
    );

    await connection.commit();

    return sendResponseFormat(res, 200, 'Produk berhasil dihapus dari order', deletedItem);
  } catch (err) {
    await connection.rollback();
    return sendResponseFormat(res, 500, 'Gagal menghapus produk dari order', null, err.message);
  } finally {
    connection.release();
  }
}

const orderProductController = {
  addProduct_to_order,
  getAllProducts_in_Order,
  updateProductData_in_order,
  removeProduct_from_order,
};

export default orderProductController;
