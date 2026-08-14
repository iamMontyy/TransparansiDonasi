// Memuat variabel dari file .env ke dalam process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const donasiRoutes = require('./routes/donasiRoutes');
const penyaluranRoutes = require('./routes/penyaluranRoutes');

// 1. Sambungkan ke database SEBELUM server menerima request
connectDB();

// 2. Buat instance aplikasi Express
const app = express();

// 3. Middleware global (berjalan untuk SEMUA request)
app.use(cors()); // mengizinkan frontend dari domain lain mengakses API ini
app.use(express.json()); // otomatis mem-parsing body JSON menjadi req.body

// 4. Daftarkan route, masing-masing dengan prefix path-nya
app.use('/api/auth', authRoutes);
app.use('/api/donasi', donasiRoutes);
app.use('/api/penyaluran', penyaluranRoutes);

// 5. Route sederhana untuk memastikan server hidup
app.get('/', (req, res) => {
  res.json({ pesan: 'API Platform Transparansi Donasi Barang aktif 🚀' });
});

// 6. Middleware penangkap 404 (route yang tidak cocok dengan apa pun di atas)
app.use((req, res) => {
  res.status(404).json({ pesan: 'Endpoint tidak ditemukan' });
});

// 7. Middleware penangkap error global.
// Express mengenali fungsi ini sebagai "error handler" karena
// memiliki 4 parameter (err, req, res, next).
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ pesan: 'Terjadi kesalahan pada server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
