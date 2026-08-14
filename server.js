require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const donasiRoutes = require('./routes/donasiRoutes');
const penyaluranRoutes = require('./routes/penyaluranRoutes');
connectDB();
const app = express();
app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/donasi', donasiRoutes);
app.use('/api/penyaluran', penyaluranRoutes);

app.get('/', (req, res) => {
  res.json({ pesan: 'API Platform Transparansi Donasi Barang aktif ' });
});

app.use((req, res) => {
  res.status(404).json({ pesan: 'Endpoint tidak ditemukan' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ pesan: 'Terjadi kesalahan pada server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
