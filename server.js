import express from 'express';
import usersRoutes from './src/routes/routes_users.js';
import storesRoutes from './src/routes/routes.stores.js';
import productsRoutes from './src/routes/routes_products.js';
import ordersRoutes from './src/routes/routes_orders.js';


const PORT = 3000;
const app = express();

app.use(express.json());

app.use('/api/users', usersRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server Gagal Run\n", err.message);
    } else {
        console.log(`Server Berhasil Run: [ http://localhost:${PORT} ]`);
    }
});
