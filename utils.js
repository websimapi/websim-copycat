
```
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
    return text.replace(/\\\\/g, '\\\\\\\\').replace(/\"/g, '\\\\\"');
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

export const getAiSelectionFromSnippets = async ({ userMessage, availableSnippets, chatHistory = "", attempt = 1, isPassthrough = false, profanityFilter = true }) => {
    const MAX_LLM_RETRIES = 3;
    for (let i = 0; i < MAX_LLM_RETRIES; i++) {
        try {
            const profanityRule = profanityFilter 
                ? "You MUST NOT select any snippet that contains profanity, hate speech, sexual content, or anything else that would be considered above a PG-13 rating. Be very strict about this filtering." 
                : "";

            const systemPrompt = attempt > 1 || isPassthrough
                ? `You are an AI. A previous attempt to respond failed or was rerouted. Please try to form a response.
- You MUST respond with a JSON object.
- The JSON object must have a key called 'selected_ids'.
- 'selected_ids' must be an array of numbers.
- Example of a valid response: {"selected_ids": [12, 5, 23]}
- Your goal is to form a coherent and relevant response to the user's message by selecting snippets, considering the chat history.
- ${profanityRule}`
                : `You are an AI that can only communicate by selecting and combining pre-existing text snippets from a provided list. Your goal is to form a coherent and relevant response to the user's message.
- Consider the provided chat history for context.
- Combine multiple snippets if it improves the response.
- Respond ONLY with a JSON object containing a 'selected_ids' key (an array of snippet IDs). If you can't find anything, return an empty array.
- ${profanityRule}`;

            const userContent = (chatHistory ? `Recent Chat History:\n${chatHistory}\n\n` : '') +
                `User message: "${userMessage}"\n\nAvailable snippets:\n${availableSnippets.map((s, i) => `${i}: "${sanitizeForAI(s.text)}"`).join('\n')}`;

            const completion = await websim.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userContent }
                ],
                json: true,
            });

            const result = JSON.parse(completion.content);
            const selectedIds = result.selected_ids || [];
            return { success: true, selectedIds };

        } catch (error) {
            console.error(`getAiSelection attempt ${i + 1} failed:`, error);
            if (i === MAX_LLM_RETRIES - 1) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, 200 * (i + 1)));
        }
    }
    return { success: false, selectedIds: [] }; // Should not be reached
};