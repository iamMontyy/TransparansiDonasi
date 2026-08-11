const Penyaluran = require('../models/Penyaluran');
const Donasi = require('../models/Donasi');
const getSemuaPenyaluran = async (req, res) => {
  try {
    const daftarPenyaluran = await Penyaluran.find()
      .populate('donasi', 'namaBarang kategori jumlah') 
      .populate('dicatatOleh', 'nama') 
      .sort({ tanggalPenyaluran: -1 });

    res.json({ total: daftarPenyaluran.length, data: daftarPenyaluran });
  } catch (error) {
    res.status(500).json({ pesan: error.message });
  }
};

const getPenyaluranById = async (req, res) => {
  try {
    const penyaluran = await Penyaluran.findById(req.params.id)
      .populate('donasi')
      .populate('dicatatOleh', 'nama');

    if (!penyaluran) {
      return res.status(404).json({ pesan: 'Data penyaluran tidak ditemukan' });
    }

    res.json({ data: penyaluran });
  } catch (error) {
    res.status(500).json({ pesan: error.message });
  }
};

const buatPenyaluran = async (req, res) => {
  try {
    const { donasiId, namaPenerima, lokasiPenyaluran, catatan } = req.body;

    
    const donasi = await Donasi.findById(donasiId);
    if (!donasi) {
      return res.status(404).json({ pesan: 'Donasi tidak ditemukan' });
    }

    li
    if (donasi.status === 'disalurkan') {
      return res.status(400).json({ pesan: 'Donasi ini sudah pernah disalurkan' });
    }

    const penyaluranBaru = await Penyaluran.create({
      donasi: donasiId,
      namaPenerima,
      lokasiPenyaluran,
      catatan,
      dicatatOleh: req.user._id,
    });

    donasi.status = 'disalurkan';
    await donasi.save();

    res.status(201).json({
      pesan: 'Penyaluran berhasil dicatat',
      data: penyaluranBaru,
    });
  } catch (error) {
    res.status(400).json({ pesan: error.message });
  }
};

module.exports = { getSemuaPenyaluran, getPenyaluranById, buatPenyaluran };
