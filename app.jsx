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
const playAudioQueue = (audioUrls, onEnd) => {
  let currentIndex = 0;
  const playNext = () => {
    if (currentIndex < audioUrls.length) {
      const audio = new Audio(audioUrls[currentIndex]);
      audio.play().catch((e) => console.error("Audio play error:", e));
      audio.onended = () => {
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
          lineNumber: 43,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-chevron-down text-xs text-gray-400" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 44,
          columnNumber: 13
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "<stdin>",
      lineNumber: 38,
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
          lineNumber: 58,
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
                lineNumber: 65,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("span", { children: voice.name }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 66,
                columnNumber: 25
              }, this)
            ]
          },
          voice.id,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 60,
            columnNumber: 21
          },
          this
        ))
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 57,
        columnNumber: 13
      }, this)
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 53,
      columnNumber: 9
    },
    this
  );
}
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isUserSubmitting, setIsUserSubmitting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVoiceSelectorOpen, setIsVoiceSelectorOpen] = useState(false);
  const [aiDataSourceCount, setAiDataSourceCount] = useState(11);
  const [lastFailedAttempt, setLastFailedAttempt] = useState(null);
  const chatEndRef = useRef(null);
  const voiceSelectorRef = useRef(null);
  const { data: userHistoryData, loading: historyLoading } = useQuery(
    currentUser ? room.collection("chat_histories").filter({ id: currentUser.id }) : null
  );
  const userHistory = userHistoryData?.[0]?.messages || [];
  useEffect(() => {
    window.websim.getCurrentUser().then(setCurrentUser);
    setMessages([{
      author: "ai",
      text: "Hello! Teach me to speak. Type something, select a voice, and send it. I will learn from your words and the words of others.",
      audioUrls: []
    }]);
  }, []);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
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
    setMessages((prev) => {
      const newMessages = [...prev];
      const lastMsgIndex = newMessages.length - 1;
      if (newMessages[lastMsgIndex].canRetry) {
        newMessages[lastMsgIndex] = { author: "ai", text: "...", isTyping: true };
      }
      return newMessages;
    });
    try {
      const systemPrompt = `You are an AI that can only communicate by selecting and combining pre-existing text snippets from a provided list. Your first attempt to find a coherent response failed. For this second attempt, try to be more creative. The response doesn't have to be a perfect fit, but it should be thematically or conceptually related to the user's message. Select snippets that are loosely connected if necessary. Respond ONLY with a JSON object containing a 'selected_ids' key, which is an array of the integer IDs of the snippets you've chosen in the correct order. If you still cannot find anything, return an empty array.`;
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
      if (selectedIds.length > 0) {
        const selectedSnippets = selectedIds.map((id) => uniqueSnippets[id]).filter(Boolean);
        const aiResponseText = selectedSnippets.map((s) => s.text).join(" ");
        const aiAudioUrls = selectedSnippets.map((s) => s.audioUrl);
        setMessages((prev) => prev.slice(0, -1).concat({ author: "ai", text: aiResponseText, audioUrls: aiAudioUrls }));
        playAudioQueue(aiAudioUrls);
      } else {
        setMessages((prev) => prev.slice(0, -1).concat({ author: "ai", text: "I tried again, but still couldn't find the right words.", audioUrls: [], canRetry: true }));
        setLastFailedAttempt({ userMessageText, uniqueSnippets });
      }
    } catch (error) {
      console.error("AI Retry Error:", error);
      setMessages((prev) => prev.slice(0, -1).concat({ author: "system", text: "The AI encountered an error while retrying." }));
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
    } catch (error) {
      console.error("Error sending message:", error);
      setIsUserSubmitting(false);
      setUserInput(userMessageText);
      setMessages((prev) => [...prev, { author: "system", text: "Error generating audio. Please try again." }]);
    }
  };
  const handlePostAudio = async (newSnippet) => {
    setMessages((prev) => [...prev, { author: "user", text: newSnippet.text }]);
    const updatedMessages = [...userHistory, newSnippet];
    await room.collection("chat_histories").upsert({
      id: currentUser.id,
      messages: updatedMessages
    });
    setIsUserSubmitting(false);
    triggerAiResponse(newSnippet.text);
  };
  const triggerAiResponse = async (userMessageText) => {
    setIsAiThinking(true);
    setMessages((prev) => [...prev, { author: "ai", text: "...", isTyping: true }]);
    setLastFailedAttempt(null);
    try {
      const otherUsersData = await room.query("SELECT messages FROM public.chat_histories WHERE id != $1 ORDER BY random() LIMIT $2", [currentUser.id, aiDataSourceCount]);
      const otherSnippets = otherUsersData.flatMap((row) => row.messages || []);
      const userSnippets = userHistoryData?.[0]?.messages || [];
      const allSnippets = [...userSnippets, ...otherSnippets];
      if (allSnippets.length === 0) {
        setMessages((prev) => prev.slice(0, -1).concat({
          author: "ai",
          text: "I have no words to use yet. Please teach me more.",
          audioUrls: []
        }));
        setIsAiThinking(false);
        return;
      }
      const uniqueSnippets = Array.from(new Map(allSnippets.map((item) => [item.audioUrl, item]))).values();
      const systemPrompt = `You are an AI that can only communicate by selecting and combining pre-existing text snippets from a provided list.
Given a user's message and a list of available snippets (with IDs), you must select a sequence of snippet IDs that forms the most coherent and relevant response.
Respond ONLY with a JSON object containing a 'selected_ids' key, which is an array of the integer IDs of the snippets you've chosen in the correct order.
For example: {"selected_ids": [15, 8, 42]}
Do not add any explanations or other text. If no snippets are relevant, return an empty array: {"selected_ids": []}`;
      const completion = await websim.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `User message: "${userMessageText}"

Available snippets:
${uniqueSnippets.map((s, i) => `${i}: "${s.text}"`).join("\n")}`
          }
        ],
        json: true
      });
      const result = JSON.parse(completion.content);
      const selectedIds = result.selected_ids || [];
      if (selectedIds.length > 0) {
        const selectedSnippets = selectedIds.map((id) => uniqueSnippets[id]).filter(Boolean);
        const aiResponseText = selectedSnippets.map((s) => s.text).join(" ");
        const aiAudioUrls = selectedSnippets.map((s) => s.audioUrl);
        setMessages((prev) => prev.slice(0, -1).concat({
          author: "ai",
          text: aiResponseText,
          audioUrls: aiAudioUrls
        }));
        playAudioQueue(aiAudioUrls);
      } else {
        setMessages((prev) => prev.slice(0, -1).concat({
          author: "ai",
          text: "I couldn't find the right words to respond.",
          audioUrls: [],
          canRetry: true
        }));
        setLastFailedAttempt({ userMessageText, uniqueSnippets });
      }
    } catch (error) {
      console.error("AI Response Error:", error);
      setMessages((prev) => prev.slice(0, -1).concat({
        author: "system",
        text: "The AI encountered an error while thinking."
      }));
    } finally {
      setIsAiThinking(false);
    }
  };
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("header", { className: "bg-gray-800 p-4 shadow-md z-10 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxDEV("h1", { className: "text-xl font-bold text-indigo-400", children: "AI Voice Trainer" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 306,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: () => setIsSettingsOpen(true), className: "p-2 rounded-md hover:bg-gray-700 focus-ring", children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-cog" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 308,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 307,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 305,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("main", { className: "flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900", children: [
      messages.map((msg, index) => /* @__PURE__ */ jsxDEV("div", { className: `flex items-end gap-2 chat-bubble ${msg.author === "user" ? "justify-end" : "justify-start"}`, children: [
        msg.author === "ai" && /* @__PURE__ */ jsxDEV("div", { className: "w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-robot" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 315,
          columnNumber: 148
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 315,
          columnNumber: 49
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: `max-w-[80%] md:max-w-md p-3 rounded-lg ${msg.author === "user" ? "bg-blue-600 rounded-br-none" : "bg-gray-700 rounded-bl-none"} ${msg.author === "system" ? "bg-red-600" : ""}`, children: [
          msg.isTyping ? /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center space-x-1", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 319,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 320,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 321,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 318,
            columnNumber: 33
          }, this) : msg.text,
          msg.author === "ai" && msg.audioUrls && msg.audioUrls.length > 0 && /* @__PURE__ */ jsxDEV("button", { onClick: () => playAudioQueue(msg.audioUrls), className: "mt-2 text-indigo-300 hover:text-indigo-200 text-sm", children: [
            /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-play-circle mr-1" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 326,
              columnNumber: 37
            }, this),
            " Replay"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 325,
            columnNumber: 33
          }, this),
          msg.canRetry && /* @__PURE__ */ jsxDEV("button", { onClick: handleRetry, className: "mt-2 text-indigo-300 hover:text-indigo-200 text-sm", disabled: isAiThinking, children: [
            /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-arrows-rotate mr-1" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 331,
              columnNumber: 37
            }, this),
            " Try Again"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 330,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 316,
          columnNumber: 25
        }, this)
      ] }, index, true, {
        fileName: "<stdin>",
        lineNumber: 314,
        columnNumber: 21
      }, this)),
      /* @__PURE__ */ jsxDEV("div", { ref: chatEndRef }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 337,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 312,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("footer", { className: "p-4 bg-gray-800 shadow-inner", children: /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSendMessage, className: "flex gap-2 items-center", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "relative", ref: voiceSelectorRef, children: [
        /* @__PURE__ */ jsxDEV(VoiceSelectorButton, { selectedVoice, onClick: () => setIsVoiceSelectorOpen((prev) => !prev) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 343,
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
            lineNumber: 344,
            columnNumber: 25
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 342,
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
          disabled: isAiThinking || isUserSubmitting
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 351,
          columnNumber: 21
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("button", { type: "submit", className: "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed text-white font-bold p-2 rounded-md focus-ring w-12 h-10 flex items-center justify-center", disabled: isAiThinking || isUserSubmitting, children: isUserSubmitting ? /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 360,
        columnNumber: 45
      }, this) : /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-paper-plane" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 360,
        columnNumber: 148
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 359,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 341,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 340,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(
      VoiceSelectorModal,
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
        lineNumber: 365,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("div", { className: `fixed inset-0 bg-black bg-opacity-50 z-40 ${isSettingsOpen ? "block" : "hidden"}`, onClick: () => setIsSettingsOpen(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 373,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: `fixed bottom-0 left-0 right-0 bg-gray-800 p-6 rounded-t-2xl shadow-2xl z-50 settings-panel ${isSettingsOpen ? "open" : "closed"}`, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-lg font-semibold", children: "AI Settings" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 376,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("button", { onClick: () => setIsSettingsOpen(false), className: "p-2 rounded-md hover:bg-gray-700 focus-ring", children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-times" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 378,
          columnNumber: 25
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 377,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 375,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("label", { htmlFor: "aiDataSource", className: "block mb-2 text-sm font-medium text-gray-300", children: [
          "Other users to learn from: ",
          /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-indigo-400", children: aiDataSourceCount === 0 ? "Just Me" : aiDataSourceCount }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 383,
            columnNumber: 52
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 382,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400 mb-3", children: "Controls how many random users' chat snippets the AI can use." }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 385,
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
            lineNumber: 386,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 381,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 374,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 304,
    columnNumber: 9
  }, this);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 402,
  columnNumber: 13
}));
