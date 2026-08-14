const express = require('express');
const router = express.Router();
const {
  getSemuaPenyaluran,
  getPenyaluranById,
  buatPenyaluran,
} = require('../controllers/penyaluranController');
const { protect, authorize } = require('../middleware/auth');
router.get('/', getSemuaPenyaluran);
router.get('/:id', getPenyaluranById);
router.post('/', protect, authorize('admin'), buatPenyaluran);

module.exports = router;
