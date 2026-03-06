import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'sub-admin', 'master-admin'],
    default: 'user',
  },
  phone: {
    type: String,
    default: '',
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  loginHistory: [{
    device: String,
    browser: String,
    ip: String,
    date: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;