import { useRef, useState, useEffect } from "react";
import Recorder from "recorder-js";
import { toast } from "sonner";

export function useRecorder(maxDuration: number = 4) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const recorderRef = useRef<any>(null);
  const [stream, setStream] = useState<MediaStream | undefined>();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initializeRecorder = async () => {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setStream(audioStream);
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const recorder = new Recorder(audioContext);
        await recorder.init(audioStream);
        recorderRef.current = recorder;
      } catch (error) {
        console.error("Error initializing recorder:", error);
        toast.error("Failed to access microphone");
      }
    };

    initializeRecorder();

    return () => {
      if (recorderRef.current) {
        recorderRef.current.stream
          .getTracks()
          .forEach((track: MediaStreamTrack) => track.stop());
        setStream(undefined);
      }
    };
  }, []);

  const startRecordingTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (recorderRef.current) {
        stopRecording();
        toast.info(
          "Maximum recording duration reached."
        );
      }
    }, maxDuration * 60 * 1000);
  };

  const clearRecordingTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = async () => {
    if (!recorderRef.current) {
      toast.error("Microphone not initialized");
      return;
    }

    try {
      await recorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      startRecordingTimer();
      return true;
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording");
      return false;
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return null;

    clearRecordingTimer();

    try {
      const { blob } = await recorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      return blob;
    } catch (error) {
      console.error("Error stopping recording:", error);
      toast.error("Failed to stop recording");
      return null;
    }
  };

  const pauseRecording = async () => {
    if (!recorderRef.current) return null;

    clearRecordingTimer();

    try {
      const { blob } = await recorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(true);
      return blob;
    } catch (error) {
      console.error("Error pausing recording:", error);
      toast.error("Failed to pause recording");
      return null;
    }
  };

  const resumeRecording = async () => {
    if (!recorderRef.current) return false;

    try {
      await recorderRef.current.start();
      setIsPaused(false);
      setIsRecording(true);
      startRecordingTimer();
      return true;
    } catch (error) {
      console.error("Error resuming recording:", error);
      toast.error("Failed to resume recording");
      return false;
    }
  };

  return {
    isRecording,
    isPaused,
    stream,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  };
} 