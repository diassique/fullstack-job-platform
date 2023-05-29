const Job = require('../models/Job');
const Application = require('../models/Application');

exports.getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createJob = async (req, res) => {
  const job = new Job({...req.body, userId: req.user.id});
  try {
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    await Application.updateMany({ jobId: req.params.id }, { status: 'job-deleted' });
    
    res.json(deletedJob);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getEmployerStats = async (req, res) => {
  try {
    const employerId = req.params.id;
    const jobsPostedCount = await Job.countDocuments({ userId: employerId });
    const applicationsCount = await Application.countDocuments({ recruiterId: employerId });
    const acceptedApplicationsCount = await Application.countDocuments({ recruiterId: employerId, status: 'accepted' });
    const shortlistedApplicationsCount = await Application.countDocuments({ recruiterId: employerId, status: 'shortlisted' });
    const rejectedApplicationsCount = await Application.countDocuments({ recruiterId: employerId, status: 'rejected' });

    res.json({
      jobsPosted: jobsPostedCount,
      applications: applicationsCount,
      acceptedApplications: acceptedApplicationsCount,
      shortlistedApplications: shortlistedApplicationsCount,
      rejectedApplications: rejectedApplicationsCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};