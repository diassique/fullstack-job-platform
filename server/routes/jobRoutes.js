const router = require('express').Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/employer/jobs', authMiddleware, jobController.getEmployerJobs);
router.get('/jobs', jobController.getAllJobs);
router.post('/jobs', authMiddleware, jobController.createJob);
router.put('/jobs/:id', authMiddleware, jobController.updateJob);
router.delete('/jobs/:id', authMiddleware, jobController.deleteJob);

module.exports = router;