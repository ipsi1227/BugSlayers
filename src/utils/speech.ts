import { Language } from '../types';

export interface SpeechRecognitionResultState {
  transcript: string;
  isFinal: boolean;
  error?: string;
}

// Browser SpeechRecognition definition
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as unknown as IWindow;
  return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
}

export class SpeechRecognizer {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as unknown as IWindow;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
      }
    }
  }

  public startListening(
    lang: Language,
    onResult: (state: SpeechRecognitionResultState) => void,
    onError: (errorMessage: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.recognition) {
      onError('SPEECH_NOT_SUPPORTED');
      return false;
    }

    try {
      // Set language for speech recognition
      if (lang === 'hi') {
        this.recognition.lang = 'hi-IN';
      } else if (lang === 'kn') {
        this.recognition.lang = 'kn-IN';
      } else {
        this.recognition.lang = 'en-IN';
      }

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const transcript = finalTranscript || interimTranscript;
        onResult({
          transcript: cleanQuery(transcript),
          isFinal: Boolean(finalTranscript)
        });
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        const err = event.error;
        let message = 'Could not access microphone.';
        if (err === 'not-allowed' || err === 'permission-denied') {
          message = 'Microphone permission denied. Please allow microphone access or type your search.';
        } else if (err === 'no-speech') {
          message = 'No speech was detected. Please tap and speak again.';
        }
        onError(message);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
      return true;
    } catch (e: any) {
      this.isListening = false;
      onError(e.message || 'Error starting speech recognition');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.error('Error stopping speech:', e);
      }
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

/**
 * Strips conversational filler phrases to improve search matching
 * e.g., "मुझे हेल्पर का काम चाहिए" -> "हेल्पर"
 * e.g., "Find electrician jobs near me" -> "electrician"
 */
function cleanQuery(query: string): string {
  if (!query) return '';
  let cleaned = query.trim();
  
  // Remove filler English phrases
  const enFillers = [
    /^find\s+/i,
    /^show\s+me\s+/i,
    /^i\s+need\s+/i,
    /^i\s+want\s+/i,
    /^looking\s+for\s+/i,
    /\s+jobs?\s+near\s+me$/i,
    /\s+work\s+near\s+me$/i,
    /\s+near\s+me$/i,
    /\s+work$/i,
    /\s+jobs?$/i
  ];

  // Remove filler Hindi phrases
  const hiFillers = [
    /^मुझे\s+/i,
    /^हमें\s+/i,
    /\s+का\s+काम\s+चाहिए$/i,
    /\s+का\s+काम$/i,
    /\s+की\s+नौकरी$/i,
    /\s+के\s+लिए\s+काम$/i,
    /\s+काम$/i,
    /\s+चाहिए$/i,
    /\s+दिखाओ$/i,
    /\s+बताओ$/i,
    /\s+पास\s+में$/i
  ];

  enFillers.forEach(f => {
    cleaned = cleaned.replace(f, '');
  });

  hiFillers.forEach(f => {
    cleaned = cleaned.replace(f, '');
  });

  return cleaned.trim() || query.trim();
}

export const speechRecognizer = new SpeechRecognizer();
