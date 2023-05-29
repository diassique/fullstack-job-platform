const router = require('express').Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/applicant/applications', authMiddleware, applicationController.getApplicantApplications);
router.get('/employer/applications', authMiddleware, applicationController.getEmployerApplications);
router.post('/applications', authMiddleware, applicationController.createApplication);
router.put('/applications/:id', authMiddleware, applicationController.updateApplicationStatus);

module.exports = router;