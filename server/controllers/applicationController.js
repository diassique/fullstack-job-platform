const Application = require('../models/Application');
const Job = require('../models/Job');

exports.createApplication = async (req, res) => {
  try {
    const existingApplication = await Application.findOne({ userId: req.user.id, jobId: req.body.jobId });
    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this job.' });
    }
    
    const job = await Job.findOne({ _id: req.body.jobId, userId: req.body.recruiterId });

    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    const application = new Application({
      ...req.body, 
      userId: req.user.id, 
      recruiterId: req.body.recruiterId, 
      jobId: req.body.jobId
    });

    // Save application
    await application.save();

    // Increment activeApplications in Job
    await Job.updateOne(
      { _id: req.body.jobId },
      { $inc: { activeApplications: 1 }}
    );

    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getApplicantApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id }).populate(['recruiterId', 'jobId']);

    // Filter out applications where the job no longer exists
    const validApplications = applications.filter(application => application.jobId);

    res.json(validApplications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployerApplications = async (req, res) => {
  try {
    const applications = await Application.find({ recruiterId: req.user.id })
      .populate('userId')
      .populate('jobId');

    // Filter out applications where the job no longer exists
    const validApplications = applications.filter(application => application.jobId);

    res.json(validApplications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateApplicationStatus = async (req, res) => {
  try {
    const updatedApplication = await Application.findOneAndUpdate(
      { _id: req.params.id, recruiterId: req.user.id },
      { status: req.body.status },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(updatedApplication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};