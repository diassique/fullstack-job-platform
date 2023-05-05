const Applicant = require('../models/Applicant');
const Employer = require('../models/Employer');

const checkEmailInBothCollections = async (email) => {
  const applicant = await Applicant.findOne({ email });
  const employer = await Employer.findOne({ email });

  return !!(applicant || employer);
};

module.exports = { checkEmailInBothCollections };