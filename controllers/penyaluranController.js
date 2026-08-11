const Penyaluran = require('../models/Penyaluran');
const Donasi = require('../models/Donasi');

// GET /api/penyaluran
// PUBLIK — daftar semua penyaluran, ini yang membuktikan barang
// benar-benar sampai ke penerima (transparansi penuh).
const getSemuaPenyaluran = async (req, res) => {
  try {
    const daftarPenyaluran = await Penyaluran.find()
      .populate('donasi', 'namaBarang kategori jumlah') // detail barang apa yang disalurkan
      .populate('dicatatOleh', 'nama') // siapa admin yang mencatat
      .sort({ tanggalPenyaluran: -1 });

    res.json({ total: daftarPenyaluran.length, data: daftarPenyaluran });
  } catch (error) {
    res.status(500).json({ pesan: error.message });
  }
};

// GET /api/penyaluran/:id
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

// POST /api/penyaluran
// PRIVAT — hanya admin yang boleh mencatat penyaluran barang ke penerima.
// Ini bagian paling penting: begitu penyaluran dicatat, status Donasi
// terkait otomatis berubah dari 'tersedia' -> 'disalurkan'.
const buatPenyaluran = async (req, res) => {
  try {
    const { donasiId, namaPenerima, lokasiPenyaluran, catatan } = req.body;

    // Pastikan donasi yang dimaksud benar-benar ada
    const donasi = await Donasi.findById(donasiId);
    if (!donasi) {
      return res.status(404).json({ pesan: 'Donasi tidak ditemukan' });
    }

    // Cegah barang yang sama disalurkan dua kali
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

    // Update status donasi menjadi 'disalurkan' agar publik tahu
    // barang ini sudah tidak "menggantung", sudah jelas ke mana perginya.
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
