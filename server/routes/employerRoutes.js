const router = require('express').Router();
const employersController = require('../controllers/employerController');
const { employerValidationRules } = require('../middleware/validationMiddleware');

router.post('/employer/register', employerValidationRules, employersController.register);
router.post('/employer/login', employersController.login);

module.exports = router;