const router = require('express').Router();
const applicantsController = require('../controllers/applicantController');
const { applicantValidationRules } = require('../middleware/validationMiddleware');
const { deleteAvatar, upload } = require('../controllers/applicantController');
const { resumeUpload, uploadResume, deleteResume, checkResume } = require('../controllers/applicantController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/applicant/avatar', authMiddleware, upload.single('avatar'), (req, res, next) => {
  if (!req.file) return res.status(400).send({ error: 'No file uploaded' });
  next();
}, applicantsController.uploadAvatar);
router.delete('/applicant/avatar', authMiddleware, deleteAvatar);

router.post('/applicant/resume', authMiddleware, resumeUpload.single('resume'), (req, res, next) => {
  if (!req.file) return res.status(400).send({ error: 'No file uploaded' });
  next();
}, uploadResume);
router.get('/applicant/resume', authMiddleware, checkResume);
router.delete('/applicant/resume', authMiddleware, deleteResume);
router.put('/applicant/details', authMiddleware, applicantsController.updateUserDetails);

// auth routes
router.post('/applicant/register', applicantValidationRules, applicantsController.register);
router.post('/applicant/login', applicantsController.login);

router.get('/applicants', applicantsController.getAllApplicants);
router.get('/applicants/:id', applicantsController.getApplicantById);

// CRUD job positions
router.post('/applicant/positions', authMiddleware, applicantsController.addPosition);
router.get('/applicant/positions', authMiddleware, applicantsController.getPositions);
router.put('/applicant/positions/:positionId', authMiddleware, applicantsController.updatePosition);
router.delete('/applicant/positions/:positionId', authMiddleware, applicantsController.deletePosition);

// CRUD education
router.post('/applicant/education', authMiddleware, applicantsController.addEducation);
router.get('/applicant/education', authMiddleware, applicantsController.getEducation);
router.put('/applicant/education', authMiddleware, applicantsController.updateEducation);
router.delete('/applicant/education/:educationId', authMiddleware, applicantsController.deleteEducation);

// CRUD certification
router.post('/applicant/certification', authMiddleware, applicantsController.addCertification);
router.get('/applicant/certification', authMiddleware, applicantsController.getCertification);
router.put('/applicant/certification', authMiddleware, applicantsController.updateCertification);
router.delete('/applicant/certification/:certificationId', authMiddleware, applicantsController.deleteCertification);

module.exports = router;