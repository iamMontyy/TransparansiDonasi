const express = require('express');
const router = express.Router();
const {
  getSemuaDonasi,
  getDonasiById,
  buatDonasi,
  updateDonasi,
} = require('../controllers/donasiController');
const { protect, authorize } = require('../middleware/auth');
router.get('/', getSemuaDonasi);
router.get('/:id', getDonasiById);
router.post('/', protect, authorize('donatur', 'admin'), buatDonasi);
router.put('/:id', protect, authorize('donatur', 'admin'), updateDonasi);

module.exports = router;
