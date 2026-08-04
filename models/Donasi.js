const mongoose = require('mongoose');

// Schema untuk data barang yang didonasikan
const donasiSchema = new mongoose.Schema(
  {
    namaBarang: {
      type: String,
      required: [true, 'Nama barang wajib diisi'],
      trim: true,
    },
    kategori: {
      type: String,
      enum: ['pakaian', 'makanan', 'buku', 'perabotan', 'elektronik', 'lainnya'],
      default: 'lainnya',
    },
    jumlah: {
      type: Number,
      required: [true, 'Jumlah barang wajib diisi'],
      min: [1, 'Jumlah minimal 1'],
    },
    kondisi: {
      type: String,
      enum: ['baru', 'layak_pakai'],
      default: 'layak_pakai',
    },
    deskripsi: {
      type: String,
      default: '',
    },
    // "ref" menghubungkan field ini ke collection 'User'.
    // Yang tersimpan sebenarnya hanya _id User, tapi nanti bisa
    // di-"populate" agar otomatis menampilkan detail donaturnya.
    donatur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['tersedia', 'disalurkan'],
      default: 'tersedia',
      // 'tersedia' = belum disalurkan ke penerima
      // 'disalurkan' = sudah ada catatan Penyaluran untuk barang ini
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Donasi', donasiSchema);
