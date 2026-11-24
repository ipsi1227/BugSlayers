/**
 * ElevenLabs Text-to-Speech Service
 *
 * Keeps API keys strictly server-side.
 * Uses official ElevenLabs TTS REST API with the multilingual v2 model.
 * Caches synthesized audio in memory to minimize API consumption and cost.
 */

const audioCache = new Map(); // SHA or string text -> Buffer

export function getElevenLabsStatus() {
  const hasKey = Boolean(process.env.ELEVENLABS_API_KEY);
  return {
    configured: hasKey,
    model: 'eleven_multilingual_v2',
    defaultVoice: 'Rachel (21m00Tcm4TlvDq8ikWAM)',
    cachedAudiosCount: audioCache.size
  };
}

/**
 * Synthesizes text into MP3 audio buffer using ElevenLabs API
 */
export async function generateSpeechAudio(text, requestedVoiceId, language = 'hi') {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    // Graceful indicator: key is not configured, signal client to use browser speech synthesis
    return null;
  }

  // Voice selection:
  // pNInz6obpgDQGcFmaJgB: Adam / Multilingual
  // 21m00Tcm4TlvDq8ikWAM: Rachel / Multilingual
  const voiceId = requestedVoiceId || (language === 'hi' ? 'pNInz6obpgDQGcFmaJgB' : '21m00Tcm4TlvDq8ikWAM');
  const cacheKey = `${voiceId}_${text.trim()}`;

  // Check cache
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey);
  }

  const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const payload = {
    text: text.trim(),
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.55,
      similarity_boost: 0.75,
      style: 0.25,
      use_speaker_boost: true
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`ElevenLabs API error (${response.status}):`, errorText);
    return null;
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Cache up to 100 clips
  if (audioCache.size > 100) {
    const firstKey = audioCache.keys().next().value;
    audioCache.delete(firstKey);
  }
  audioCache.set(cacheKey, buffer);

  return buffer;
}
