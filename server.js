import express from 'express';
import usersRoutes from './src/routes/users_routes.js';
import storesRoutes from './src/routes/stores_routes.js';
import productsRoutes from './src/routes/products_routes.js';
import ordersRoutes from './src/routes/orders_routes.js';


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
