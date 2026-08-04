const mongoose = require('mongoose');

// Schema untuk mencatat kapan & ke mana suatu Donasi disalurkan.
// Ini adalah inti dari fitur "transparansi": setiap penyaluran tercatat
// dan bisa dilihat publik, sehingga jelas barang donasi sampai ke mana.
const penyaluranSchema = new mongoose.Schema(
  {
    donasi: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donasi',
      required: true,
    },
    namaPenerima: {
      type: String,
      required: [true, 'Nama penerima wajib diisi'],
      trim: true,
    },
    lokasiPenyaluran: {
      type: String,
      required: [true, 'Lokasi penyaluran wajib diisi'],
    },
    tanggalPenyaluran: {
      type: Date,
      default: Date.now,
    },
    catatan: {
      type: String,
      default: '',
    },
    // Admin yang bertanggung jawab mencatat penyaluran ini
    dicatatOleh: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Penyaluran', penyaluranSchema);
