const mongoose = require('mongoose');
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
