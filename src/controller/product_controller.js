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
  const q = 'select * from products;';
  try {
    const [result] = await database.query(q);
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

async function getProductDetail(req, res) {
  const q = 'select * from products where id = ?';
  try {
    const [result] = await database.query(q, [req.params.idProduct]);
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateProductData(req, res) {
  const q = 'update products set ? where id = ?';
  try {
    const [result] = await database.query(q, [req.body, req.params.idProduct]);
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteProduct(req, res) {
  const q = 'delete from products where id = ?';
  try {
    const [result] = await database.query(q, [req.params.idProduct]);
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
