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

    // Initialize WaveSurfer with modified settings for long recordings
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "rgb(var(--primary))",
      progressColor: "rgb(var(--primary))",
      cursorWidth: 0,
      height: 32,
      normalize: true,
      interact: false,
      barWidth: 2,
      barGap: 1,
      barRadius: 3,
      minPxPerSec: 10, // Compress the waveform for longer recordings
      fillParent: true, // Make sure it fills the container
    });

    // Initialize Record plugin with modified settings
    recordPluginRef.current = wavesurferRef.current.registerPlugin(
      RecordPlugin.create({
        renderRecordedAudio: false,
        scrollingWaveform: true, // Enable scrolling for long recordings
        continuousWaveform: true,
        continuousWaveformDuration: 5, // Reduce the duration window to prevent overflow
        sampleRate: 8000,
        maxDuration: 300, // Set maximum recording duration to 5 minutes
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
    <div className="w-full h-8 overflow-hidden">
      <div ref={waveformRef} className="w-full" />
    </div>
  );
}
