import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch voices from ElevenLabs');
    }

    const data = await response.json();
    
    // Transform the response to match our Voice interface
    const voices = data.voices.map((voice: any) => ({
      id: voice.voice_id,
      name: voice.name,
      preview_url: voice.preview_url,
      category: voice.category || 'Default',
    }));

    return NextResponse.json({ voices });
  } catch (error) {
    console.error('Error fetching voices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voices' },
      { status: 500 }
    );
  }
} 