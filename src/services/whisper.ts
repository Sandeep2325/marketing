import { config } from '../config';

export class WhisperService {
  private static instance: WhisperService;
  private baseUrl = 'https://api.openai.com/v1';

  private constructor() {}

  public static getInstance(): WhisperService {
    if (!WhisperService.instance) {
      WhisperService.instance = new WhisperService();
    }
    return WhisperService.instance;
  }

  async transcribeAudio(audioBuffer: ArrayBuffer): Promise<string> {
    if (!config.whisper.apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const formData = new FormData();
    formData.append('file', new Blob([audioBuffer], { type: 'audio/wav' }));
    formData.append('model', 'whisper-1');

    const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${config.whisper.apiKey}`,
      }),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to transcribe audio');
    }

    const data = await response.json();
    return data.text;
  }
} 