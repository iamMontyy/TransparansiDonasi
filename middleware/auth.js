const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = async (req, res, next) => {
  let token;

  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; 
  }

  if (!token) {
    return res.status(401).json({ pesan: 'Tidak ada token, akses ditolak' });
  }

  try {
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ pesan: 'User untuk token ini sudah tidak ada' });
    }

    next(); 
  } catch (error) {
    return res.status(401).json({ pesan: 'Token tidak valid atau kadaluarsa' });
  }
};

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
