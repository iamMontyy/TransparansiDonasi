const express = require('express');
const router = express.Router(); // "mini app" khusus untuk kelompok route ini
const { register, login } = require('../controllers/authController');

// Setiap route di sini otomatis diawali prefix '/api/auth'
// (prefix ini kita atur nanti di server.js)
router.post('/register', register);
router.post('/login', login);

module.exports = router;
