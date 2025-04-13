import { config } from '../config';

export class ElevenLabsService {
  private static instance: ElevenLabsService;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  private constructor() {}

  public static getInstance(): ElevenLabsService {
    if (!ElevenLabsService.instance) {
      ElevenLabsService.instance = new ElevenLabsService();
    }
    return ElevenLabsService.instance;
  }

  async generateSpeech(text: string): Promise<ArrayBuffer> {
    if (!config.elevenLabs.apiKey) {
      throw new Error('ElevenLabs API key is not configured');
    }

    const response = await fetch(
      `${this.baseUrl}/text-to-speech/${config.elevenLabs.voiceId}`,
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'xi-api-key': config.elevenLabs.apiKey,
        }),
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate speech');
    }

    return response.arrayBuffer();
  }

  async startConversation(): Promise<string> {
    // TODO: Implement conversation start with ElevenLabs AI Agent API
    return 'Conversation started';
  }

  async sendMessage(message: string): Promise<string> {
    // TODO: Implement message sending to ElevenLabs AI Agent API
    return 'Message sent';
  }
} 