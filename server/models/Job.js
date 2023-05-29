const { Schema, model } = require('mongoose');

const JobSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Employer'
  },
  companyName: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  employment: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  salary: { type: String, required: true },
  currency: { type: String, required: true },
  salaryFrequency: { type: String, required: true },
  dateOfPosting: { type: Date, default: Date.now },
  activeApplications: { type: Number, default: 0 },
  acceptedCandidates: { type: Number, default: 0 },
});

module.exports = model('Job', JobSchema);