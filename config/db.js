const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // mongoose.connect() mengembalikan sebuah Promise,
    // makanya kita "await" agar server baru jalan setelah DB benar-benar tersambung.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB terhubung: ${conn.connection.host}`);
  } catch (error) {
    // Jika gagal konek (misal MongoDB belum nyala), tampilkan error
    // lalu hentikan aplikasi (process.exit(1)) karena API tidak berguna tanpa DB.
    console.error(`❌ Gagal konek ke MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
