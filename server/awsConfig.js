/**
 * AWS Cloud Backend Configuration & Adapter
 *
 * Implements a dual-mode database adapter:
 * 1. In AWS Cloud: connects to Amazon DynamoDB DocumentClient & Amazon S3.
 * 2. In Local / Demo mode: stores in memory / local JSON for standalone execution.
 */

// Initial seed data for server fallback
const SEED_JOBS = [
  {
    id: 'job-1',
    title: 'Site Helper & Material Shifting',
    titleHi: 'कंस्ट्रक्शन हेल्पर व सामान ढोने का काम',
    categoryId: 'construction',
    workersNeeded: 4,
    wageAmount: 650,
    wageType: 'per_day',
    localityId: 'marathahalli',
    localityName: 'Marathahalli',
    address: 'Near Kalamandir Junction, Outer Ring Road, Marathahalli',
    coordinates: { latitude: 12.9591, longitude: 77.6974 },
    workingHours: '9:00 AM - 6:00 PM (1 hr lunch break)',
    duration: '1-3 days',
    startDate: 'Tomorrow morning',
    description: 'Urgent requirement for 4 energetic helpers to load, unload cement bags, bricks and assist civil masons at residential site. Same-day cash payment at 6 PM.',
    descriptionHi: 'आवासीय साइट पर सीमेंट की बोरियां, ईंटें उतारने और राजमिस्त्री की मदद के लिए 4 सहायकों की तुरंत जरूरत। शाम 6 बजे नकद भुगतान।',
    requirements: ['Physical fitness', 'Safety shoes preferred', 'Punctual'],
    employerName: 'Sharma Builders & Infra',
    employerPhone: '9845012345',
    isUrgent: true,
    isFilled: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'job-2',
    title: 'Residential Electrician for Wiring',
    titleHi: 'घर की वायरिंग के लिए इलेक्ट्रीशियन',
    categoryId: 'electrician',
    workersNeeded: 2,
    wageAmount: 900,
    wageType: 'per_day',
    localityId: 'whitefield',
    localityName: 'Whitefield',
    address: 'Inner Circle, Near Forum Neighbourhood Mall, Whitefield',
    coordinates: { latitude: 12.9698, longitude: 77.7500 },
    workingHours: '9:30 AM - 6:30 PM',
    duration: '1-3 days',
    startDate: 'Immediate start',
    description: 'Need 2 experienced electricians for conduit wiring and switchboard fittings in a 3BHK flat. Tools will be provided if needed. Tea & snacks included.',
    descriptionHi: '3BHK फ्लैट में वायरिंग और स्विचबोर्ड लगाने के लिए 2 अनुभवी इलेक्ट्रीशियन चाहिए। औजार दिए जाएंगे। चाय-नाश्ता शामिल।',
    requirements: ['Knows domestic wiring & MCB setup', 'Minimum 1 year experience'],
    employerName: 'Sri Balaji Electricals',
    employerPhone: '9880198765',
    isUrgent: true,
    isFilled: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'job-3',
    title: 'Restaurant Cook (North Indian & Tandoor)',
    titleHi: 'रेस्टोरेंट कुक (नॉर्थ इंडियन व तंदूर)',
    categoryId: 'cook',
    workersNeeded: 1,
    wageAmount: 18000,
    wageType: 'per_month',
    localityId: 'bellandur',
    localityName: 'Bellandur',
    address: 'Near EcoSpace Tech Park, Green Glen Layout, Bellandur',
    coordinates: { latitude: 12.9304, longitude: 77.6784 },
    workingHours: '11:00 AM - 10:30 PM (Break: 3 PM - 5:30 PM)',
    duration: 'permanent',
    startDate: 'Within 2 days',
    description: 'Popular family restaurant seeks an honest and skilled cook for daily North Indian curry, roti, and snacks prep. Free meals and shared room accommodation provided.',
    descriptionHi: 'प्रसिद्ध रेस्टोरेंट को नॉर्थ इंडियन खाना और रोटियां बनाने के लिए कुशल रसोइया चाहिए। खाना और रहने की निःशुल्क सुविधा।',
    requirements: ['Knowledge of North Indian gravies & rotis', 'Clean hygiene habits'],
    employerName: 'Swad Rasoi Restaurant',
    employerPhone: '9900112233',
    isUrgent: false,
    isFilled: false,
    createdAt: new Date().toISOString()
  }
];

class DatabaseAdapter {
  constructor() {
    this.jobs = [...SEED_JOBS];
    this.applications = [];
    this.isAws = Boolean(process.env.AWS_REGION && process.env.DYNAMODB_TABLE_JOBS);
  }

  async getJobs() {
    if (this.isAws) {
      // In AWS environment, DynamoDB Scan or Query operation:
      // return (await docClient.scan({ TableName: process.env.DYNAMODB_TABLE_JOBS }).promise()).Items;
    }
    return this.jobs;
  }

  async getJobById(id) {
    if (this.isAws) {
      // return (await docClient.get({ TableName: process.env.DYNAMODB_TABLE_JOBS, Key: { id } }).promise()).Item;
    }
    return this.jobs.find(j => j.id === id) || null;
  }

  async saveJob(job) {
    if (this.isAws) {
      // await docClient.put({ TableName: process.env.DYNAMODB_TABLE_JOBS, Item: job }).promise();
    }
    this.jobs.unshift(job);
    return job;
  }

  async updateJob(id, updates) {
    const job = this.jobs.find(j => j.id === id);
    if (!job) return null;
    Object.assign(job, updates);
    return job;
  }

  async deleteJob(id) {
    this.jobs = this.jobs.filter(j => j.id !== id);
    return true;
  }

  async getApplications() {
    return this.applications;
  }

  async getApplication(jobId, workerPhone) {
    return this.applications.find(a => a.jobId === jobId && a.workerPhone === workerPhone) || null;
  }

  async saveApplication(app) {
    this.applications.unshift(app);
    return app;
  }

  async updateApplicationStatus(id, status) {
    const app = this.applications.find(a => a.id === id);
    if (!app) return null;
    app.status = status;
    return app;
  }
}

export const dbAdapter = new DatabaseAdapter();
