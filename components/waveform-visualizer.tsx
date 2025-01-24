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

    // Initialize WaveSurfer with smoother appearance
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
    });

    // Initialize Record plugin with smoother waveform
    recordPluginRef.current = wavesurferRef.current.registerPlugin(
      RecordPlugin.create({
        renderRecordedAudio: false,
        scrollingWaveform: false,
        continuousWaveform: true,
        continuousWaveformDuration: 30,
        sampleRate: 8000,
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
    <div className="w-full h-8">
      <div ref={waveformRef} className="w-full" />
    </div>
  );
}
