const Donasi = require('../models/Donasi');
const getSemuaDonasi = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.kategori) filter.kategori = req.query.kategori;
    const daftarDonasi = await Donasi.find(filter)
      .populate('donatur', 'nama')
      .sort({ createdAt: -1 });

    res.json({ total: daftarDonasi.length, data: daftarDonasi });
  } catch (error) {
    res.status(500).json({ pesan: error.message });
  }
};
const getDonasiById = async (req, res) => {
  try {
    const donasi = await Donasi.findById(req.params.id).populate('donatur', 'nama');

    if (!donasi) {
      return res.status(404).json({ pesan: 'Donasi tidak ditemukan' });
    }

    res.json({ data: donasi });
  } catch (error) {
    res.status(500).json({ pesan: error.message });
  }
};

// POST /api/donasi
// PRIVAT — hanya user yang login (role: donatur/admin) yang boleh menambah donasi
const buatDonasi = async (req, res) => {
  try {
    const { namaBarang, kategori, jumlah, kondisi, deskripsi } = req.body;

    const donasiBaru = await Donasi.create({
      namaBarang,
      kategori,
      jumlah,
      kondisi,
      deskripsi,
      donatur: req.user._id, // req.user didapat dari middleware "protect"
    });

    res.status(201).json({ pesan: 'Donasi berhasil dicatat', data: donasiBaru });
  } catch (error) {
    res.status(400).json({ pesan: error.message });
  }
};

// PUT /api/donasi/:id
// PRIVAT — hanya pemilik donasi (donatur yang sama) atau admin yang boleh mengubah
const updateDonasi = async (req, res) => {
  try {
    const donasi = await Donasi.findById(req.params.id);

    if (!donasi) {
      return res.status(404).json({ pesan: 'Donasi tidak ditemukan' });
    }

    // Otorisasi manual: cek apakah user ini pemilik data ATAU admin.
    // .toString() dipakai karena donasi.donatur berupa ObjectId,
    // sedangkan req.user._id juga ObjectId — keduanya perlu disamakan formatnya
    // sebelum dibandingkan dengan '==='.
    const pemilik = donasi.donatur.toString() === req.user._id.toString();
    if (!pemilik && req.user.role !== 'admin') {
      return res.status(403).json({ pesan: 'Anda tidak berhak mengubah donasi ini' });
    }

    // Object.assign menyalin field baru dari req.body ke object donasi,
    // hanya field yang dikirim yang akan berubah, sisanya tetap sama.
    Object.assign(donasi, req.body);
    await donasi.save();

    res.json({ pesan: 'Donasi berhasil diperbarui', data: donasi });
  } catch (error) {
    res.status(400).json({ pesan: error.message });
  }
};

module.exports = { getSemuaDonasi, getDonasiById, buatDonasi, updateDonasi };
