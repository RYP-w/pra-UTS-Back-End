import mysql2 from 'mysql2'

const database = mysql2.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database: 'e_commerce_pra_uts_db',
    waitForConnections:true,
    connectionLimit: 10,
});

database.getConnection((err, connection) => {
    if (err) {
        console.log("Terjadi kesalahan pada koneksi database\n", err.message);
    } else {
        console.log("[ Koneksi database berhasil ]");
        connection.release();  
    }
});

export default database.promise();