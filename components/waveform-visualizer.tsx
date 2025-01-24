import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
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

    // Initialize WaveSurfer with smoother appearance
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "rgba(255, 255, 255, 0.5)", // Semi-transparent white
      progressColor: "rgba(255, 255, 255, 0.8)", // More opaque white for progress
      cursorWidth: 0,
      height: 40,
      normalize: true,
      interact: false,
      barWidth: 2, // Thinner bars
      barGap: 1, // Smaller gap between bars
      barRadius: 3, // Rounded bars
      barMinHeight: 1, // Minimum height for smoother appearance
    });

    // Initialize Record plugin with smoother waveform
    recordPluginRef.current = wavesurferRef.current.registerPlugin(
      RecordPlugin.create({
        renderRecordedAudio: false,
        scrollingWaveform: false,
        continuousWaveform: true,
        continuousWaveformDuration: 30,
        sampleRate: 8000, // Lower sample rate for smoother appearance
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
    <div className="w-full h-10 bg-black/20 rounded-lg backdrop-blur-sm">
      <div ref={waveformRef} className="w-full" />
    </div>
  );
}
