const Applicant = require('../models/Applicant');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
const { generateToken } = require('../utils/jwtHelpers');
const { checkEmailInBothCollections } = require('../utils/helpers');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

dotenv.config();

// getting the user details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await Applicant.findById(req.user.id);
    const resumePath = path.join(__dirname, `../uploads/resumes/${req.user.id}/${user.resume}`);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,  // this is the filename
      resume: user.resume,
      resumePath: resumePath,
      location: user.location,
      phone: user.phone,
      professionalTitle: user.professionalTitle,
      shortBio: user.shortBio,
    };
  } catch (error) {
    console.log('Error in getUserDetails:', error);
    throw error;
  }
};
// updating user details
exports.updateUserDetails = async (req, res) => {
  try {
    const { firstName, lastName, location, phone, professionalTitle, shortBio } = req.body;
    let user = await Applicant.findById(req.user.id);

    if (!user) throw new Error('User not found');

    user.firstName = firstName;
    user.lastName = lastName;
    user.location = location;
    user.phone = phone;
    user.professionalTitle = professionalTitle;
    user.shortBio = shortBio;

    await user.save();

    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      phone: user.phone,
      professionalTitle: user.professionalTitle,
      shortBio: user.shortBio
    });
  } catch (error) {
    console.error('Error in updateUserDetails:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await checkEmailInBothCollections(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const applicant = new Applicant({ email, password: hashedPassword, firstName, lastName });
    await applicant.save();

    const token = generateToken(applicant, process.env.JWT_SECRET, '1d');
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const applicant = await Applicant.findOne({ email });

  if (!applicant) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, applicant.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(applicant, process.env.JWT_SECRET, '1d');
  res.json({ 
    token,
    user: {
      id: applicant._id,
      email: applicant.email,
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      role: "Applicant"
    }
  });
};


// Added this to both applicantController.js and employerController.js
exports.getUserData = async (req, res) => {
  try {
    const user = await (req.user.role === 'Applicant' ? Applicant : Employer).findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    let response = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    
    if (req.user.role === 'Applicant') {
      response.firstName = user.firstName;
      response.lastName = user.lastName;
    } else {
      response.name = user.companyName;
    }
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};