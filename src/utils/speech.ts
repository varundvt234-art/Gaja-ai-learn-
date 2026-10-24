import { LanguageCode } from '../types';

export class SpeechService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  public static isSupported(): boolean {
    return Boolean(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }

  public static speak(
    text: string, 
    lang: LanguageCode = 'en', 
    onEnd?: () => void,
    onError?: (err: any) => void
  ): boolean {
    if (!this.synth) return false;

    // Stop existing speech
    this.stop();

    // Clean markdown symbols to make speech sound natural and clean
    const cleanText = text
      .replace(/#{1,6}\s+/g, '')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/`{1,3}.*?`{1,3}/gs, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[-*•]\s+/g, '')
      .replace(/<[^>]*>/g, '')
      .trim();

    if (!cleanText) return false;

    // Limit length to avoid browser TTS timeout on giant strings
    const truncatedText = cleanText.slice(0, 1500);

    const utterance = new SpeechSynthesisUtterance(truncatedText);
    const langCodes: Record<LanguageCode, string> = {
      en: 'en-US',
      te: 'te-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      es: 'es-ES',
    };

    utterance.lang = langCodes[lang] || 'en-US';
    utterance.rate = 0.95; // gentle, teacher-like pace
    utterance.pitch = 1.0;

    // Pick best matching voice if available
    const voices = this.synth.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(utterance.lang.split('-')[0]));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      if (onError) onError(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    return true;
  }

  public static stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public static isSpeaking(): boolean {
    return Boolean(this.synth && this.synth.speaking);
  }
}

// Voice Recognition helper (Web Speech API)
export class VoiceRecognitionService {
  public static isSupported(): boolean {
    return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  public static startListening(
    lang: LanguageCode,
    onResult: (transcript: string) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): any {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError('Speech recognition not supported in this browser.');
      return null;
    }

    const recognition = new SpeechRecognition();
    const langCodes: Record<LanguageCode, string> = {
      en: 'en-US',
      te: 'te-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      es: 'es-ES',
    };

    recognition.lang = langCodes[lang] || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const text = event.results[0]?.[0]?.transcript;
      if (text) onResult(text);
    };

    recognition.onerror = (event: any) => {
      onError(event.error || 'Voice input error');
    };

    recognition.onend = () => {
      onEnd();
    };

    try {
      recognition.start();
      return recognition;
    } catch (err: any) {
      onError(err.message || 'Could not start voice recognition');
      return null;
    }
  }
}
