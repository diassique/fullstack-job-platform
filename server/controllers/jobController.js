const Job = require('../models/Job');

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
    res.json(deletedJob);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};