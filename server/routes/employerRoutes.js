const router = require('express').Router();
const employersController = require('../controllers/employerController');
const { employerValidationRules } = require('../middleware/validationMiddleware');
const { deleteAvatar, upload, getAllEmployers } = require('../controllers/employerController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/employer/avatar', authMiddleware, upload.single('avatar'), (req, res, next) => {
  if (!req.file) {
    return res.status(400).send({ error: 'No file uploaded' });
  }
  next();
}, employersController.uploadAvatar);

router.get('/employers', employersController.getAllEmployers);
router.get('/employers/:id', employersController.getEmployerById);

router.delete('/employer/avatar', authMiddleware, deleteAvatar);
router.put('/employer/details', authMiddleware, employersController.updateUserDetails)
router.post('/employer/register', employerValidationRules, employersController.register);
router.post('/employer/login', employersController.login);

module.exports = router;