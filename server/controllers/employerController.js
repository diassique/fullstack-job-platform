const Employer = require('../models/Employer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
const { generateToken } = require('../utils/jwtHelpers');
const { checkEmailInBothCollections } = require('../utils/helpers');

dotenv.config();

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, companyName } = req.body;

    const existingUser = await checkEmailInBothCollections(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const employer = new Employer({ email, password: hashedPassword, companyName });
    await employer.save();

    const token = generateToken(employer, process.env.JWT_SECRET, '1d');
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const employer = await Employer.findOne({ email });

  if (!employer) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, employer.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(employer, process.env.JWT_SECRET, '1d');
  res.json({ token });
};

// Added this to both applicantController.js and employerController.js
exports.getUserData = async (req, res) => {
  try {
    const user = await (req.user.role === 'Applicant' ? Applicant : Employer).findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user._id,
      email: user.email,
      name: req.user.role === 'Applicant' ? user.firstName : user.companyName,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};