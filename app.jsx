import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { WebsimSocket, useQuery } from "@websim/use-query";
const room = new WebsimSocket();
const VOICES = [
  { id: "en-male", name: "English (Male)", flag: "\u{1F1EC}\u{1F1E7}" },
  { id: "en-female", name: "English (Female)", flag: "\u{1F1EC}\u{1F1E7}" },
  { id: "es-male", name: "Spanish (Male)", flag: "\u{1F1EA}\u{1F1F8}" },
  { id: "fr-female", name: "French (Female)", flag: "\u{1F1EB}\u{1F1F7}" },
  { id: "de-male", name: "German (Male)", flag: "\u{1F1E9}\u{1F1EA}" },
  { id: "ja-female", name: "Japanese (Female)", flag: "\u{1F1EF}\u{1F1F5}" },
  { id: "it-male", name: "Italian (Male)", flag: "\u{1F1EE}\u{1F1F9}" },
  { id: "pt-female", name: "Portuguese (Female)", flag: "\u{1F1F5}\u{1F1F9}" }
];
const PERSONAL_CHAT_GREETING = {
  id: "greeting-personal",
  author: "ai",
  text: "Hello! Teach me to speak. Type something, select a voice, and send it. I will learn from your words and the words of others.",
  audioUrls: []
};
const REALTIME_CHAT_GREETING = {
  id: "greeting-realtime",
  author: "ai",
  text: "Welcome to the realtime chat! All messages here are shared with everyone in the room. Let's teach the AI together.",
  audioUrls: []
};
const playAudioQueue = (audioUrls, onEnd) => {
  if (!audioUrls || audioUrls.length === 0) {
    if (onEnd) onEnd();
    return;
  }
  let currentIndex = 0;
  const playNext = () => {
    if (currentIndex < audioUrls.length) {
      const audio = new Audio(audioUrls[currentIndex]);
      audio.play().catch((e) => console.error("Audio play error:", e));
      audio.onended = () => {
        currentIndex++;
        playNext();
      };
      audio.onerror = () => {
        console.error("Error loading audio:", audioUrls[currentIndex]);
        currentIndex++;
        playNext();
      };
    } else if (onEnd) {
      onEnd();
    }
  };
  playNext();
};
function VoiceSelectorButton({ selectedVoice, onClick }) {
  const voiceDetails = VOICES.find((v) => v.id === selectedVoice);
  return /* @__PURE__ */ jsxDEV(
    "button",
    {
      type: "button",
      onClick,
      className: "bg-gray-700 border border-gray-600 rounded-md p-2 focus-ring flex items-center gap-2 flex-shrink-0",
      children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-lg", children: voiceDetails?.flag || "\u{1F50A}" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 66,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-chevron-down text-xs text-gray-400" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 67,
          columnNumber: 13
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "<stdin>",
      lineNumber: 61,
      columnNumber: 9
    },
    this
  );
}
function VoiceSelectorDropdown({ isOpen, onClose, selectedVoice, onSelectVoice }) {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: "absolute bottom-full left-0 mb-2 w-64 bg-gray-800 rounded-lg shadow-lg z-20 border border-gray-700 transition-all duration-300 ease-in-out transform opacity-0 translate-y-2 data-[open=true]:opacity-100 data-[open=true]:translate-y-0",
      "data-open": isOpen,
      children: /* @__PURE__ */ jsxDEV("div", { className: "p-2 max-h-[40vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-semibold text-center mb-2 text-gray-400 px-2 pt-1", children: "Select a Voice" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 81,
          columnNumber: 18
        }, this),
        VOICES.map((voice) => /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => {
              onSelectVoice(voice.id);
              onClose();
            },
            className: `w-full text-left p-2 rounded-md flex items-center gap-3 transition-colors text-sm ${selectedVoice === voice.id ? "bg-indigo-600 text-white" : "hover:bg-gray-700"}`,
            children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-xl", children: voice.flag }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 88,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("span", { children: voice.name }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 89,
                columnNumber: 25
              }, this)
            ]
          },
          voice.id,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 83,
            columnNumber: 21
          },
          this
        ))
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 80,
        columnNumber: 13
      }, this)
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 76,
      columnNumber: 9
    },
    this
  );
}
function RealtimeUsersHeader({ peers }) {
  const peerList = Object.values(peers);
  if (peerList.length === 0) return null;
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-800 px-4 pb-2", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 overflow-x-auto py-1", children: [
    /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400 font-medium mr-2 flex-shrink-0", children: "In room:" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 104,
      columnNumber: 17
    }, this),
    peerList.map((peer) => /* @__PURE__ */ jsxDEV("div", { className: "flex-shrink-0", title: peer.username, children: /* @__PURE__ */ jsxDEV(
      "img",
      {
        src: peer.avatarUrl,
        alt: peer.username,
        className: "w-8 h-8 rounded-full border-2 border-gray-600"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 107,
        columnNumber: 25
      },
      this
    ) }, peer.id, false, {
      fileName: "<stdin>",
      lineNumber: 106,
      columnNumber: 21
    }, this))
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 103,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 102,
    columnNumber: 9
  }, this);
}
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([PERSONAL_CHAT_GREETING]);
  const [userInput, setUserInput] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isUserSubmitting, setIsUserSubmitting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVoiceSelectorOpen, setIsVoiceSelectorOpen] = useState(false);
  const [aiDataSourceCount, setAiDataSourceCount] = useState(25);
  const [lastFailedAttempt, setLastFailedAttempt] = useState(null);
  const [chatMode, setChatMode] = useState("personal");
  const [peers, setPeers] = useState({});
  const chatEndRef = useRef(null);
  const voiceSelectorRef = useRef(null);
  const prevChatMode = useRef(chatMode);
  const { data: userHistoryData, loading: historyLoading } = useQuery(
    currentUser ? room.collection("chat_histories").filter({ id: currentUser.id }) : null
  );
  const userHistory = userHistoryData?.[0]?.messages || [];
  const { data: realtimeMessagesData } = useQuery(
    chatMode === "realtime" ? room.query('SELECT id, author, username, text, audio_urls as "audioUrls", created_at FROM public.realtime_chat_messages ORDER BY created_at ASC') : null
  );
  useEffect(() => {
    const initialize = async () => {
      const user = await window.websim.getCurrentUser();
      setCurrentUser(user);
      await room.initialize();
      setPeers(room.peers);
      const unsubscribe = room.subscribePresence(() => {
        setPeers({ ...room.peers });
      });
      room.onmessage = (event) => {
        const data = event.data;
        if (data.type === "play_audio_realtime" && Array.isArray(data.urls)) {
          playAudioQueue(data.urls);
        }
      };
      return () => {
        unsubscribe();
      };
    };
    initialize();
  }, []);
  useEffect(() => {
    if (chatMode === "realtime") {
      const formattedMessages = realtimeMessagesData ? realtimeMessagesData.map((msg) => ({ ...msg, isUser: msg.author === "user" && msg.username === currentUser?.username })) : [];
      setMessages([REALTIME_CHAT_GREETING, ...formattedMessages]);
    } else {
      const userMessages = (userHistoryData?.[0]?.messages || []).map((msg) => ({ author: "user", text: msg.text, isUser: true }));
      setMessages([PERSONAL_CHAT_GREETING, ...userMessages]);
    }
  }, [chatMode, realtimeMessagesData, userHistoryData, currentUser]);
  useEffect(() => {
    const isChatModeSwitch = prevChatMode.current !== chatMode;
    if (isChatModeSwitch) {
      chatEndRef.current?.scrollIntoView({ behavior: "auto" });
      prevChatMode.current = chatMode;
    } else {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatMode]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (voiceSelectorRef.current && !voiceSelectorRef.current.contains(event.target)) {
        setIsVoiceSelectorOpen(false);
      }
    };
    if (isVoiceSelectorOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVoiceSelectorOpen]);
  const handleRetry = async () => {
    if (!lastFailedAttempt || isAiThinking) return;
    const { userMessageText, uniqueSnippets } = lastFailedAttempt;
    setIsAiThinking(true);
    if (chatMode === "personal") {
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMsgIndex = newMessages.length - 1;
        if (newMessages[lastMsgIndex].canRetry) {
          newMessages[lastMsgIndex] = { author: "ai", text: "...", isTyping: true };
        }
        return newMessages;
      });
    }
    try {
      const systemPrompt = `You are an AI that can only communicate by selecting and combining pre-existing text snippets from a provided list. Your first attempt to find a coherent response failed. For this second attempt, try to be more creative. The response doesn't have to be a perfect fit, but it should be thematically or conceptually related to the user's message. Select snippets that are loosely connected if necessary. Use as many snippets as you need to form a response. Respond ONLY with a JSON object containing a 'selected_ids' key, which is an array of the integer IDs of the snippets you've chosen in the correct order. If you still cannot find anything, return an empty array.`;
      const completion = await websim.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `User message: "${userMessageText}"

Available snippets:
${uniqueSnippets.map((s, i) => `${i}: "${s.text}"`).join("\n")}` }
        ],
        json: true
      });
      const result = JSON.parse(completion.content);
      const selectedIds = result.selected_ids || [];
      const newAiMessage = {
        author: "ai",
        text: "I couldn't find the right words to respond.",
        audioUrls: [],
        canRetry: true
      };
      if (selectedIds.length > 0) {
        const selectedSnippets = selectedIds.map((id) => uniqueSnippets[id]).filter(Boolean);
        newAiMessage.text = selectedSnippets.map((s) => s.text).join(" ");
        newAiMessage.audioUrls = selectedSnippets.map((s) => s.audioUrl);
        newAiMessage.canRetry = false;
        playAudioQueue(newAiMessage.audioUrls);
        if (chatMode === "realtime") {
          room.send({ type: "play_audio_realtime", urls: newAiMessage.audioUrls, echo: false });
        }
      }
      if (chatMode === "personal") {
        setMessages((prev) => prev.slice(0, -1).concat(newAiMessage));
      } else {
        await room.collection("realtime_chat_messages").create({
          author: "ai",
          text: newAiMessage.text,
          audio_urls: newAiMessage.audioUrls
        });
      }
    } catch (error) {
      console.error("AI Retry Error:", error);
      const retryErrMessage = { author: "system", text: "The AI encountered an error while retrying." };
      if (chatMode === "personal") {
        setMessages((prev) => prev.slice(0, -1).concat(retryErrMessage));
      } else {
        await room.collection("realtime_chat_messages").create({
          author: "system",
          text: retryErrMessage.text,
          audio_urls: []
        });
      }
    } finally {
      setIsAiThinking(false);
      setLastFailedAttempt(null);
    }
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isUserSubmitting || isAiThinking || !currentUser) return;
    const userMessageText = userInput.trim();
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.canRetry && /try again|another try|one more time/i.test(userMessageText)) {
      setUserInput("");
      handleRetry();
      return;
    }
    setIsUserSubmitting(true);
    setUserInput("");
    try {
      const ttsResult = await websim.textToSpeech({ text: userMessageText, voice: selectedVoice });
      const newSnippet = {
        text: userMessageText,
        audioUrl: ttsResult.url,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        voice: selectedVoice
      };
      const audio = new Audio(newSnippet.audioUrl);
      audio.play().catch((e2) => {
        console.error("User audio playback error:", e2);
        handlePostAudio(newSnippet);
      });
      audio.onended = () => {
        handlePostAudio(newSnippet);
      };
      audio.onerror = () => {
        console.error("User audio failed to play");
        handlePostAudio(newSnippet);
      };
    } catch (error) {
      console.error("Error sending message:", error);
      setIsUserSubmitting(false);
      setUserInput(userMessageText);
      setMessages((prev) => [...prev, { author: "system", text: "Error generating audio. Please try again." }]);
    }
  };
  const handlePostAudio = async (newSnippet) => {
    if (chatMode === "personal") {
      const updatedMessages = [...userHistory, newSnippet];
      await room.collection("chat_histories").upsert({
        id: currentUser.id,
        messages: updatedMessages
      });
    } else {
      await room.collection("realtime_chat_messages").create({
        author: "user",
        username: currentUser.username,
        text: newSnippet.text,
        audio_urls: [newSnippet.audioUrl]
      });
      room.send({ type: "play_audio_realtime", urls: [newSnippet.audioUrl], echo: false });
    }
    setIsUserSubmitting(false);
    triggerAiResponse(newSnippet.text);
  };
  const triggerAiResponse = async (userMessageText) => {
    setIsAiThinking(true);
    if (chatMode === "personal") {
      setMessages((prev) => [...prev, { author: "ai", text: "...", isTyping: true }]);
    }
    setLastFailedAttempt(null);
    try {
      const otherUsersData = await room.query("SELECT messages FROM public.chat_histories WHERE id != $1 ORDER BY random() LIMIT $2", [currentUser.id, aiDataSourceCount]);
      const otherSnippets = otherUsersData.flatMap((row) => row.messages || []);
      const realtimeChatData = await room.query("SELECT text, audio_urls FROM public.realtime_chat_messages WHERE author = 'user' ORDER BY created_at DESC LIMIT 100");
      const realtimeSnippets = realtimeChatData.flatMap(
        (msg) => (msg.audio_urls || []).map((audioUrl) => ({ text: msg.text, audioUrl }))
      ).filter((snippet) => snippet.audioUrl);
      const userSnippets = userHistoryData?.[0]?.messages || [];
      const allSnippets = [...userSnippets, ...otherSnippets, ...realtimeSnippets];
      const aiThinkingFailed = (text, canRetry = false) => {
        const msg = { author: "ai", text, audioUrls: [], canRetry };
        if (chatMode === "personal") {
          setMessages((prev) => prev.slice(0, -1).concat(msg));
          if (canRetry) setLastFailedAttempt({ userMessageText, uniqueSnippets: allSnippets });
        } else {
          room.collection("realtime_chat_messages").create({
            author: "ai",
            text: msg.text,
            audio_urls: msg.audioUrls
          });
        }
      };
      if (allSnippets.length === 0) {
        aiThinkingFailed("I have no words to use yet. Please teach me more.");
        setIsAiThinking(false);
        return;
      }
      const uniqueSnippets = [...new Map(allSnippets.map((item) => [item.audioUrl, item])).values()];
      const shuffledSnippets = uniqueSnippets.sort(() => 0.5 - Math.random());
      const availableSnippets = shuffledSnippets.slice(0, 400);
      const getAiSelection = async (systemPrompt) => {
        const completion = await websim.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `User message: "${userMessageText}"

Available snippets:
${availableSnippets.map((s, i) => `${i}: "${s.text}"`).join("\n")}`
            }
          ],
          json: true
        });
        return JSON.parse(completion.content);
      };
      const initialPrompt = `You are an AI that can only communicate by selecting and combining pre-existing text snippets from a provided list. Your goal is to form a coherent and relevant response to the user's message.
- Combine multiple snippets if it improves the response. A good response can use any number of snippets to form a complete thought.
- Only use a single snippet if it's a perfect and complete response on its own.
- Feel free to use more snippets if you think it will make your response more detailed, nuanced, or accurate. There is no hard limit on the number of snippets you can use.
- Respond ONLY with a JSON object containing a 'selected_ids' key (an array of snippet IDs). If you can't find anything, return an empty array.`;
      let result = await getAiSelection(initialPrompt);
      let selectedIds = result.selected_ids || [];
      let selectedSnippets = selectedIds.map((id) => availableSnippets[id]).filter(Boolean);
      let aiResponseText = selectedSnippets.map((s) => s.text).join(" ");
      if (selectedIds.length > 0 && aiResponseText.trim().toLowerCase() === userMessageText.trim().toLowerCase()) {
        const retryPrompt = `Your first attempt was just repeating the user's message. This is not a good response.
Try again. Be more creative this time. You MUST combine different snippets to form a new phrase that responds well to the user's original message. Use as many snippets as you need to create a good response.
Do NOT simply repeat what the user said. Find a better, more thoughtful combination.
Respond ONLY with a JSON object containing a 'selected_ids' key (an array of snippet IDs). If you still can't find anything, return an empty array.`;
        result = await getAiSelection(retryPrompt);
        selectedIds = result.selected_ids || [];
        selectedSnippets = selectedIds.map((id) => availableSnippets[id]).filter(Boolean);
        aiResponseText = selectedSnippets.map((s) => s.text).join(" ");
      }
      if (selectedIds.length > 0) {
        const aiAudioUrls = selectedSnippets.map((s) => s.audioUrl);
        const aiMessage = {
          author: "ai",
          text: aiResponseText,
          audioUrls: aiAudioUrls
        };
        playAudioQueue(aiAudioUrls);
        if (chatMode === "realtime") {
          room.send({ type: "play_audio_realtime", urls: aiAudioUrls, echo: false });
        }
        if (chatMode === "personal") {
          setMessages((prev) => prev.slice(0, -1).concat(aiMessage));
        } else {
          await room.collection("realtime_chat_messages").create({
            author: "ai",
            text: aiMessage.text,
            audio_urls: aiMessage.audioUrls
          });
        }
      } else {
        aiThinkingFailed("I couldn't find the right words to respond.", true);
      }
    } catch (error) {
      console.error("AI Response Error:", error);
      const errorMessage = error.message.includes("JSON") ? "The AI returned an invalid response. Please try again." : "The AI encountered an error while thinking.";
      const systemMessage = { author: "system", text: errorMessage };
      if (chatMode === "personal") {
        setMessages((prev) => prev.slice(0, -1).concat(systemMessage));
      } else {
        await room.collection("realtime_chat_messages").create({
          author: "system",
          text: systemMessage.text,
          audio_urls: []
        });
      }
    } finally {
      setIsAiThinking(false);
    }
  };
  const isSubmitDisabled = isAiThinking || isUserSubmitting;
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("header", { className: "bg-gray-800 p-4 shadow-md z-10 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxDEV("h1", { className: "text-xl font-bold text-indigo-400", children: "Copycat?" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 508,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: () => setIsSettingsOpen(true), className: "p-2 rounded-md hover:bg-gray-700 focus-ring", children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-cog" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 510,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 509,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 507,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-800", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "px-4 pt-2", children: /* @__PURE__ */ jsxDEV("div", { className: "flex border-b border-gray-700", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setChatMode("personal"),
            className: `py-2 px-4 text-sm font-medium chat-mode-tab ${chatMode === "personal" ? "border-b-2 border-indigo-400 text-indigo-400" : "text-gray-400 hover:text-white"}`,
            children: "Solo"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 517,
            columnNumber: 25
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setChatMode("realtime"),
            className: `py-2 px-4 text-sm font-medium chat-mode-tab ${chatMode === "realtime" ? "border-b-2 border-indigo-400 text-indigo-400" : "text-gray-400 hover:text-white"}`,
            children: "Realtime"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 523,
            columnNumber: 25
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 516,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 515,
        columnNumber: 17
      }, this),
      chatMode === "realtime" && /* @__PURE__ */ jsxDEV(RealtimeUsersHeader, { peers }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 531,
        columnNumber: 45
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 514,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("main", { className: "flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900", children: [
      messages.map((msg, index) => /* @__PURE__ */ jsxDEV("div", { className: `flex items-end gap-2 chat-bubble ${msg.isUser ? "justify-end" : "justify-start"}`, children: [
        msg.author === "ai" && /* @__PURE__ */ jsxDEV("div", { className: "w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-robot" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 537,
          columnNumber: 148
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 537,
          columnNumber: 49
        }, this),
        chatMode === "realtime" && msg.author === "user" && !msg.isUser && /* @__PURE__ */ jsxDEV("div", { className: "w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0", title: msg.username, children: /* @__PURE__ */ jsxDEV("img", { src: `https://images.websim.com/avatar/${msg.username}`, alt: msg.username, className: "w-full h-full rounded-full" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 540,
          columnNumber: 33
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 539,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: `max-w-[80%] md:max-w-md p-3 rounded-lg ${msg.isUser ? "bg-blue-600 rounded-br-none" : "bg-gray-700 rounded-bl-none"} ${msg.author === "system" ? "bg-red-600" : ""}`, children: [
          chatMode === "realtime" && msg.author === "user" && !msg.isUser && /* @__PURE__ */ jsxDEV("div", { className: "text-xs font-bold text-indigo-300 mb-1", children: msg.username }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 544,
            columnNumber: 97
          }, this),
          msg.isTyping ? /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center space-x-1", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 547,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 548,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 549,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 546,
            columnNumber: 33
          }, this) : msg.text,
          msg.author === "ai" && msg.audioUrls && msg.audioUrls.length > 0 && /* @__PURE__ */ jsxDEV("button", { onClick: () => playAudioQueue(msg.audioUrls), className: "mt-2 text-indigo-300 hover:text-indigo-200 text-sm", children: [
            /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-play-circle mr-1" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 554,
              columnNumber: 37
            }, this),
            " Replay"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 553,
            columnNumber: 33
          }, this),
          msg.canRetry && /* @__PURE__ */ jsxDEV("button", { onClick: handleRetry, className: "mt-2 text-indigo-300 hover:text-indigo-200 text-sm", disabled: isAiThinking, children: [
            /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-arrows-rotate mr-1" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 559,
              columnNumber: 37
            }, this),
            " Try Again"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 558,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 543,
          columnNumber: 25
        }, this),
        chatMode === "realtime" && msg.author === "user" && msg.isUser && /* @__PURE__ */ jsxDEV("div", { className: "w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0", title: currentUser?.username, children: /* @__PURE__ */ jsxDEV("img", { src: `https://images.websim.com/avatar/${currentUser?.username}`, alt: currentUser?.username, className: "w-full h-full rounded-full" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 565,
          columnNumber: 33
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 564,
          columnNumber: 30
        }, this)
      ] }, msg.id || index, true, {
        fileName: "<stdin>",
        lineNumber: 536,
        columnNumber: 21
      }, this)),
      /* @__PURE__ */ jsxDEV("div", { ref: chatEndRef }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 570,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 534,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("footer", { className: "p-4 bg-gray-800 shadow-inner", children: /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSendMessage, className: "flex gap-2 items-center", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "relative", ref: voiceSelectorRef, children: [
        /* @__PURE__ */ jsxDEV(VoiceSelectorButton, { selectedVoice, onClick: () => setIsVoiceSelectorOpen((prev) => !prev) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 576,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV(
          VoiceSelectorDropdown,
          {
            isOpen: isVoiceSelectorOpen,
            onClose: () => setIsVoiceSelectorOpen(false),
            selectedVoice,
            onSelectVoice: setSelectedVoice
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 577,
            columnNumber: 25
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 575,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV(
        "input",
        {
          type: "text",
          value: userInput,
          onChange: (e) => setUserInput(e.target.value),
          placeholder: isAiThinking ? "AI is thinking..." : "Teach the AI...",
          className: "flex-1 bg-gray-700 border border-gray-600 rounded-md p-2 focus-ring placeholder-gray-400",
          disabled: isSubmitDisabled
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 584,
          columnNumber: 21
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("button", { type: "submit", className: "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed text-white font-bold p-2 rounded-md focus-ring w-12 h-10 flex items-center justify-center", disabled: isSubmitDisabled, children: isUserSubmitting ? /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 593,
        columnNumber: 45
      }, this) : /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-paper-plane" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 593,
        columnNumber: 148
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 592,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 574,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 573,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: `fixed inset-0 bg-black bg-opacity-50 z-40 ${isSettingsOpen ? "block" : "hidden"}`, onClick: () => setIsSettingsOpen(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 599,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: `fixed bottom-0 left-0 right-0 bg-gray-800 p-6 rounded-t-2xl shadow-2xl z-50 settings-panel ${isSettingsOpen ? "open" : "closed"}`, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-lg font-semibold", children: "AI Settings" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 602,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("button", { onClick: () => setIsSettingsOpen(false), className: "p-2 rounded-md hover:bg-gray-700 focus-ring", children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-times" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 604,
          columnNumber: 25
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 603,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 601,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { htmlFor: "aiDataSource", className: "block mb-2 text-sm font-medium text-gray-300", children: [
          "Other users to learn from: ",
          /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-indigo-400", children: aiDataSourceCount === 0 ? "Just Me" : aiDataSourceCount }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 609,
            columnNumber: 52
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 608,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400 mb-3", children: "Controls how many random users' chat snippets the AI can use." }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 611,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            id: "aiDataSource",
            type: "range",
            min: "0",
            max: "50",
            value: aiDataSourceCount,
            onChange: (e) => setAiDataSourceCount(Number(e.target.value)),
            className: "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 612,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 607,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 600,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 506,
    columnNumber: 9
  }, this);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 628,
  columnNumber: 13
}));
