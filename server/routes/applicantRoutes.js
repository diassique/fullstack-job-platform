const router = require('express').Router();
const applicantsController = require('../controllers/applicantController');
const { applicantValidationRules } = require('../middleware/validationMiddleware');

router.post('/applicant/register', applicantValidationRules, applicantsController.register);
router.post('/applicant/login', applicantsController.login);

module.exports = router;