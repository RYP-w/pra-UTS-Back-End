import mysql2 from 'mysql2'

const database = mysql2.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database: 'e_commerce_pra_uts_db',
    waitForConnections:true
});

database.connect(err => {
    if (err) {
        console.log("Terjadi kesalahan pada koneksi database\n",err.message);
    } else {
        console.log("[ Koneksi database berhasil ]");        
    }
})

export default database.promise();