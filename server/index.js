const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authMiddleware = require('./middleware/authMiddleware');
const applicantRouter = require('./routes/applicantRoutes');
const employerRouter = require('./routes/employerRoutes');
const jobRouter = require('./routes/jobRoutes');
const applicationRouter = require('./routes/applicationRoutes');
const applicantController = require('./controllers/applicantController');
const employerController = require('./controllers/employerController');
const connectDB = require('./db');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/', applicantRouter);
app.use('/', employerRouter);
app.use('/', jobRouter);
app.use('/', applicationRouter);

app.get('/me', authMiddleware, async (req, res) => {
  try {
    let user;
    switch (req.user.role) {
      case 'Applicant':
        user = await applicantController.getUserDetails(req, res);
        break;
      case 'Employer':
        user = await employerController.getUserDetails(req, res);
        break;
      default:
        return res.status(400).json({ error: 'Invalid user role' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error in getUserDetails:', error);
    res.status(500).json({ error: error.message });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server successfully started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
  });