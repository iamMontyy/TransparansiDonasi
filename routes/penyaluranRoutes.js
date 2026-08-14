const express = require('express');
const router = express.Router();
const {
  getSemuaPenyaluran,
  getPenyaluranById,
  buatPenyaluran,
} = require('../controllers/penyaluranController');
const { protect, authorize } = require('../middleware/auth');

// PUBLIK — publik boleh lihat riwayat penyaluran (bukti transparansi)
router.get('/', getSemuaPenyaluran);
router.get('/:id', getPenyaluranById);

// PRIVAT — hanya admin yang boleh mencatat penyaluran baru
router.post('/', protect, authorize('admin'), buatPenyaluran);

module.exports = router;
