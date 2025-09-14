
```
import { useState, useRef, useCallback } from 'react';

export const useAudioPlayer = () => {
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

            audio.play().catch(e => {
                console.error("Audio play error:", e);
                currentQueueIndexRef.current++;
                playNextInQueue(messageKey);
            });

            audio.onended = () => {
                currentQueueIndexRef.current++;
                playNextInQueue(messageKey);
            };

            audio.onerror = () => {
                console.error("Error loading audio:", audioUrl);
                currentQueueIndexRef.current++;
                playNextInQueue(messageKey);
            };
        } else {
            stopCurrentAudio();
        }
    }, [stopCurrentAudio]);

    const handlePlayPause = useCallback((messageKey, audioUrls) => {
        const { key: currentKey, isPlaying } = nowPlayingInfo;

        if (currentKey === messageKey && isPlaying) { // PAUSE
            if (currentAudioRef.current) {
                currentAudioRef.current.pause();
                setNowPlayingInfo(prev => ({ ...prev, isPlaying: false }));
            }
        } else if (currentKey === messageKey && !isPlaying) { // RESUME
            if (currentAudioRef.current) {
                currentAudioRef.current.play().catch(e => console.error("Audio resume error:", e));
                setNowPlayingInfo(prev => ({ ...prev, isPlaying: true }));
            } else { // Edge case: try to resume after queue finished
                stopCurrentAudio();
            }
        } else { // PLAY NEW
            stopCurrentAudio();
            if (audioUrls && audioUrls.length > 0) {
                currentQueueRef.current = audioUrls;
                currentQueueIndexRef.current = 0;
                setNowPlayingInfo({ key: messageKey, isPlaying: true });
                playNextInQueue(messageKey);
            }
        }
    }, [nowPlayingInfo, stopCurrentAudio, playNextInQueue]);

    return {
        nowPlayingInfo,
        handlePlayPause,
        stopCurrentAudio
    };
};