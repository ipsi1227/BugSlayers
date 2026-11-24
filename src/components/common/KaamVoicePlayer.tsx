import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Loader2, Sparkles } from 'lucide-react';
import { Job } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { kaamVoiceEngine, AudioPlaybackState } from '../../utils/audio';

interface KaamVoicePlayerProps {
  job: Job;
  className?: string;
}

export const KaamVoicePlayer: React.FC<KaamVoicePlayerProps> = ({ job, className = '' }) => {
  const { language, t } = useLanguage();
  const [audioState, setAudioState] = useState<AudioPlaybackState>(kaamVoiceEngine.getState());
  const [showSpokenText, setShowSpokenText] = useState(false);

  useEffect(() => {
    const unsubscribe = kaamVoiceEngine.subscribe((state) => {
      setAudioState(state);
    });
    return () => {
      unsubscribe();
      kaamVoiceEngine.stop();
    };
  }, []);

  const spokenText = kaamVoiceEngine.generateJobSummaryText(job, language);

  const handlePlay = () => {
    if (audioState.isPaused) {
      kaamVoiceEngine.resume();
    } else {
      kaamVoiceEngine.speakText(spokenText, language);
    }
  };

  const handlePause = () => {
    kaamVoiceEngine.pause();
  };

  const handleReplay = () => {
    kaamVoiceEngine.speakText(spokenText, language);
  };

  const handleStop = () => {
    kaamVoiceEngine.stop();
  };

  return (
    <div className={`bg-gradient-to-r from-[#E8F3E9] to-[#FEF9E7] border border-primary/30 rounded-2xl p-4 sm:p-5 shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Title and Voice Badge */}
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-primary-dark uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-accent-yellow fill-accent-yellow" />
                <span>KaamVoice</span>
              </span>
              <span className="text-[10px] bg-white/80 border border-primary/20 text-primary-dark px-2 py-0.5 rounded-full font-semibold">
                {audioState.source === 'elevenlabs' ? 'ElevenLabs AI' : 'Spoken Audio'}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-app-text leading-tight mt-0.5">
              {t.listenToJob}
            </h4>
            <p className="text-xs text-app-muted">
              {t.listenAudioGuide} (Wage, location & duties explained)
            </p>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {audioState.isLoading ? (
            <button
              disabled
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-primary/20 text-primary font-bold text-sm"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating Audio...</span>
            </button>
          ) : audioState.isPlaying ? (
            <>
              <button
                onClick={handlePause}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary-hover transition"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
              <button
                onClick={handleStop}
                className="p-2.5 rounded-xl bg-white border border-app-border text-app-muted hover:text-red-600 transition"
                title="Stop Audio"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handlePlay}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary-hover active:scale-[0.98] transition"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{audioState.isPaused ? 'Resume' : 'Play Audio'}</span>
              </button>
              {audioState.currentText && (
                <button
                  onClick={handleReplay}
                  className="p-2.5 rounded-xl bg-white border border-app-border text-app-muted hover:text-primary transition"
                  title="Replay from start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          {/* Toggle Transcript View */}
          <button
            onClick={() => setShowSpokenText(!showSpokenText)}
            className="text-xs text-primary font-semibold underline px-2 py-1"
          >
            {showSpokenText ? 'Hide text' : 'Read script'}
          </button>
        </div>
      </div>

      {/* Spoken Text Transcript Drawer */}
      {showSpokenText && (
        <div className="mt-3 pt-3 border-t border-primary/20 text-xs sm:text-sm text-app-text leading-relaxed whitespace-pre-line bg-white/70 p-3 rounded-xl">
          <p className="font-medium">{spokenText}</p>
        </div>
      )}
    </div>
  );
};
