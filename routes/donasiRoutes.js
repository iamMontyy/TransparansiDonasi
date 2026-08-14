const express = require('express');
const router = express.Router();
const {
  getSemuaDonasi,
  getDonasiById,
  buatDonasi,
  updateDonasi,
} = require('../controllers/donasiController');
const { protect, authorize } = require('../middleware/auth');

// --- Route PUBLIK (tanpa middleware "protect") ---
router.get('/', getSemuaDonasi);
router.get('/:id', getDonasiById);

// --- Route PRIVAT (wajib login, pakai middleware "protect") ---
// Express menjalankan middleware secara berurutan dari kiri ke kanan,
// jadi "protect" akan dicek dulu sebelum masuk ke fungsi "buatDonasi".
router.post('/', protect, authorize('donatur', 'admin'), buatDonasi);
router.put('/:id', protect, authorize('donatur', 'admin'), updateDonasi);

module.exports = router;
