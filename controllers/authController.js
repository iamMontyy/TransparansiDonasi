const jwt = require('jsonwebtoken');
const User = require('../models/User');
const buatToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const register = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;
    const sudahAda = await User.findOne({ email });
    if (sudahAda) {
      return res.status(400).json({ pesan: 'Email sudah terdaftar' });
    }
    
    const user = await User.create({ nama, email, password, role });

    res.status(201).json({
      pesan: 'Registrasi berhasil',
      data: {
        id: user._id,
        nama: user.nama,
        email: user.email,
        role: user.role,
      },
      token: buatToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ pesan: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ pesan: 'Email dan password wajib diisi' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.cocokkanPassword(password))) {
      return res.status(401).json({ pesan: 'Email atau password salah' });
    }

    res.json({
      pesan: 'Login berhasil',
      data: {
        id: user._id,
        nama: user.nama,
        email: user.email,
        role: user.role,
      },
      token: buatToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ pesan: error.message });
  }
};

module.exports = { register, login };
