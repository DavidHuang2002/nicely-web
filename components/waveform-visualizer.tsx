import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
// @ts-ignore
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";

interface WaveformVisualizerProps {
  isRecording: boolean;
  stream?: MediaStream;
}

export function WaveformVisualizer({
  isRecording,
  stream,
}: WaveformVisualizerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const recordPluginRef = useRef<any>(null);

  useEffect(() => {
    if (!waveformRef.current) return;

    // Initialize WaveSurfer with optimized settings for recording
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "rgb(var(--primary))",
      progressColor: "rgb(var(--primary))",
      height: 'auto',
      // normalize: true,
      // Optimize for real-time visualization
      barWidth: 4,
      barGap: 2,
      barRadius: 2,
      minPxPerSec: 40, // Increase pixels per second for smoother visualization
      fillParent: true,
      barHeight: 2,
    });

    // Initialize Record plugin with optimized settings
    recordPluginRef.current = wavesurferRef.current.registerPlugin(
      RecordPlugin.create({
        renderRecordedAudio: false,
        // Use scrolling waveform for better real-time visualization
        scrollingWaveform: true,
        // Disable continuous waveform when scrolling is enabled
        continuousWaveform: false,
        // Optimize sample rate for better performance
        sampleRate: 16000,
        // Set a reasonable buffer size for smooth rendering
        bufferSize: 4096,
        // Limit recording length to prevent memory issues
        maxDuration: 300,
        // Enable audio worklet for better performance
        audioContext: {
          latencyHint: "interactive",
        },
      })
    );

    return () => {
      if (recordPluginRef.current?.isRecording()) {
        recordPluginRef.current.stopRecording();
      }
      wavesurferRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    const recordPlugin = recordPluginRef.current;
    if (!recordPlugin) return;

    if (isRecording && !recordPlugin.isRecording()) {
      recordPlugin.startRecording();
    } else if (!isRecording && recordPlugin.isRecording()) {
      recordPlugin.stopRecording();
    }
  }, [isRecording]);

  return (
    <div className="relative w-full h-8 overflow-hidden">
      <div ref={waveformRef} className="w-full absolute inset-0" />
    </div>
  );
}
