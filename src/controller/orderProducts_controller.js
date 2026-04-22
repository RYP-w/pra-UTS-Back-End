import database from '../config/database.js';
import guard from '../guard/guard.js';
import responseFormat from '../helper/responseFormat.js';

async function addProduct_to_order(req, res) {
    const id_order = req.params.idOrder;
    const { id_store_product, quantity } = req.body; 

    const connection = await database.getConnection();
    
    try {
        await connection.beginTransaction(); //? Mulai transaksi

        // 1. Cek ketersediaan stok di toko dan kunci baris (FOR UPDATE) agar tidak diubah request lain
        const [rows] = await connection.query(
            "SELECT quantity, price FROM store_products WHERE id = ? FOR UPDATE", 
            [id_store_product]
        );

        if (rows.length === 0) {
            throw new Error("Produk tidak ditemukan di toko.");
        }

        const stokTersedia = rows[0].quantity;
        const productPrice = rows[0].price; // Ambil harga asli dari toko

        // 2. Validasi apakah stok mencukupi
        if (stokTersedia < quantity) {
            throw new Error(`Stok produk tidak mencukupi (Tersisa: ${stokTersedia}).`);
        }

        // 3. Kurangi stok produk di table store_products
        await connection.query(
            "UPDATE store_products SET quantity = quantity - ? WHERE id = ?",
            [quantity, id_store_product]
        );

        // 4. Insert data ke order_products
        const [insertResult] = await connection.query(
            "INSERT INTO order_products (id_order, id_store_product, quantity, price) VALUES (?, ?, ?, ?)",
            [id_order, id_store_product, quantity, productPrice]
        );

        // 5. Update total_price di tabel orders
        await connection.query(
            `UPDATE orders SET total_price = (
                SELECT SUM(price * quantity) 
                FROM order_products
                WHERE id_order = ?
            ) WHERE id = ?`,
            [id_order, id_order]
        );

        await connection.commit();
        responseFormat.sendResponseFormat(res, 201, "Produk berhasil ditambahkan ke order", insertResult);

    } catch (err) {
        await connection.rollback();
        responseFormat.sendResponseFormat(res, 400, "Gagal menambahkan produk ke order", null, [err.message]);
    } finally {
        connection.release(); // Kembalikan koneksi ke pool
    }
}

async function getAllProducts_in_Oorder(req, res) {
    const q = "select * from order_products where id_order = ?;";
    try {
        const [result] = await database.query(q, [req.params.idOrder]);
        res.send(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function updateProductData_in_order(req, res) {
    const id_order = req.params.idOrder;
    const id_store_product = req.params.idProduct;
    const newQuantity = req.body.quantity;

    if (newQuantity === undefined) {
        responseFormat.sendResponseFormat(res, 400, "Tidak ada data quantity yang diupdate", null);
        return;
    }

    const connection = await database.getConnection();
    
    try {
        
        await connection.beginTransaction(); //? [start] step step update kuantitas pada order product

        // 1. Ambil kuantitas lama dari order_products
        const [orderItemRows] = await connection.query(
            "SELECT quantity FROM order_products WHERE id_order = ? AND id_store_product = ? FOR UPDATE",
            [id_order, id_store_product]
        );

        if (orderItemRows.length === 0) {
            throw new Error("Produk tidak ditemukan dalam order ini.");
        }

        const oldQuantity = orderItemRows[0].quantity;
        const difference = newQuantity - oldQuantity;

        if (difference !== 0) {
            // 2. Kunci dan cek kuantitas di store_products
            const [storeRows] = await connection.query(
                "SELECT quantity FROM store_products WHERE id = ? FOR UPDATE",
                [id_store_product]
            );

            if (storeRows.length === 0) {
                throw new Error("Produk tidak ditemukan di toko.");
            }

            const storeQuantity = storeRows[0].quantity;

            // Jika menambah kuantitas (difference > 0), maka cek apakah stok toko cukup
            if (difference > 0 && storeQuantity < difference) {
                 throw new Error(`Stok toko tidak mencukupi untuk tambahan ini (Tersisa: ${storeQuantity}).`);
            }

            // 3. Update stok di store_products (jika difference < 0, minus ketemu minus = plus / balik ke toko)
            await connection.query(
                "UPDATE store_products SET quantity = quantity - ? WHERE id = ?",
                [difference, id_store_product]
            );

            // 4. Update data quantity di order_products
            await connection.query(
                "UPDATE order_products SET quantity = ? WHERE id_order = ? AND id_store_product = ?",
                [newQuantity, id_order, id_store_product]
            );

            // 5. Update total_price di tabel orders
            await connection.query(
                `UPDATE orders SET total_price = (
                    SELECT SUM(price * quantity) 
                    FROM order_products
                    WHERE id_order = ?
                ) WHERE id = ?`,
                [id_order, id_order]
            );
        }

        await connection.commit();
        responseFormat.sendResponseFormat(res, 200, "Data produk dalam order berhasil diupdate", { quantity: newQuantity });

    } catch (err) {
        await connection.rollback();
        responseFormat.sendResponseFormat(res, 500, "Gagal mengupdate kuantitas produk", null, [err.message]);
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

        // 1. Ambil status order dan kunci baris order
        const [orderRows] = await connection.query("SELECT status FROM orders WHERE id = ? FOR UPDATE", [id_order]);

        if (orderRows.length === 0) {
            throw new Error("Order tidak ditemukan.");
        }
        
        const orderStatus = orderRows[0].status;

        // 2. Ambil kuantitas produk yang mau dihapus dari order_products
        const [orderItemRows] = await connection.query("SELECT quantity FROM order_products WHERE id_order = ? AND id_store_product = ? FOR UPDATE", [id_order, id_store_product]);

        if (orderItemRows.length === 0) {
            throw new Error("Produk tidak ditemukan dalam order ini.");
        }

        const itemQuantity = orderItemRows[0].quantity;

        // 3. Jika status belum selesai, kembalikan stok ke toko
        if (orderStatus !== 'selesai') {
            await connection.query("UPDATE store_products SET quantity = quantity + ? WHERE id = ?", [itemQuantity, id_store_product]);
        }

        // 4. Hapus item dari order_products
        const [deleteResult] = await connection.query( "DELETE FROM order_products WHERE id_order = ? AND id_store_product = ?", [id_order, id_store_product]);

        // 5. Hitung ulang total_price pada orders 
        // IFNULL digunakan untuk menangani jika order menjadi kosong 
        await connection.query(
            `UPDATE orders SET total_price = IFNULL((
                SELECT SUM(price * quantity) 
                FROM order_products
                WHERE id_order = ?
            ), 0) WHERE id = ?`,
            [id_order, id_order]
        );

        await connection.commit();
        return responseFormat.sendResponseFormat(res, 200, "Produk berhasil dihapus dari order", deleteResult);

    } catch (err) {
        await connection.rollback();
        return responseFormat.sendResponseFormat(res, 500, "Gagal menghapus produk dari order", null, [err.message]);
    } finally {
        connection.release();
    }
}

const orderProductController = {
    addProduct_to_order,
    getAllProducts_in_Oorder,
    updateProductData_in_order,
    removeProduct_from_order,
};

export default orderProductController;