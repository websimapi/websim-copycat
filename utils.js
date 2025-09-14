/**
 * Sanitizes text to be sent to the AI.
 * This is primarily to prevent prompt injection by escaping characters
 * that might be used to manipulate the prompt structure.
 * @param {string} text The input text.
 * @returns {string} The sanitized text.
 */
export const sanitizeForAI = (text) => {
    if (typeof text !== 'string') return '';
    // Escape backslashes first, then double quotes.
    // This helps prevent breaking out of the string context in the AI prompt.
    return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
};

export const playAudioQueue = (audioUrls, onEnd) => {
    if (!audioUrls || audioUrls.length === 0) {
        if(onEnd) onEnd();
        return;
    }
    let currentIndex = 0;
    const playNext = () => {
        if (currentIndex < audioUrls.length) {
            const audio = new Audio(audioUrls[currentIndex]);
            audio.play().catch(e => console.error("Audio play error:", e));
            audio.onended = () => {
                currentIndex++;
                playNext();
            };
            audio.onerror = () => { // Handle audio load errors
                console.error("Error loading audio:", audioUrls[currentIndex]);
                currentIndex++;
                playNext();
            }
        } else if (onEnd) {
            onEnd();
        }
    };
    playNext();
};