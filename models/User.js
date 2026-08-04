const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, 'Nama wajib diisi'],
      trim: true, // otomatis membuang spasi berlebih di awal/akhir
    },
    email: {
      type: String,
      required: [true, 'Email wajib diisi'],
      unique: true, // tidak boleh ada 2 user dengan email sama
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password wajib diisi'],
      minlength: 6,
      select: false, // secara default password TIDAK ikut ter-query, demi keamanan
    },
    role: {
      type: String,
      enum: ['admin', 'donatur'], // hanya boleh salah satu dari dua nilai ini
      default: 'donatur',
    },
  },
  {
    timestamps: true, // otomatis menambahkan field createdAt & updatedAt
  }
);

// "Middleware" Mongoose: kode ini otomatis berjalan SEBELUM dokumen disimpan (save).
// Fungsinya untuk meng-hash password mentah menjadi bentuk terenkripsi.
userSchema.pre('save', async function (next) {
  // Jika password tidak diubah (misal user update nama saja), skip hashing.
  if (!this.isModified('password')) return next();

  // genSalt menghasilkan "garam" acak, lalu hash menggabungkan
  // password + salt agar hasil akhirnya sulit ditebak/dibalikkan.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method kustom yang bisa dipanggil pada setiap instance User,
// contoh: user.cocokkanPassword('123456')
// Berguna saat proses login untuk membandingkan password input vs hash di DB.
userSchema.methods.cocokkanPassword = async function (passwordInput) {
  return bcrypt.compare(passwordInput, this.password);
};

module.exports = mongoose.model('User', userSchema);
