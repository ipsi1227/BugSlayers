import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateSpeechAudio, getElevenLabsStatus } from './ttsService.js';
import { dbAdapter } from './awsConfig.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: process.env.AWS_REGION ? 'aws-cloud' : 'local-server',
    elevenLabs: getElevenLabsStatus(),
    timestamp: new Date().toISOString()
  });
});

// GET /api/jobs - Retrieve all jobs with optional filters
app.get('/api/jobs', async (req, res) => {
  try {
    const { category, search, locality } = req.query;
    let jobs = await dbAdapter.getJobs();

    if (category && category !== 'all') {
      jobs = jobs.filter(j => j.categoryId === category);
    }
    if (locality && locality !== 'all') {
      jobs = jobs.filter(j => j.localityId === locality);
    }
    if (search) {
      const q = String(search).toLowerCase();
      jobs = jobs.filter(j =>
        j.title.toLowerCase().includes(q) ||
        (j.titleHi && j.titleHi.toLowerCase().includes(q)) ||
        j.description.toLowerCase().includes(q) ||
        j.localityName.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/jobs/:id - Retrieve single job details
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await dbAdapter.getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    res.json({ success: true, job });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/jobs - Employer posts a new job
app.post('/api/jobs', async (req, res) => {
  try {
    const {
      title,
      categoryId,
      workersNeeded,
      wageAmount,
      wageType,
      localityId,
      localityName,
      coordinates,
      workingHours,
      duration,
      startDate,
      description,
      employerName,
      employerPhone,
      isUrgent
    } = req.body;

    // Validate mandatory fields
    if (!title || !wageAmount || !localityName || !employerName || !employerPhone) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in title, wage, locality, employer name, and contact number.'
      });
    }

    const newJob = {
      id: `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: title.trim(),
      categoryId: categoryId || 'construction',
      workersNeeded: Number(workersNeeded) || 1,
      wageAmount: Number(wageAmount),
      wageType: wageType || 'per_day',
      localityId: localityId || 'marathahalli',
      localityName: localityName.trim(),
      coordinates: coordinates || { latitude: 12.9591, longitude: 77.6974 },
      workingHours: workingHours || '9:00 AM - 6:00 PM',
      duration: duration || 'daily',
      startDate: startDate || 'Immediate start',
      description: description || title,
      employerName: employerName.trim(),
      employerPhone: employerPhone.trim(),
      isUrgent: Boolean(isUrgent),
      isFilled: false,
      createdAt: new Date().toISOString()
    };

    const saved = await dbAdapter.saveJob(newJob);
    res.status(201).json({ success: true, job: saved });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ success: false, error: 'Could not post job' });
  }
});

// PATCH /api/jobs/:id - Mark job as filled or update
app.patch('/api/jobs/:id', async (req, res) => {
  try {
    const updated = await dbAdapter.updateJob(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    res.json({ success: true, job: updated });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ success: false, error: 'Could not update job' });
  }
});

// DELETE /api/jobs/:id - Delete a job
app.delete('/api/jobs/:id', async (req, res) => {
  try {
    await dbAdapter.deleteJob(req.params.id);
    res.json({ success: true, message: 'Job removed successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ success: false, error: 'Could not delete job' });
  }
});

// POST /api/applications - Submit a one-tap application
app.post('/api/applications', async (req, res) => {
  try {
    const { jobId, workerName, workerPhone, workerSkills, workerExperience, workerLocality } = req.body;

    if (!jobId || !workerName || !workerPhone) {
      return res.status(400).json({
        success: false,
        error: 'Job ID, worker name and mobile number are required.'
      });
    }

    const job = await dbAdapter.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Check duplicate application
    const existing = await dbAdapter.getApplication(jobId, workerPhone);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'ALREADY_APPLIED',
        message: 'You have already applied for this job.'
      });
    }

    const application = {
      id: `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      jobId,
      jobTitle: job.title,
      employerName: job.employerName,
      localityName: job.localityName,
      wageAmount: job.wageAmount,
      wageType: job.wageType,
      workerName: workerName.trim(),
      workerPhone: workerPhone.trim(),
      workerSkills: Array.isArray(workerSkills) ? workerSkills : [],
      workerExperience: Number(workerExperience) || 0,
      workerLocality: workerLocality || '',
      status: 'applied',
      appliedAt: new Date().toISOString()
    };

    const saved = await dbAdapter.saveApplication(application);
    res.status(201).json({ success: true, application: saved });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ success: false, error: 'Application could not be submitted' });
  }
});

// GET /api/applications - Get all applications (or filter by phone/jobId)
app.get('/api/applications', async (req, res) => {
  try {
    const { phone, jobId } = req.query;
    let apps = await dbAdapter.getApplications();

    if (phone) {
      apps = apps.filter(a => a.workerPhone === phone);
    }
    if (jobId) {
      apps = apps.filter(a => a.jobId === jobId);
    }

    res.json({ success: true, count: apps.length, applications: apps });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PATCH /api/applications/:id - Update application status (shortlisted, hired, rejected)
app.patch('/api/applications/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['applied', 'shortlisted', 'hired', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid application status' });
    }

    const updated = await dbAdapter.updateApplicationStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    res.json({ success: true, application: updated });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ success: false, error: 'Could not update status' });
  }
});

// GET /api/employer/jobs - Employer view of posted jobs + applicants count
app.get('/api/employer/jobs', async (req, res) => {
  try {
    const { phone } = req.query;
    const allJobs = await dbAdapter.getJobs();
    const allApps = await dbAdapter.getApplications();

    const employerJobs = phone ? allJobs.filter(j => j.employerPhone === phone) : allJobs;

    const enriched = employerJobs.map(job => {
      const applicants = allApps.filter(a => a.jobId === job.id);
      return {
        ...job,
        applicantCount: applicants.length,
        applicants
      };
    });

    res.json({ success: true, count: enriched.length, jobs: enriched });
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/voice/tts - ElevenLabs Text-to-Speech audio generation
app.post('/api/voice/tts', async (req, res) => {
  try {
    const { text, voiceId, language } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Text prompt is required' });
    }

    // Call server-side ElevenLabs handler
    const audioBuffer = await generateSpeechAudio(text, voiceId, language);

    if (!audioBuffer) {
      return res.status(503).json({
        success: false,
        fallback: true,
        message: 'ElevenLabs API key not configured or generation failed. Client should fall back to browser TTS.'
      });
    }

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'public, max-age=86400' // Cache for 24h
    });

    res.send(audioBuffer);
  } catch (error) {
    console.error('TTS endpoint error:', error);
    res.status(500).json({
      success: false,
      fallback: true,
      error: error.message || 'TTS generation failed'
    });
  }
});

export default app;

const isMainModule = process.argv[1] && (process.argv[1].endsWith('server/index.js') || process.argv[1].endsWith('server\\index.js'));

if (isMainModule && !process.env.LAMBDA_TASK_ROOT) {
  app.listen(PORT, () => {
    console.log(`🚀 KaamNearby Backend API running on port ${PORT}`);
    console.log(`🔊 ElevenLabs Status:`, getElevenLabsStatus());
    console.log(`☁️ Cloud Mode: ${process.env.AWS_REGION ? 'AWS DynamoDB' : 'Local File/Memory Adapter'}`);
  });
}

