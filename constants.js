export const VOICES = [
    { id: "en-male", name: "English (Male)", flag: "🇬🇧" },
    { id: "en-female", name: "English (Female)", flag: "🇬🇧" },
    { id: "es-male", name: "Spanish (Male)", flag: "🇪🇸" },
    { id: "fr-female", name: "French (Female)", flag: "🇫🇷" },
    { id: "de-male", name: "German (Male)", flag: "🇩🇪" },
    { id: "ja-female", name: "Japanese (Female)", flag: "🇯🇵" },
    { id: "it-male", name: "Italian (Male)", flag: "🇮🇹" },
    { id: "pt-female", name: "Portuguese (Female)", flag: "🇵🇹" },
];

export const PERSONAL_CHAT_GREETING = {
    id: 'greeting-personal',
    author: 'ai',
    text: 'Hello! Teach me to speak. Type something, select a voice, and send it. I will learn from your words and the words of others.',
    audioUrls: [],
};

export const REALTIME_CHAT_GREETING = {
    id: 'greeting-realtime',
    author: 'ai',
    text: 'Welcome to the realtime chat! All messages here are shared with everyone in the room. Let\'s teach the AI together.',
    audioUrls: [],
};