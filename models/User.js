const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, 'Nama wajib diisi'],
      trim: true, 
    },
    email: {
      type: String,
      required: [true, 'Email wajib diisi'],
      unique: true, 
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password wajib diisi'],
      minlength: 6,
      select: false, 
    },
    role: {
      type: String,
      enum: ['admin', 'donatur'], 
      default: 'donatur',
    },
  },
  {
    timestamps: true, 
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.cocokkanPassword = async function (passwordInput) {
  return bcrypt.compare(passwordInput, this.password);
};

module.exports = mongoose.model('User', userSchema);
