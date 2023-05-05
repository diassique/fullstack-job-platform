const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authMiddleware = require('./middleware/authMiddleware');
const applicantRouter = require('./routes/applicantRoutes');
const employerRouter = require('./routes/employerRoutes');
const applicantController = require('./controllers/applicantController');
const employerController = require('./controllers/employerController');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/', applicantRouter);
app.use('/', employerRouter);
app.get('/me', authMiddleware, (req, res) => {
  if (req.user.role === 'Applicant') {
    applicantController.getUserData(req, res);
  } else {
    employerController.getUserData(req, res);
  }
});

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    app.listen(PORT, () => {
      console.log(`Server successfully started on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();