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

// get user details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await Applicant.findById(req.user.id);
    const resumePath = path.join(__dirname, `../uploads/resumes/${req.user.id}/${user.resume}`);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      resume: user.resume,
      resumePath: resumePath,
      location: user.location,
      phone: user.phone,
      professionalTitle: user.professionalTitle,
      shortBio: user.shortBio,
      positions: user.positions,
      education: user.education,
      certifications: user.certifications,
    };
  } catch (error) {
    console.log('Error in getUserDetails:', error);
    throw error;
  }
};

// update user details
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

// Avatar upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dir = path.join(__dirname, `../uploads/applicants/${req.user.id}`);
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
});

exports.uploadAvatar = async (req, res) => {
  try {
    const user = await Applicant.findById(req.user.id);
    const newAvatarPath = req.file.filename;
    const userDir = path.join(__dirname, `../uploads/applicants/${req.user.id}`);
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
    const user = await Applicant.findById(req.user.id);
    if (user.avatar) {
      const avatarPath = path.join(__dirname, `../uploads/applicants/${req.user.id}/${user.avatar}`);
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

// Resume upload
const resumeStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dir = path.join(__dirname, `../uploads/resumes/${req.user.id}`);
    await fs.promises.mkdir(dir, { recursive: true });
    console.log('Created directory:', dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, 'CV' + path.extname(file.originalname));
  },
});
exports.resumeUpload = multer({ 
  storage: resumeStorage,
  fileFilter: function(req, file, cb) {
    if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
      console.log('Invalid file type:', file.originalname);
      return cb(new Error('Please upload a file in pdf or word format.'));
    }
    console.log('Valid file type:', file.originalname);
    cb(null, true);
  },
});
exports.uploadResume = async (req, res) => {
  try {
    const user = await Applicant.findById(req.user.id);
    const newResumePath = req.file.filename;

    if(user.resume) { // Check if a resume already exists
      const oldResumePath = path.join(__dirname, `../uploads/resumes/${req.user.id}/${user.resume}`);
      await fs.promises.unlink(oldResumePath);
    }

    user.resume = newResumePath;
    await user.save();
    res.json({ resume: user.resume });
  } catch (error) {
    console.log('Error in uploadResume:', error);
    res.status(500).json({ error: error.message });
  }
};
exports.deleteResume = async (req, res) => {
  try {
    const user = await Applicant.findById(req.user.id);
    if (user.resume) {
      const resumePath = path.join(__dirname, `../uploads/resumes/${req.user.id}/${user.resume}`);
      fs.unlink(resumePath, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        user.resume = undefined;
        user.save()
        .then(() => {
          res.json({ message: 'Resume deleted' });
        })
        .catch((error) => {
          res.status(500).json({ error: error.message });
        });
      });
    } else {
      res.json({ message: 'No resume to delete' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.checkResume = async (req, res) => {
  try {
    const user = await Applicant.findById(req.user.id);
    if (user.resume) {
      res.json({ resumeExists: true });
    } else {
      res.json({ resumeExists: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// auth
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

// Add a position
exports.addPosition = async (req, res) => {
  try {
    const positionData = req.body;
    let user = await Applicant.findById(req.user.id);
    const newPosition = user.positions.create(positionData);
    user.positions.push(newPosition);
    await user.save();
    res.json(newPosition);
  } catch (error) {
    console.error('Error in addPosition:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get positions
exports.getPositions = async (req, res) => {
  try {
    let user = await Applicant.findById(req.user.id);
    res.json(user.positions);
  } catch (error) {
    console.error('Error in getPositions:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update a position
exports.updatePosition = async (req, res) => {
  try {
    const positionId = req.params.positionId;
    const positionData = req.body;
    let user = await Applicant.findById(req.user.id);
    let position = user.positions.id(positionId);
    if (!position) return res.status(404).json({ error: 'Position not found' });
    Object.assign(position, positionData);
    await user.save();
    res.json(position);
  } catch (error) {
    console.error('Error in updatePosition:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a position
exports.deletePosition = async (req, res) => {
  try {
    const positionId = req.params.positionId;
    let user = await Applicant.findById(req.user.id);
    user.positions.pull({_id: positionId});
    await user.save();
    res.json({ message: 'Position deleted' });
  } catch (error) {
    console.error('Error in deletePosition:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add education entry
exports.addEducation = async (req, res) => {
  try {
    const { university, degree, startYear, endYear, description } = req.body;
    let user = await Applicant.findById(req.user.id);

    if (!user) throw new Error('User not found');

    user.education.push({ university, degree, startYear, endYear, description });
    await user.save();

    res.json(user.education);
  } catch (error) {
    console.error('Error in addEducation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all education entries
exports.getEducation = async (req, res) => {
  try {
    const user = await Applicant.findById(req.user.id);
    if (!user) throw new Error('User not found');
    res.json(user.education);
  } catch (error) {
    console.error('Error in getEducation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update education entry
exports.updateEducation = async (req, res) => {
  try {
    const { educationId, university, degree, startYear, endYear, description } = req.body;
    let user = await Applicant.findById(req.user.id);

    if (!user) throw new Error('User not found');

    let educationEntry = user.education.id(educationId);
    if (!educationEntry) throw new Error('Education entry not found');

    educationEntry.university = university;
    educationEntry.degree = degree;
    educationEntry.startYear = startYear;
    educationEntry.endYear = endYear;
    educationEntry.description = description;

    await user.save();

    res.json(user.education);
  } catch (error) {
    console.error('Error in updateEducation:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEducation = async (req, res) => {
  try {
    const { educationId } = req.params;
    let user = await Applicant.findById(req.user.id);

    if (!user) throw new Error('User not found');

    user.education = user.education.filter(education => education._id.toString() !== educationId);

    await user.save();

    res.json(user.education);
  } catch (error) {
    console.error('Error in deleteEducation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add certification entry
exports.addCertification = async (req, res) => {
  try {
    const { name, authority, licenseNumber, description } = req.body;
    let user = await Applicant.findById(req.user.id);

    if (!user) throw new Error('User not found');

    user.certifications.push({ name, authority, licenseNumber, description });
    await user.save();

    res.json(user.certifications);
  } catch (error) {
    console.error('Error in addCertification:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all certification entries
exports.getCertification = async (req, res) => {
  try {
    const user = await Applicant.findById(req.user.id);

    if (!user) {
      console.error('Applicant not found:', req.user.id);
      return res.status(404).json({ error: 'Applicant not found' });
    }

    res.json(user.certifications);
  } catch (error) {
    console.error('Error in getCertification:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update certification entry
exports.updateCertification = async (req, res) => {
  try {
    const { certificationId, name, authority, licenseNumber, description } = req.body;
    let user = await Applicant.findById(req.user.id);

    if (!user) throw new Error('User not found');

    let certificationEntry = user.certifications.id(certificationId);
    if (!certificationEntry) throw new Error('Certification entry not found');

    certificationEntry.name = name;
    certificationEntry.authority = authority;
    certificationEntry.licenseNumber = licenseNumber;
    certificationEntry.description = description;

    await user.save();

    res.json(user.certifications);
  } catch (error) {
    console.error('Error in updateCertification:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete certification entry
exports.deleteCertification = async (req, res) => {
  try {
    const { certificationId } = req.params;
    let user = await Applicant.findById(req.user.id);

    if (!user) throw new Error('User not found');

    user.certifications = user.certifications.filter(certification => certification._id.toString() !== certificationId);

    await user.save();

    res.json(user.certifications);
  } catch (error) {
    console.error('Error in deleteCertification:', error);
    res.status(500).json({ error: error.message });
  }
};