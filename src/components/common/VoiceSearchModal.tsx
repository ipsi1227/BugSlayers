import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, AlertCircle, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { speechRecognizer, isSpeechRecognitionSupported } from '../../utils/speech';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchQuery: (query: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSearchQuery
}) => {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supported = isSpeechRecognitionSupported();

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setErrorMessage(null);
      if (supported) {
        startVoice();
      }
    } else {
      speechRecognizer.stopListening();
      setIsListening(false);
    }

    return () => {
      speechRecognizer.stopListening();
    };
  }, [isOpen]);

  const startVoice = () => {
    setErrorMessage(null);
    setTranscript('');

    const started = speechRecognizer.startListening(
      language,
      (state) => {
        setTranscript(state.transcript);
        if (state.isFinal && state.transcript.trim()) {
          // Auto apply on final result after a brief delay
          setTimeout(() => {
            onSearchQuery(state.transcript);
            onClose();
          }, 800);
        }
      },
      (error) => {
        setIsListening(false);
        setErrorMessage(error);
      },
      () => {
        setIsListening(false);
      }
    );

    setIsListening(started);
  };

  const handleManualApply = () => {
    if (transcript.trim()) {
      onSearchQuery(transcript);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-app-muted hover:text-app-text transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center justify-center space-x-1.5 text-primary text-sm font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-accent-yellow" />
          <span>KaamVoice Search</span>
        </div>
        <h3 className="text-xl font-bold text-app-text mb-1">{t.speakToFindWork}</h3>
        <p className="text-xs text-app-muted mb-6">{t.speakPrompt}</p>

        {/* Main Microphone Action Target */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="relative">
            {isListening && (
              <>
                <div className="absolute -inset-4 rounded-full bg-primary/20 animate-ping" />
                <div className="absolute -inset-2 rounded-full bg-primary/30 animate-pulse" />
              </>
            )}
            <button
              onClick={() => {
                if (isListening) {
                  speechRecognizer.stopListening();
                  setIsListening(false);
                } else {
                  startVoice();
                }
              }}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition shadow-lg ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white scale-105'
                  : 'bg-primary hover:bg-primary-hover text-white active:scale-95'
              }`}
            >
              {isListening ? (
                <Mic className="w-12 h-12 animate-pulse" />
              ) : (
                <Mic className="w-12 h-12" />
              )}
            </button>
          </div>

          <p className="mt-4 font-semibold text-sm text-app-text">
            {isListening ? (
              <span className="text-primary font-bold">{t.listening}</span>
            ) : (
              'Tap microphone to speak'
            )}
          </p>
        </div>

        {/* Live Recognized Transcript Display */}
        {transcript && (
          <div className="mt-4 p-3 bg-primary-light/50 border border-primary/30 rounded-2xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-1">
              You said:
            </span>
            <p className="text-base font-bold text-app-text capitalize">"{transcript}"</p>

            <button
              onClick={handleManualApply}
              className="mt-3 w-full py-2.5 px-4 bg-primary text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 hover:bg-primary-hover transition"
            >
              <Check className="w-4 h-4" />
              <span>Search for "{transcript}"</span>
            </button>
          </div>
        )}

        {/* Error or unsupported info */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-left flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">{errorMessage}</p>
          </div>
        )}

        {!supported && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl text-left text-xs text-app-muted">
            Voice recognition is not supported in this browser. Please use the search bar above or select a trade category.
          </div>
        )}
      </div>
    </div>
  );
};
