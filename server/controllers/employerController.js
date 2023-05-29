const Employer = require('../models/Employer');
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

// get all employers
exports.getAllEmployers = async (req, res) => {
  try {
    const employers = await Employer.find({});
    res.json(employers);
  } catch (error) {
    console.error('Error in getAllEmployers:', error);
    res.status(500).json({ error: error.message });
  }
};

// get a single employer
exports.getEmployerById = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }
    res.json(employer);
  } catch (error) {
    console.error('Error in getEmployerById:', error);
    res.status(500).json({ error: error.message });
  }
};

// get user details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await Employer.findById(req.user.id);
    return {
      id: user.id,
      companyName: user.companyName,
      email: user.email,
      avatar: user.avatar,
      shortBio: user.shortBio,
      location: user.location,
      phone: user.phone
    }
  } catch (error) {
    console.log('Error in getUserDetails:', error);
    throw error;
  }
};
// update user details
exports.updateUserDetails = async (req, res) => {
  try {
    const { companyName, shortBio, location, phone } = req.body;
    let user = await Employer.findById(req.user.id);

    if (!user) throw new Error('User not found');

    user.companyName = companyName;
    user.shortBio = shortBio;
    user.location = location;
    user.phone = phone;

    await user.save();

    res.json({
      id: user._id,
      companyName: user.companyName,
      location: user.location,
      phone: user.phone,
      shortBio: user.shortBio
    });
  } catch (error) {
    console.error('Error in updateUserDetails:', error);
    res.status(500).json({ error: error.message });
  }
};

// Avatar upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dir = path.join(__dirname, `../uploads/employers/${req.user.id}`);
    await fs.promises.mkdir(dir, { recursive: true });
    console.log('Created directory:', dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, 'avatar' + path.extname(file.originalname));
  },
});

exports.upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      console.log('Invalid file type:', file.originalname);
      return cb(new Error('Please upload an image in jpg, jpeg or png format.'));
    }
    console.log('Valid file type:', file.originalname);
    cb(null, true);
  },
})

exports.uploadAvatar = async (req, res) => {
  try {
    const user = await Employer.findById(req.user.id);
    const newAvatarPath = req.file.filename;

    const userDir = path.join(__dirname, `../uploads/employers/${req.user.id}`);
    const files = await fs.promises.readdir(userDir);

    for (const file of files) {
      const filePath = path.join(userDir, file);
      if (filePath !== path.join(userDir, newAvatarPath)) {
        await fs.promises.unlink(filePath);
      }
    }

    user.avatar = newAvatarPath;
    await user.save();
    res.json({ avatar: user.avatar });
  } catch (error) {
    console.log('Error in uploadAvatar:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAvatar = async (req, res) => {
  try {
    const user = await Employer.findById(req.user.id);
    if (user.avatar) {
      const avatarPath = path.join(__dirname, `../uploads/employers/${req.user.id}/${user.avatar}`);
      fs.unlink(avatarPath, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        user.avatar = undefined;
        user.save()
        .then(() => {
          res.json({ message: 'Avatar deleted' });
        })
        .catch((error) => {
          res.status(500).json({ error: error.message });
        });
      });
    } else {
      res.json({ message: 'No avatar to delete' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
  res.json({
    token,
    user: {
      id: employer._id,
      email: employer.email,
      companyName: employer.companyName,
      role: "Employer"
    }
  });
};