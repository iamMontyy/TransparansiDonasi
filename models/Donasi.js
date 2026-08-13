const mongoose = require('mongoose');
const donasiSchema = new mongoose.Schema(
  
    namaBarang: {
      type: String,
      required: [true, 'Nama barang wajib diisi yaa'],
      trim: true,
    },
    kategori: {
      type: String,
      enum: ['pakaian', 'makanan', 'buku', 'perabotan', 'elektronik', 'uang', 'lainnya'],
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
    donatur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['tersedia', 'disalurkan'],
      default: 'tersedia',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Donasi', donasiSchema);
