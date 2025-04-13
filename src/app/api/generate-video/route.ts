import { NextResponse } from 'next/server';
import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia } from '@remotion/renderer';
import { Composition } from 'remotion';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { script, settings } = await request.json();
    
    // Create a temporary directory for the video project
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Create the Remotion composition
    const composition = {
      id: 'main',
      durationInFrames: settings.duration * 30, // 30fps
      fps: 30,
      width: settings.size === 'portrait' ? 1080 : 1920,
      height: settings.size === 'portrait' ? 1920 : 1080,
      defaultProps: {
        script,
        settings
      }
    } as const;

    // Create the video component with transitions
    const videoComponent = `
      import { AbsoluteFill, useCurrentFrame, spring } from 'remotion';
      import { interpolate } from 'remotion';
      import { TransitionSeries, springTiming, fade, slide, wipe } from '@remotion/transitions';
      
      export const Main: React.FC<{ script: string; settings: any }> = ({ script, settings }) => {
        const frame = useCurrentFrame();
        const scenes = script.split('\\n\\n').filter(Boolean);
        
        return (
          <AbsoluteFill style={{ backgroundColor: 'white' }}>
            <TransitionSeries>
              {scenes.map((scene, index) => (
                <TransitionSeries.Sequence key={index} durationInFrames={60}>
                  <div style={{
                    padding: 40,
                    fontFamily: 'Arial',
                    fontSize: 48,
                    textAlign: 'center',
                    opacity: spring({
                      frame,
                      fps: 30,
                      from: 0,
                      to: 1,
                      config: {
                        damping: 200,
                      },
                    }),
                    transform: \`scale(\${spring({
                      frame,
                      fps: 30,
                      from: 0.8,
                      to: 1,
                      config: {
                        damping: 200,
                      },
                    })})\`,
                  }}>
                    {scene}
                  </div>
                </TransitionSeries.Sequence>
              ))}
            </TransitionSeries>
          </AbsoluteFill>
        );
      };
    `;

    // Write the component file
    fs.writeFileSync(path.join(tempDir, 'Video.tsx'), videoComponent);

    // Bundle the project
    const bundled = await bundle({
      entryPoint: path.join(tempDir, 'Video.tsx'),
      webpackOverride: (config) => config,
    });

    // Get compositions
    const compositions = await getCompositions(bundled);
    const mainComposition = compositions.find((c) => c.id === 'main');

    if (!mainComposition) {
      throw new Error('Composition not found');
    }

    // Render the video
    const outputPath = path.join(tempDir, 'output.mp4');
    await renderMedia({
      composition: mainComposition,
      serveUrl: bundled,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {
        script,
        settings
      },
    });

    // Upload to storage and get URL
    // TODO: Implement your preferred storage solution (e.g., AWS S3, Cloudinary)
    const videoUrl = '/api/videos/output.mp4'; // Temporary URL

    // Clean up
    fs.unlinkSync(outputPath);
    fs.unlinkSync(path.join(tempDir, 'Video.tsx'));
    fs.rmdirSync(tempDir);

    return NextResponse.json({ videoUrl });
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
} 