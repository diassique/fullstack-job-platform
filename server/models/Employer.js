const {Schema, model} = require('mongoose');

const EmployerSchema = new Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Employer' },
  avatar: { type: String },
  phone: { type: String },
  location: { type: String },
  shortBio: { type: String }
})

module.exports = model('Employer', EmployerSchema);