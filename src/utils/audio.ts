import { Job, Language } from '../types';

export interface AudioPlaybackState {
  isPlaying: boolean;
  isLoading: boolean;
  isPaused: boolean;
  currentText: string;
  source: 'elevenlabs' | 'browser_tts' | 'none';
  error?: string;
}

class KaamVoiceEngine {
  private audioElement: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private stateListeners: ((state: AudioPlaybackState) => void)[] = [];
  private audioCache = new Map<string, string>(); // text -> object URL
  
  private currentState: AudioPlaybackState = {
    isPlaying: false,
    isLoading: false,
    isPaused: false,
    currentText: '',
    source: 'none'
  };

  private updateState(updates: Partial<AudioPlaybackState>) {
    this.currentState = { ...this.currentState, ...updates };
    this.stateListeners.forEach(listener => listener(this.currentState));
  }

  public subscribe(listener: (state: AudioPlaybackState) => void): () => void {
    this.stateListeners.push(listener);
    listener(this.currentState);
    return () => {
      this.stateListeners = this.stateListeners.filter(l => l !== listener);
    };
  }

  public getState(): AudioPlaybackState {
    return this.currentState;
  }

  /**
   * Generates natural spoken script for a job in simple words
   */
  public generateJobSummaryText(job: Job, lang: Language): string {
    const wageUnit =
      job.wageType === 'per_day' ? (lang === 'hi' ? 'प्रति दिन' : 'per day') :
      job.wageType === 'per_month' ? (lang === 'hi' ? 'प्रति माह' : 'per month') :
      job.wageType === 'per_hour' ? (lang === 'hi' ? 'प्रति घंटा' : 'per hour') :
      (lang === 'hi' ? 'ठेका' : 'contract');

    if (lang === 'hi') {
      const title = job.titleHi || job.title;
      return `यह काम ${title} का है। 
स्थान है ${job.localityName}। 
कमाई है ${job.wageAmount} रुपये ${wageUnit}। 
काम का समय है ${job.workingHours}। 
मालिक या कंपनी का नाम है ${job.employerName}। 
काम शुरू करने की तारीख: ${job.startDate}। 
कुल ${job.workersNeeded} कारीगरों की जरूरत है। 
आवेदन करने के लिए नीचे दिए गए हरे बटन 'तुरंत आवेदन करें' को दबाएं। आपको कोई रेज़्यूमे देने की जरूरत नहीं है।`;
    }

    if (lang === 'kn') {
      return `ಈ ಕೆಲಸವು ${job.title} ಗಾಗಿದೆ. 
ಸ್ಥಳ: ${job.localityName}. 
ವೇತನ: ದಿನಕ್ಕೆ ಅಥವಾ ತಿಂಗಳಿಗೆ ${job.wageAmount} ರೂಪಾಯಿಗಳು. 
ಕೆಲಸದ ಸಮಯ: ${job.workingHours}. 
ಮಾಲೀಕರ ಹೆಸರು: ${job.employerName}. 
ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಕೆಳಗಿನ ಹಸಿರು ಬಟನ್ ಒತ್ತಿರಿ. ಯಾವುದೇ ರೆಸ್ಯೂಮೆ ಅಗತ್ಯವಿಲ್ಲ.`;
    }

    // Default English
    return `This job is for ${job.title}. 
Location is ${job.localityName}. 
Wage is ${job.wageAmount} rupees ${wageUnit}. 
Work timings are ${job.workingHours}. 
Employer name is ${job.employerName}. 
Duration: ${job.duration}. 
Total ${job.workersNeeded} workers needed. 
To apply, simply tap the green button below. No resume is required.`;
  }

  /**
   * Generates application confirmation speech script
   */
  public generateConfirmationText(job: Job, workerName: string, lang: Language): string {
    if (lang === 'hi') {
      return `नमस्ते ${workerName} जी। आप ${job.localityName} में ${job.titleHi || job.title} के काम के लिए आवेदन कर रहे हैं। जिसमें वेतन ${job.wageAmount} रुपये है। यदि आप सहमत हैं, तो नीचे दिए गए बटन पर क्लिक करके आवेदन पूरा करें।`;
    }
    return `Hello ${workerName}. You are confirming your application for ${job.title} in ${job.localityName} with wage of ${job.wageAmount} rupees. Tap confirm to send your details directly to the employer.`;
  }

  /**
   * Main method to speak text using ElevenLabs backend, falling back to browser SpeechSynthesis
   */
  public async speakText(text: string, lang: Language): Promise<void> {
    this.stop(); // Stop any existing audio
    this.updateState({ isLoading: true, isPlaying: false, currentText: text, error: undefined });

    // 1. Try ElevenLabs API via backend server
    try {
      const success = await this.tryPlayElevenLabs(text, lang);
      if (success) {
        return;
      }
    } catch (e) {
      console.warn('ElevenLabs API unavailable or unconfigured, falling back to browser TTS:', e);
    }

    // 2. Seamless Fallback: Browser SpeechSynthesis
    this.playBrowserTTS(text, lang);
  }

  /**
   * Calls backend /api/voice/tts which handles ElevenLabs TTS server-side
   */
  private async tryPlayElevenLabs(text: string, lang: Language): Promise<boolean> {
    // Check local memory cache
    const cacheKey = `${lang}_${text}`;
    let audioUrl = this.audioCache.get(cacheKey);

    if (!audioUrl) {
      const response = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language: lang,
          voiceId: lang === 'hi' ? 'pNInz6obpgDQGcFmaJgB' : '21m00Tcm4TlvDq8ikWAM' // Natural Hindi/Indian multilingual voice
        })
      });

      if (!response.ok) {
        throw new Error(`TTS server responded with ${response.status}`);
      }

      const audioBlob = await response.blob();
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('Empty audio stream received');
      }

      audioUrl = URL.createObjectURL(audioBlob);
      this.audioCache.set(cacheKey, audioUrl);
    }

    // Play the audio
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      this.audioElement = audio;

      audio.onplay = () => {
        this.updateState({
          isLoading: false,
          isPlaying: true,
          isPaused: false,
          source: 'elevenlabs'
        });
        resolve(true);
      };

      audio.onpause = () => {
        if (!audio.ended) {
          this.updateState({ isPaused: true, isPlaying: false });
        }
      };

      audio.onended = () => {
        this.updateState({
          isPlaying: false,
          isPaused: false,
          isLoading: false,
          source: 'none'
        });
      };

      audio.onerror = (e) => {
        reject(e);
      };

      audio.play().catch(reject);
    });
  }

  /**
   * Browser SpeechSynthesis fallback
   */
  private playBrowserTTS(text: string, lang: Language) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      this.updateState({
        isLoading: false,
        isPlaying: false,
        error: 'Speech synthesis is not supported on this device.'
      });
      return;
    }

    try {
      window.speechSynthesis.cancel(); // clear queue
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      // Select matching voice if available
      const voices = window.speechSynthesis.getVoices();
      if (lang === 'hi') {
        utterance.lang = 'hi-IN';
        const hiVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'));
        if (hiVoice) utterance.voice = hiVoice;
      } else if (lang === 'kn') {
        utterance.lang = 'kn-IN';
        const knVoice = voices.find(v => v.lang.includes('kn') || v.name.toLowerCase().includes('kannada'));
        if (knVoice) utterance.voice = knVoice;
      } else {
        utterance.lang = 'en-IN';
        const enInVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en'));
        if (enInVoice) utterance.voice = enInVoice;
      }

      utterance.rate = 0.95; // Slightly slower, easy to understand for informal workers
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        this.updateState({
          isLoading: false,
          isPlaying: true,
          isPaused: false,
          source: 'browser_tts'
        });
      };

      utterance.onpause = () => {
        this.updateState({ isPaused: true, isPlaying: false });
      };

      utterance.onresume = () => {
        this.updateState({ isPaused: false, isPlaying: true });
      };

      utterance.onend = () => {
        this.updateState({
          isPlaying: false,
          isPaused: false,
          isLoading: false,
          source: 'none'
        });
      };

      utterance.onerror = (e) => {
        console.error('Browser TTS error:', e);
        this.updateState({
          isPlaying: false,
          isLoading: false,
          source: 'none',
          error: 'Could not play voice.'
        });
      };

      window.speechSynthesis.speak(utterance);
    } catch (e: any) {
      this.updateState({
        isPlaying: false,
        isLoading: false,
        source: 'none',
        error: e.message || 'TTS Error'
      });
    }
  }

  public pause(): void {
    if (this.currentState.source === 'elevenlabs' && this.audioElement) {
      this.audioElement.pause();
    } else if (this.currentState.source === 'browser_tts' && window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
    this.updateState({ isPaused: true, isPlaying: false });
  }

  public resume(): void {
    if (this.currentState.source === 'elevenlabs' && this.audioElement) {
      this.audioElement.play();
      this.updateState({ isPaused: false, isPlaying: true });
    } else if (this.currentState.source === 'browser_tts' && window.speechSynthesis) {
      window.speechSynthesis.resume();
      this.updateState({ isPaused: false, isPlaying: true });
    }
  }

  public stop(): void {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch (e) {
        console.warn(e);
      }
      this.audioElement = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.updateState({
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      currentText: '',
      source: 'none'
    });
  }
}

export const kaamVoiceEngine = new KaamVoiceEngine();
