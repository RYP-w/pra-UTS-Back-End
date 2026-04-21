import database from '../config/database.js';
import { sendResponseFormat } from '../helper/responseFormat.js';

async function createOrder(req, res) {
  const q = 'insert into orders set ?';
  try {
    const [result] = await database.query(q, [req.body]);
    return sendResponseFormat(res, 201, 'Berhasil menambahkan order', { id: result.insertId });
  } catch (err) {
    return sendResponseFormat(res, 500, 'Internal server error', null, err.message);
  }
}

async function getAllOrders(req, res) {
  const q = 'select * from orders;';
  try {
    const [result] = await database.query(q);
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

async function getOrder(req, res) {
  const q = 'select * from orders where id = ?';
  try {
    const [result] = await database.query(q, [req.params.idOrder]);
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateStatusOrder(req, res) {
  const q = 'update orders set ? where id = ?';
  try {
    const [result] = await database.query(q, [req.body, req.params.idOrder]);
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteOrder(req, res) {
  const id_order = req.params.idOrder;
  const connection = await database.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Hapus semua produk yang berelasi dengan id_order di tabel order_products
    await connection.query('DELETE FROM order_products WHERE id_order = ?', [id_order]);

    // 2. Hapus data order di tabel orders
    const [result] = await connection.query('DELETE FROM orders WHERE id = ?', [id_order]);

    await connection.commit();
    res.send(result);
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
}

const productController = {
  createOrder,
  getAllOrders,
  getOrder,
  updateStatusOrder,
  deleteOrder,
};

export default productController;
