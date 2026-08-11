const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware adalah fungsi "penjaga gerbang" yang berjalan SEBELUM
// controller. Ia bisa meloloskan request (panggil next()) atau
// menghentikannya (kirim response error).

// 1) Middleware "protect": memastikan request punya token JWT yang valid.
const protect = async (req, res, next) => {
  let token;

  // Token biasanya dikirim di header: Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // ambil bagian setelah "Bearer "
  }

  if (!token) {
    return res.status(401).json({ pesan: 'Tidak ada token, akses ditolak' });
  }

  try {
    // Verifikasi token menggunakan secret key yang sama saat token dibuat.
    // Jika token palsu/kadaluarsa, baris ini akan melempar error (masuk ke catch).
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ambil data user dari DB berdasarkan id yang tersimpan di token,
    // lalu tempelkan ke req.user supaya bisa dipakai controller berikutnya.
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ pesan: 'User untuk token ini sudah tidak ada' });
    }

    next(); // lolos, lanjut ke middleware/controller berikutnya
  } catch (error) {
    return res.status(401).json({ pesan: 'Token tidak valid atau kadaluarsa' });
  }
};

// 2) Middleware "authorize": membatasi akses berdasarkan role tertentu.
// Cara pakai: authorize('admin') hanya mengizinkan role admin.
// Ini adalah "higher-order function": fungsi yang mengembalikan fungsi lain,
// supaya kita bisa mengatur role apa saja yang diizinkan secara fleksibel.
const authorize = (...rolesYangDiizinkan) => {
  return (req, res, next) => {
    if (!rolesYangDiizinkan.includes(req.user.role)) {
      return res.status(403).json({
        pesan: `Role '${req.user.role}' tidak memiliki akses ke aksi ini`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
