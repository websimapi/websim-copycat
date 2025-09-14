import { useCallback, useRef, useState } from 'react';

export default function useAudioPlayer() {
  const [nowPlayingInfo, setNowPlayingInfo] = useState({ key: null, isPlaying: false });
  const currentAudioRef = useRef(null);
  const currentQueueRef = useRef([]);
  const currentQueueIndexRef = useRef(0);

  const stopCurrentAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.onended = null;
      currentAudioRef.current.onerror = null;
      currentAudioRef.current = null;
    }
    currentQueueRef.current = [];
    currentQueueIndexRef.current = 0;
    setNowPlayingInfo({ key: null, isPlaying: false });
  }, []);

  const playNextInQueue = useCallback((messageKey) => {
    if (currentQueueIndexRef.current < currentQueueRef.current.length) {
      const audioUrl = currentQueueRef.current[currentQueueIndexRef.current];
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      audio.play().catch(() => {
        currentQueueIndexRef.current++;
        playNextInQueue(messageKey);
      });
      audio.onended = () => {
        currentQueueIndexRef.current++;
        playNextInQueue(messageKey);
      };
      audio.onerror = () => {
        currentQueueIndexRef.current++;
        playNextInQueue(messageKey);
      };
    } else {
      stopCurrentAudio();
    }
  }, [stopCurrentAudio]);

  const handlePlayPause = useCallback((messageKey, audioUrls) => {
    const { key: currentKey, isPlaying } = nowPlayingInfo;
    if (currentKey === messageKey && isPlaying) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        setNowPlayingInfo(prev => ({ ...prev, isPlaying: false }));
      }
    } else if (currentKey === messageKey && !isPlaying) {
      if (currentAudioRef.current) {
        currentAudioRef.current.play().catch(() => {});
        setNowPlayingInfo(prev => ({ ...prev, isPlaying: true }));
      } else {
        stopCurrentAudio();
      }
    } else {
      stopCurrentAudio();
      if (audioUrls && audioUrls.length > 0) {
        currentQueueRef.current = audioUrls;
        currentQueueIndexRef.current = 0;
        setNowPlayingInfo({ key: messageKey, isPlaying: true });
        playNextInQueue(messageKey);
      }
    }
  }, [nowPlayingInfo, stopCurrentAudio, playNextInQueue]);

  return { nowPlayingInfo, handlePlayPause, stopCurrentAudio };
}