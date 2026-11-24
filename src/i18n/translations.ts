import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  findWork: string;
  postJob: string;
  myApplications: string;
  workerProfile: string;
  employerDashboard: string;
  
  // Home
  heroTitle: string;
  heroSubtitle: string;
  speakToFindWork: string;
  listening: string;
  speakPrompt: string;
  searchPlaceholder: string;
  selectLocation: string;
  useMyLocation: string;
  locationPermissionDenied: string;
  locationDetecting: string;
  inRadius: string;
  allDistance: string;
  nearbyJobs: string;
  urgentHiring: string;
  viewAllJobs: string;
  categories: string;
  
  // Job Card & Details
  workersNeeded: string;
  perDay: string;
  perMonth: string;
  perHour: string;
  contract: string;
  workingHours: string;
  duration: string;
  startDate: string;
  vacancies: string;
  employer: string;
  contact: string;
  applyNow: string;
  applied: string;
  callEmployer: string;
  safetyNotice: string;
  safetyNoticeDesc: string;
  listenToJob: string;
  listenAudioGuide: string;
  stopAudio: string;
  
  // Application
  applyTitle: string;
  confirmDetails: string;
  yourName: string;
  yourPhone: string;
  yourSkills: string;
  enterValidPhone: string;
  enterValidName: string;
  submitApplication: string;
  applicationSuccess: string;
  alreadyApplied: string;
  applicationConfirmationVoice: string;
  noResumeNeeded: string;
  
  // Filters & Sorting
  filterTitle: string;
  sortBy: string;
  sortDistance: string;
  sortWage: string;
  sortRecent: string;
  allCategories: string;
  distanceFilter: string;
  wageFilter: string;
  urgentOnly: string;
  clearFilters: string;
  noJobsFound: string;
  noJobsFoundDesc: string;
  
  // Employer
  postJobTitle: string;
  postJobDesc: string;
  jobTitleInput: string;
  categorySelect: string;
  wageAmountInput: string;
  wageTypeSelect: string;
  localitySelect: string;
  fullAddressInput: string;
  hoursInput: string;
  durationSelect: string;
  startDateInput: string;
  workersCountInput: string;
  descriptionInput: string;
  employerNameInput: string;
  employerPhoneInput: string;
  publishJob: string;
  jobPostedSuccess: string;
  activeJobs: string;
  filledJobs: string;
  totalApplicants: string;
  markFilled: string;
  markActive: string;
  deleteJob: string;
  viewApplicants: string;
  noApplicantsYet: string;
  hire: string;
  shortlist: string;
  reject: string;
  status: string;

  // Statuses
  statusApplied: string;
  statusShortlisted: string;
  statusHired: string;
  statusRejected: string;
  
  // Mode & Footer
  demoModeNotice: string;
  cloudModeNotice: string;
  demoDisclaimer: string;
  switchToCloud: string;
  switchToDemo: string;
  poweredBy: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'KaamNearby',
    tagline: 'Work nearby. Get hired simply.',
    findWork: 'Find Work',
    postJob: 'Hire Workers',
    myApplications: 'My Applications',
    workerProfile: 'My Profile',
    employerDashboard: 'Employer Dashboard',
    
    heroTitle: 'Find work near you',
    heroSubtitle: 'Daily wage, temporary and full-time jobs nearby. No resume needed.',
    speakToFindWork: 'Speak to find work',
    listening: 'Listening... Speak now',
    speakPrompt: 'e.g., "Electrician work near me" or "Kitchen helper job"',
    searchPlaceholder: 'Search by job, trade or skill (e.g. Electrician, Cook, Helper)...',
    selectLocation: 'Your Area',
    useMyLocation: 'Use My Current Location',
    locationPermissionDenied: 'Location permission was denied. Please select your area manually.',
    locationDetecting: 'Detecting location...',
    inRadius: 'Within',
    allDistance: 'Any distance',
    nearbyJobs: 'Jobs Near You',
    urgentHiring: 'Urgent Hiring Today',
    viewAllJobs: 'View All Jobs',
    categories: 'Browse Work by Trade',
    
    workersNeeded: 'workers needed',
    perDay: '/ day',
    perMonth: '/ month',
    perHour: '/ hour',
    contract: 'fixed contract',
    workingHours: 'Work Timings',
    duration: 'Duration',
    startDate: 'Start Date',
    vacancies: 'Open Vacancies',
    employer: 'Employer',
    contact: 'Contact Number',
    applyNow: 'Apply Now (No Resume)',
    applied: 'Applied ✓',
    callEmployer: 'Call Employer',
    safetyNotice: 'Trust & Safety',
    safetyNoticeDesc: 'Never pay any money to get a job. Verified local employers never ask for advance fees.',
    listenToJob: '🔊 Listen to Job (KaamVoice)',
    listenAudioGuide: 'Listen in simple words',
    stopAudio: '⏹ Stop Audio',
    
    applyTitle: 'Quick Job Application',
    confirmDetails: 'Confirm your contact details to apply. The employer will call you directly.',
    yourName: 'Your Full Name',
    yourPhone: 'Your Mobile Number (10 digits)',
    yourSkills: 'Your Trade / Skills',
    enterValidPhone: 'Please enter a valid 10-digit mobile number',
    enterValidName: 'Please enter your name',
    submitApplication: 'Confirm & Apply (1-Tap)',
    applicationSuccess: 'Application submitted successfully! The employer has received your details.',
    alreadyApplied: 'You have already applied for this job.',
    applicationConfirmationVoice: 'Listen to confirmation before applying',
    noResumeNeeded: 'No resume or lengthy form required',
    
    filterTitle: 'Filter & Sort',
    sortBy: 'Sort By',
    sortDistance: 'Nearest First',
    sortWage: 'Highest Wage',
    sortRecent: 'Newly Added',
    allCategories: 'All Categories',
    distanceFilter: 'Distance',
    wageFilter: 'Wage Range',
    urgentOnly: 'Urgent Hiring Only',
    clearFilters: 'Reset Filters',
    noJobsFound: 'No jobs found matching your criteria',
    noJobsFoundDesc: 'Try expanding your distance or searching for different skills like Helper, Driver, Cook, Painter.',
    
    postJobTitle: 'Hire Workers / Post a Job',
    postJobDesc: 'Post your requirement in 1 minute. Local workers will see your job instantly.',
    jobTitleInput: 'Job Title (e.g. 2 helpers needed for warehouse loading)',
    categorySelect: 'Trade Category',
    wageAmountInput: 'Wage Amount (₹)',
    wageTypeSelect: 'Payment Frequency',
    localitySelect: 'Locality / Area',
    fullAddressInput: 'Full Address / Landmark',
    hoursInput: 'Working Hours (e.g. 9 AM - 6 PM)',
    durationSelect: 'Job Duration',
    startDateInput: 'When should they start?',
    workersCountInput: 'Number of Workers Needed',
    descriptionInput: 'Simple Job Description',
    employerNameInput: 'Your Name or Business Name',
    employerPhoneInput: 'Contact Phone Number',
    publishJob: 'Publish Job Now',
    jobPostedSuccess: 'Job posted successfully! It is now live for nearby workers.',
    activeJobs: 'Active Listings',
    filledJobs: 'Filled Positions',
    totalApplicants: 'Total Applicants',
    markFilled: 'Mark as Filled',
    markActive: 'Reactivate Job',
    deleteJob: 'Remove Job',
    viewApplicants: 'View Applicants',
    noApplicantsYet: 'No workers have applied yet.',
    hire: 'Hire Worker',
    shortlist: 'Shortlist',
    reject: 'Not Suitable',
    status: 'Status',

    statusApplied: 'Applied',
    statusShortlisted: 'Shortlisted',
    statusHired: 'Hired 🎉',
    statusRejected: 'Not Selected',
    
    demoModeNotice: 'Demo Mode (Local Data)',
    cloudModeNotice: 'Cloud Mode (AWS API)',
    demoDisclaimer: 'Demo data for testing in Bengaluru areas. Verified numbers will be used in production.',
    switchToCloud: 'Connect to AWS Cloud Backend',
    switchToDemo: 'Switch to Offline Local Mode',
    poweredBy: 'Accessibility powered by ElevenLabs Voice AI & AWS Cloud Architecture'
  },

  hi: {
    appName: 'कामNearby',
    tagline: 'नज़दीक काम पाएं, आसानी से जुड़ें।',
    findWork: 'काम खोजें',
    postJob: 'मजदूर / कारीगर बुलाएं',
    myApplications: 'मेरे आवेदन',
    workerProfile: 'मेरी प्रोफाइल',
    employerDashboard: 'मालिक डैशबोर्ड',
    
    heroTitle: 'अपने नज़दीक काम खोजें',
    heroSubtitle: 'दिहाड़ी, ठेका और महीने का काम। बिना किसी रेज़्यूमे या कागज़ी झंझट के।',
    speakToFindWork: 'बोलकर काम खोजें',
    listening: 'सुन रहे हैं... अब बोलें',
    speakPrompt: 'जैसे: "मराठाहल्ली में इलेक्ट्रीशियन का काम" या "हेल्पर का काम चाहिए"',
    searchPlaceholder: 'काम या हुनर लिखें (जैसे: बिजली मिस्त्री, कुक, हेल्पर, पेंटर)...',
    selectLocation: 'आपका इलाका',
    useMyLocation: 'मेरी लोकेशन पहचानें (GPS)',
    locationPermissionDenied: 'लोकेशन अनुमति नहीं मिली। कृपया सूची से अपना इलाका चुनें।',
    locationDetecting: 'स्थान पहचाना जा रहा है...',
    inRadius: 'दूरी:',
    allDistance: 'कोई भी दूरी',
    nearbyJobs: 'आपके नज़दीक उपलब्ध काम',
    urgentHiring: 'आज तुरंत जरूरत',
    viewAllJobs: 'सभी काम देखें',
    categories: 'काम की श्रेणी चुनें',
    
    workersNeeded: 'कारीगर चाहिए',
    perDay: '/ दिन',
    perMonth: '/ महीना',
    perHour: '/ घंटा',
    contract: 'ठेका काम',
    workingHours: 'काम का समय',
    duration: 'अवधि',
    startDate: 'शुरुआत',
    vacancies: 'खाली जगह',
    employer: 'मालिक / ठेकेदार',
    contact: 'फोन नंबर',
    applyNow: 'तुरंत आवेदन करें (बिना रेज़्यूमे)',
    applied: 'आवेदन किया गया ✓',
    callEmployer: 'मालिक को फोन करें',
    safetyNotice: 'सुरक्षा और भरोसा',
    safetyNoticeDesc: 'काम पाने के लिए कभी किसी को पैसे न दें। सही मालिक कभी पहले पैसे नहीं मांगते।',
    listenToJob: '🔊 काम की जानकारी सुनें (KaamVoice)',
    listenAudioGuide: 'आसान आवाज़ में सुनें',
    stopAudio: '⏹ आवाज़ बंद करें',
    
    applyTitle: 'आसान आवेदन',
    confirmDetails: 'मालिक आपसे सीधे फोन पर बात करेंगे। अपना विवरण जांचें।',
    yourName: 'आपका पूरा नाम',
    yourPhone: 'आपका मोबाइल नंबर (10 अंक)',
    yourSkills: 'आपका काम / हुनर',
    enterValidPhone: 'कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें',
    enterValidName: 'कृपया अपना नाम दर्ज करें',
    submitApplication: 'आवेदन भेजें (1-टैप)',
    applicationSuccess: 'आवेदन सफलता से भेज दिया गया! मालिक को आपका नंबर मिल गया है।',
    alreadyApplied: 'आप इस काम के लिए पहले ही आवेदन कर चुके हैं।',
    applicationConfirmationVoice: 'आवेदन से पहले बोलकर सुनें',
    noResumeNeeded: 'किसी रेज़्यूमे या सीवी की ज़रूरत नहीं है',
    
    filterTitle: 'फ़िल्टर और छंटाई',
    sortBy: 'क्रम से लगाएं',
    sortDistance: 'सबसे नज़दीक पहले',
    sortWage: 'अधिकतम कमाई',
    sortRecent: 'नया काम',
    allCategories: 'सभी श्रेणियां',
    distanceFilter: 'दूरी दायरा',
    wageFilter: 'वेतन दायरा',
    urgentOnly: 'केवल तुरंत ज़रूरत वाले',
    clearFilters: 'फ़िल्टर हटाएं',
    noJobsFound: 'इस खोज के अनुसार कोई काम नहीं मिला',
    noJobsFoundDesc: 'दूरी का दायरा बढ़ाएं या हेल्पर, कुक, ड्राइवर, पेंटर जैसे अन्य काम खोजें।',
    
    postJobTitle: 'काम पोस्ट करें / मजदूर खोजें',
    postJobDesc: 'सिर्फ 1 मिनट में काम डालें। नज़दीकी कारीगरों तक तुरंत पहुंचेगा।',
    jobTitleInput: 'काम का शीर्षक (जैसे: दुकान के लिए 2 हेल्पर चाहिए)',
    categorySelect: 'काम की श्रेणी',
    wageAmountInput: 'वेतन राशि (₹)',
    wageTypeSelect: 'भुगतान का तरीका',
    localitySelect: 'इलाका / क्षेत्र',
    fullAddressInput: 'पूरा पता व पहचान चिह्न (Landmark)',
    hoursInput: 'काम के घंटे (जैसे: सुबह 9 से शाम 6)',
    durationSelect: 'काम की अवधि',
    startDateInput: 'काम कब शुरू होगा?',
    workersCountInput: 'कितने लोग चाहिए?',
    descriptionInput: 'काम का विवरण (सरल शब्दों में)',
    employerNameInput: 'आपका नाम या दुकान/कंपनी का नाम',
    employerPhoneInput: 'संपर्क फोन नंबर',
    publishJob: 'काम अभी पोस्ट करें',
    jobPostedSuccess: 'काम सफलतापूर्वक पोस्ट हुआ! नज़दीकी कारीगरों को अब यह दिखाई देगा।',
    activeJobs: 'सक्रिय काम',
    filledJobs: 'भरे हुए काम',
    totalApplicants: 'कुल आवेदक',
    markFilled: 'काम पूरा हुआ (बंद करें)',
    markActive: 'फिर से चालू करें',
    deleteJob: 'हटाएं',
    viewApplicants: 'आवेदक देखें',
    noApplicantsYet: 'अभी तक किसी ने आवेदन नहीं किया है।',
    hire: 'काम पर रखें',
    shortlist: 'शॉर्टलिस्ट करें',
    reject: 'अस्वीकार करें',
    status: 'स्थिति',

    statusApplied: 'आवेदन प्राप्त',
    statusShortlisted: 'शॉर्टलिस्ट किया',
    statusHired: 'काम पर रखा गया 🎉',
    statusRejected: 'स्वीकृत नहीं',
    
    demoModeNotice: 'डेमो मोड (लोकल डेटा)',
    cloudModeNotice: 'क्लाउड मोड (AWS API)',
    demoDisclaimer: 'यह बेंगलुरु क्षेत्र का डेमो डेटा है। वास्तविक फोन नंबर उत्पादन में उपयोग होंगे।',
    switchToCloud: 'AWS क्लाउड बैकएंड से जोड़ें',
    switchToDemo: 'ऑफ़लाइन लोकल मोड में बदलें',
    poweredBy: 'ElevenLabs वॉयस AI और AWS क्लाउड आर्किटेक्चर द्वारा समर्थित'
  },

  kn: {
    appName: 'ಕಾಮ್‌Nearby',
    tagline: 'ಹತ್ತಿರದಲ್ಲೇ ಕೆಲಸ ಹುಡುಕಿ. ಸುಲಭವಾಗಿ ನೇಮಕಗೊಳ್ಳಿ.',
    findWork: 'ಕೆಲಸ ಹುಡುಕಿ',
    postJob: 'ಕೆಲಸಗಾರರನ್ನು ನೇಮಿಸಿ',
    myApplications: 'ನನ್ನ ಅರ್ಜಿಗಳು',
    workerProfile: 'ನನ್ನ ಪ್ರೊಫೈಲ್',
    employerDashboard: 'ಉದ್ಯೋಗದಾತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    
    heroTitle: 'ನಿಮ್ಮ ಹತ್ತಿರ ಕೆಲಸ ಹುಡುಕಿ',
    heroSubtitle: 'ದೈನಂದಿನ ಕೂಲಿ, ಗುತ್ತಿಗೆ ಮತ್ತು ಕಾಯಂ ಕೆಲಸಗಳು. ರೆಸ್ಯೂಮೆ ಅಗತ್ಯವಿಲ್ಲ.',
    speakToFindWork: 'ಮಾತನಾಡಿ ಕೆಲಸ ಹುಡುಕಿ',
    listening: 'ಕೇಳುತ್ತಿದ್ದೇವೆ... ಈಗ ಮಾತನಾಡಿ',
    speakPrompt: 'ಉದಾ: "ನನ್ನ ಹತ್ತಿರ ಎಲೆಕ್ಟ್ರಿಷಿಯನ್ ಕೆಲಸ" ಅಥವಾ "ಕಿಚನ್ ಹೆಲ್ಪರ್ ಕೆಲಸ"',
    searchPlaceholder: 'ಕೆಲಸ ಅಥವಾ ಕೌಶಲ್ಯವನ್ನು ಹುಡುಕಿ (ಉದಾ: ಎಲೆಕ್ಟ್ರಿಷಿಯನ್, ಕುಕ್, ಹೆಲ್ಪರ್)...',
    selectLocation: 'ನಿಮ್ಮ ಪ್ರದೇಶ',
    useMyLocation: 'ನನ್ನ ಪ್ರಸ್ತುತ ಸ್ಥಳವನ್ನು ಬಳಸಿ (GPS)',
    locationPermissionDenied: 'ಸ್ಥಳದ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಪ್ರದೇಶವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    locationDetecting: 'ಸ್ಥಳ ಗುರುತಿಸಲಾಗುತ್ತಿದೆ...',
    inRadius: 'ವ್ಯಾಪ್ತಿ:',
    allDistance: 'ಯಾವುದೇ ದೂರ',
    nearbyJobs: 'ನಿಮ್ಮ ಹತ್ತಿರದ ಉದ್ಯೋಗಗಳು',
    urgentHiring: 'ಇಂದು ತುರ್ತು ನೇಮಕಾತಿ',
    viewAllJobs: 'ಎಲ್ಲಾ ಕೆಲಸಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    categories: 'ಕೆಲಸದ ವರ್ಗಗಳು',
    
    workersNeeded: 'ಕೆಲಸಗಾರರು ಬೇಕಾಗಿದ್ದಾರೆ',
    perDay: '/ ದಿನಕ್ಕೆ',
    perMonth: '/ ತಿಂಗಳಿಗೆ',
    perHour: '/ ಗಂಟೆಗೆ',
    contract: 'ಗುತ್ತಿಗೆ ಕೆಲಸ',
    workingHours: 'ಕೆಲಸದ ಸಮಯ',
    duration: 'ಅವಧಿ',
    startDate: 'ಪ್ರಾರಂಭ ದಿನಾಂಕ',
    vacancies: 'ಖಾಲಿ ಹುದ್ದೆಗಳು',
    employer: 'ಮಾಲೀಕ / ಗುತ್ತಿಗೆದಾರ',
    contact: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
    applyNow: 'ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ (ರೆಸ್ಯೂಮೆ ಇಲ್ಲದೆ)',
    applied: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಲಾಗಿದೆ ✓',
    callEmployer: 'ಮಾಲೀಕರಿಗೆ ಕರೆ ಮಾಡಿ',
    safetyNotice: 'ಸುರಕ್ಷತೆ ಮತ್ತು ನಂಬಿಕೆ',
    safetyNoticeDesc: 'ಕೆಲಸ ಪಡೆಯಲು ಹಣ ನೀಡಬೇಡಿ. ಅಧಿಕೃತ ಮಾಲೀಕರು ಹಣ ಕೇಳುವುದಿಲ್ಲ.',
    listenToJob: '🔊 ಕೆಲಸದ ವಿವರಗಳನ್ನು ಆಲಿಸಿ (KaamVoice)',
    listenAudioGuide: 'ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಆಲಿಸಿ',
    stopAudio: '⏹ ನಿಲ್ಲಿಸಿ',
    
    applyTitle: 'ತ್ವರಿತ ಅರ್ಜಿ',
    confirmDetails: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ದೃಢೀಕರಿಸಿ.',
    yourName: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು',
    yourPhone: 'ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (10 ಅಂಕಿ)',
    yourSkills: 'ನಿಮ್ಮ ಕೌಶಲ್ಯ',
    enterValidPhone: 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
    enterValidName: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
    submitApplication: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ (1-ಟ್ಯಾಪ್)',
    applicationSuccess: 'ಅರ್ಜಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ!',
    alreadyApplied: 'ನೀವು ಈಗಾಗಲೇ ಈ ಕೆಲಸಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿದ್ದೀರಿ.',
    applicationConfirmationVoice: 'ದೃಢೀಕರಣ ಆಲಿಸಿ',
    noResumeNeeded: 'ಯಾವುದೇ ರೆಸ್ಯೂಮೆ ಅಗತ್ಯವಿಲ್ಲ',
    
    filterTitle: 'ಫಿಲ್ಟರ್ ಮತ್ತು ವಿಂಗಡಣೆ',
    sortBy: 'ವಿಂಗಡಿಸಿ',
    sortDistance: 'ಹತ್ತಿರದ ಮೊದಲಿಗೆ',
    sortWage: 'ಹೆಚ್ಚು ಸಂಬಳ',
    sortRecent: 'ಹೊಸದಾಗಿ ಸೇರಿಸಲಾದ',
    allCategories: 'ಎಲ್ಲಾ ವರ್ಗಗಳು',
    distanceFilter: 'ದೂರ',
    wageFilter: 'ಸಂಬಳ ವ್ಯಾಪ್ತಿ',
    urgentOnly: 'ತುರ್ತು ನೇಮಕಾತಿ ಮಾತ್ರ',
    clearFilters: 'ಫಿಲ್ಟರ್ ತೆಗೆದುಹಾಕಿ',
    noJobsFound: 'ಯಾವುದೇ ಉದ್ಯೋಗಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    noJobsFoundDesc: 'ಹೆಚ್ಚು ದೂರದ ವ್ಯಾಪ್ತಿ ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಇತರ ಕೌಶಲ್ಯಗಳನ್ನು ಹುಡುಕಿ.',
    
    postJobTitle: 'ಕೆಲಸ ಪ್ರಕಟಿಸಿ / ಕೆಲಸಗಾರರನ್ನು ಹುಡುಕಿ',
    postJobDesc: '1 ನಿಮಿಷದಲ್ಲಿ ನಿಮ್ಮ ಕೆಲಸವನ್ನು ಪ್ರಕಟಿಸಿ.',
    jobTitleInput: 'ಕೆಲಸದ ಹೆಸರು (ಉದಾ: ಅಂಗಡಿಗೆ 2 ಸಹಾಯಕರು ಬೇಕು)',
    categorySelect: 'ಕೆಲಸದ ವರ್ಗ',
    wageAmountInput: 'ಸಂಬಳದ ಮೊತ್ತ (₹)',
    wageTypeSelect: 'ಪಾವತಿ ವಿಧಾನ',
    localitySelect: 'ಪ್ರದೇಶ',
    fullAddressInput: 'ವಿಳಾಸ',
    hoursInput: 'ಕೆಲಸದ ಸಮಯ',
    durationSelect: 'ಅವಧಿ',
    startDateInput: 'ಪ್ರಾರಂಭ ಯಾವಾಗ?',
    workersCountInput: 'ಎಷ್ಟು ಜನರು ಬೇಕು?',
    descriptionInput: 'ಕೆಲಸದ ವಿವರ',
    employerNameInput: 'ನಿಮ್ಮ ಹೆಸರು ಅಥವಾ ಸಂಸ್ಥೆ',
    employerPhoneInput: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
    publishJob: 'ಈಗಲೇ ಪ್ರಕಟಿಸಿ',
    jobPostedSuccess: 'ಕೆಲಸವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಕಟಿಸಲಾಗಿದೆ!',
    activeJobs: 'ಸಕ್ರಿಯ ಉದ್ಯೋಗಗಳು',
    filledJobs: 'ಭರ್ತಿಯಾದ ಹುದ್ದೆಗಳು',
    totalApplicants: 'ಒಟ್ಟು ಅರ್ಜಿದಾರರು',
    markFilled: 'ಭರ್ತಿಯಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ',
    markActive: 'ಮತ್ತೆ ಸಕ್ರಿಯಗೊಳಿಸಿ',
    deleteJob: 'ತೆಗೆದುಹಾಕಿ',
    viewApplicants: 'ಅರ್ಜಿದಾರರನ್ನು ವೀಕ್ಷಿಸಿ',
    noApplicantsYet: 'ಇನ್ನೂ ಯಾರೂ ಅರ್ಜಿ ಸಲ್ಲಿಸಿಲ್ಲ.',
    hire: 'ನೇಮಕ ಮಾಡಿಕೊಳ್ಳಿ',
    shortlist: 'ಆಯ್ಕೆಪಟ್ಟಿ',
    reject: 'ತಿರಸ್ಕರಿಸಿ',
    status: 'ಸ್ಥಿತಿ',

    statusApplied: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಲಾಗಿದೆ',
    statusShortlisted: 'ಆಯ್ಕೆಪಟ್ಟಿಯಲ್ಲಿದೆ',
    statusHired: 'ನೇಮಕ ಮಾಡಲಾಗಿದೆ 🎉',
    statusRejected: 'ಆಯ್ಕೆಯಾಗಿಲ್ಲ',
    
    demoModeNotice: 'ಡೆಮೊ ಮೋಡ್ (ಲೋಕಲ್ ಡೇಟಾ)',
    cloudModeNotice: 'ಕ್ಲೌಡ್ ಮೋಡ್ (AWS API)',
    demoDisclaimer: 'ಡೆಮೊ ಡೇಟಾ. ಬೆಂಗಳೂರು ಪ್ರದೇಶ.',
    switchToCloud: 'AWS ಕ್ಲೌಡ್‌ಗೆ ಬದಲಿಸಿ',
    switchToDemo: 'ಆಫ್‌ಲೈನ್ ಡೆಮೊಗೆ ಬದಲಿಸಿ',
    poweredBy: 'ElevenLabs Voice AI ಮತ್ತು AWS ಕ್ಲೌಡ್ ಆರ್ಕಿಟೆಕ್ಚರ್ ನಿಂದ ಚಾಲಿತ'
  }
};
