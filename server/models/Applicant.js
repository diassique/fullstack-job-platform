const {Schema, model} = require('mongoose');

const PositionSchema = new Schema({
  title: { type: String },
  company: { type: String },
  location: { type: String },
  startMonth: { type: String },
  startYear: { type: Number },
  endMonth: { type: String },
  endYear: { type: Number },
  description: { type: String },
}, {_id: true});

const EducationSchema = new Schema({
  university: { type: String },
  degree: { type: String },
  startYear: { type: Number },
  endYear: { type: Number },
  description: { type: String },
}, {_id: true});

const CertificationSchema = new Schema({
  name: { type: String },
  authority: { type: String },
  licenseNumber: { type: String },
  description: { type: String }
}, {_id: true});

const ApplicantSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Applicant' },
  avatar: { type: String },
  resume: { type: String },
  location: { type: String },
  phone: { type: String },
  professionalTitle: { type: String },
  shortBio: { type: String },
  positions: [PositionSchema],
  education: [EducationSchema],
  certifications: [CertificationSchema]
});

module.exports = model('Applicant', ApplicantSchema);