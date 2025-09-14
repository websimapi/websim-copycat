import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { WebsimSocket, useQuery } from "@websim/use-query";
import { VOICES, PERSONAL_CHAT_GREETING, REALTIME_CHAT_GREETING } from "./constants.js";
import { sanitizeForAI, getAiSelectionFromSnippets } from "./utils.js";
import { useAudioPlayer } from "./hooks/useAudioPlayer.js";
import { ChatMessage } from "./components/ChatMessage.jsx";
import { VoiceSelectorButton, VoiceSelectorDropdown } from "./components/VoiceSelector.jsx";
import { RealtimeUsersHeader } from "./components/RealtimeUsersHeader.jsx";
import { Settings, ResetConfirmationModal } from "./components/Settings.jsx";
const room = new WebsimSocket();
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
  const [realtimeMessages, setRealtimeMessages] = useState([REALTIME_CHAT_GREETING]);
  const [allowPassthrough, setAllowPassthrough] = useState(false);
  const [usePassthrough, setUsePassthrough] = useState(true);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [profanityFilter, setProfanityFilter] = useState(true);
  const [hasClickedSettings, setHasClickedSettings] = useState(true);
  const { nowPlayingInfo, handlePlayPause } = useAudioPlayer();
  const chatEndRef = useRef(null);
  const voiceSelectorRef = useRef(null);
  const { data: userHistoryData, loading: historyLoading } = useQuery(
    currentUser ? room.collection("chat_histories").filter({ id: currentUser.id }) : null
  );
  const userHistory = userHistoryData?.[0]?.messages || [];
  const { data: realtimeMessagesData } = useQuery(
    room.collection("realtime_chat_messages")
  );
  useEffect(() => {
    const initialize = async () => {
      await room.initialize();
      const user = await window.websim.getCurrentUser();
      setCurrentUser(user);
      setPeers(room.peers);
      const clickedSettings = localStorage.getItem("hasClickedSettings");
      if (!clickedSettings) {
        setHasClickedSettings(false);
      }
      const unsubscribePresence = room.subscribePresence(() => {
        setPeers({ ...room.peers });
      });
      const unsubscribePassthrough = room.subscribePresenceUpdateRequests(handlePassthroughRequest);
      room.onmessage = (event) => {
        const data = event.data;
        if (data.type === "play_audio_realtime" && Array.isArray(data.urls)) {
          const messageKey = `realtime-${Date.now()}`;
          handlePlayPause(messageKey, data.urls);
        }
      };
      document.getElementById("root").style.opacity = "1";
      return () => {
        unsubscribePresence();
        unsubscribePassthrough();
      };
    };
    initialize();
  }, []);
  useEffect(() => {
    if (realtimeMessagesData && currentUser) {
      const sortedMessages = [...realtimeMessagesData].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      const formattedMessages = sortedMessages.map((msg) => ({
        ...msg,
        audioUrls: msg.audio_urls,
        // Map from db column name to component property
        isUser: msg.author === "user" && msg.username === currentUser.username
      }));
      setRealtimeMessages([REALTIME_CHAT_GREETING, ...formattedMessages]);
    }
  }, [realtimeMessagesData, currentUser]);
  useEffect(() => {
    if (chatMode === "realtime") {
      setMessages(realtimeMessages);
    } else {
      setMessages([PERSONAL_CHAT_GREETING]);
    }
  }, [chatMode, realtimeMessages]);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "auto" });
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
  const handleOpenSettings = () => {
    if (!hasClickedSettings) {
      localStorage.setItem("hasClickedSettings", "true");
      setHasClickedSettings(true);
    }
    setIsSettingsOpen(true);
  };
  const handleToggleAllowPassthrough = () => {
    const newValue = !allowPassthrough;
    setAllowPassthrough(newValue);
    room.updatePresence({ isPassthroughHost: newValue });
  };
  const handlePassthroughRequest = async (updateRequest, fromClientId) => {
    if (updateRequest.type === "passthrough_request") {
      const { userMessageText, availableSnippets, chatHistory, profanityFilter: requesterProfanityFilter } = updateRequest;
      const fromUsername = room.peers[fromClientId]?.username || "another user";
      try {
        await room.collection("realtime_chat_messages").create({
          author: "system",
          text: `AI request for ${fromUsername} is being processed...`,
          audio_urls: []
        });
        const result = await getAiSelectionFromSnippets({
          userMessage: userMessageText,
          availableSnippets,
          chatHistory,
          attempt: 1,
          isPassthrough: true,
          profanityFilter: requesterProfanityFilter
        });
        if (result.success && result.selectedIds.length > 0) {
          const selectedSnippets = result.selectedIds.map((id) => availableSnippets[id]).filter(Boolean);
          const aiResponseText = selectedSnippets.map((s) => s.text).join(" ");
          const aiAudioUrls = selectedSnippets.map((s) => s.audioUrl);
          handlePlayPause(`passthrough-${Date.now()}`, aiAudioUrls);
          room.send({ type: "play_audio_realtime", urls: aiAudioUrls, echo: true });
          await room.collection("realtime_chat_messages").create({
            author: "ai",
            text: aiResponseText,
            audio_urls: aiAudioUrls
          });
        } else {
          await room.collection("realtime_chat_messages").create({
            author: "system",
            text: `AI failed to generate a passthrough response for ${fromUsername}.`,
            audio_urls: []
          });
        }
      } catch (e) {
        console.error("Passthrough request failed:", e);
        await room.collection("realtime_chat_messages").create({
          author: "system",
          text: `An error occurred processing a passthrough request for ${fromUsername}.`,
          audio_urls: []
        });
      }
    }
  };
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
${uniqueSnippets.map((s, i) => `${i}: "${sanitizeForAI(s.text)}"`).join("\n")}` }
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
        handlePlayPause("retry-response", newAiMessage.audioUrls);
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
        // Store original text for display
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
      setMessages((prev) => [...prev, { author: "user", text: newSnippet.text, isUser: true }]);
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
        // Store original text for display
        audio_urls: [newSnippet.audioUrl]
      });
      room.send({ type: "play_audio_realtime", urls: [newSnippet.audioUrl], echo: false });
    }
    setIsUserSubmitting(false);
    triggerAiResponse(newSnippet.text);
  };
  const triggerAiResponse = async (userMessageText, attempt = 1) => {
    const MAX_ATTEMPTS = 5;
    const RETRY_DELAY_MS = 3e3;
    if (attempt === 1) {
      setIsAiThinking(true);
      if (chatMode === "personal") {
        setMessages((prev) => [...prev, { author: "ai", text: "...", isTyping: true, isRetrying: false }]);
      }
      setLastFailedAttempt(null);
    }
    const sanitizedUserMessage = sanitizeForAI(userMessageText);
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
      let chatHistory = "";
      if (chatMode === "realtime") {
        chatHistory = realtimeMessages.slice(-6, -1).map((msg) => `${msg.isUser ? msg.username || "User" : "AI"}: ${msg.text}`).join("\n");
      }
      const getAiSelection = async (retries = 3) => {
        for (let i = 0; i < retries; i++) {
          try {
            return await getAiSelectionFromSnippets({
              userMessage: sanitizedUserMessage,
              availableSnippets,
              chatHistory,
              attempt,
              profanityFilter
            });
          } catch (error) {
            console.error(`getAiSelection attempt ${i + 1} failed:`, error);
            if (i === retries - 1) {
              throw error;
            }
            await new Promise((resolve) => setTimeout(resolve, 200 * (i + 1)));
          }
        }
      };
      let result = await getAiSelection();
      let selectedIds = result.selectedIds || [];
      let selectedSnippets = selectedIds.map((id) => availableSnippets[id]).filter(Boolean);
      let aiResponseText = selectedSnippets.map((s) => s.text).join(" ");
      if (selectedIds.length > 0 && aiResponseText.trim().toLowerCase() === userMessageText.trim().toLowerCase()) {
        const retryResult = await getAiSelectionFromSnippets({
          userMessage: sanitizedUserMessage,
          availableSnippets,
          chatHistory,
          attempt: 2,
          // Signal it's a retry
          profanityFilter
        });
        selectedIds = retryResult.selectedIds || [];
        selectedSnippets = selectedIds.map((id) => availableSnippets[id]).filter(Boolean);
        aiResponseText = selectedSnippets.map((s) => s.text).join(" ");
      }
      if (selectedIds.length > 0) {
        const aiAudioUrls = selectedSnippets.map((s) => s.audioUrl);
        const aiMessage = { author: "ai", text: aiResponseText, audioUrls: aiAudioUrls };
        handlePlayPause(chatMode === "personal" ? `ai-${messages.length}` : `ai-realtime-${Date.now()}`, aiAudioUrls);
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
        setIsAiThinking(false);
      } else {
        aiThinkingFailed("I couldn't find the right words to respond.", true);
        setIsAiThinking(false);
      }
    } catch (error) {
      console.error(`AI Response Error (Attempt ${attempt}/${MAX_ATTEMPTS}):`, error);
      if (attempt < MAX_ATTEMPTS) {
        if (chatMode === "personal") {
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMsg = newMessages[newMessages.length - 1];
            if (lastMsg && (lastMsg.isTyping || lastMsg.isRetrying)) {
              newMessages[newMessages.length - 1] = {
                ...lastMsg,
                text: `AI failed. Retrying... (${attempt + 1}/${MAX_ATTEMPTS})`,
                isTyping: false,
                isRetrying: true
              };
            }
            return newMessages;
          });
        }
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        triggerAiResponse(userMessageText, attempt + 1);
      } else {
        console.error("AI failed to respond after multiple attempts.");
        if (chatMode === "realtime" && usePassthrough) {
          const hosts = Object.entries(room.presence).filter(([id, pres]) => pres?.isPassthroughHost && id !== room.clientId);
          if (hosts.length > 0) {
            const randomHost = hosts[Math.floor(Math.random() * hosts.length)];
            const hostId = randomHost[0];
            const otherUsersData = await room.query("SELECT messages FROM public.chat_histories WHERE id != $1 ORDER BY random() LIMIT $2", [currentUser.id, aiDataSourceCount]);
            const otherSnippets = otherUsersData.flatMap((row) => row.messages || []);
            const realtimeChatData = await room.query("SELECT text, audio_urls FROM public.realtime_chat_messages WHERE author = 'user' ORDER BY created_at DESC LIMIT 100");
            const realtimeSnippets = realtimeChatData.flatMap((msg) => (msg.audio_urls || []).map((audioUrl) => ({ text: msg.text, audioUrl }))).filter((snippet) => snippet.audioUrl);
            const userSnippets = userHistoryData?.[0]?.messages || [];
            const allSnippets = [...userSnippets, ...otherSnippets, ...realtimeSnippets];
            const uniqueSnippets = [...new Map(allSnippets.map((item) => [item.audioUrl, item])).values()];
            const availableSnippets = uniqueSnippets.sort(() => 0.5 - Math.random()).slice(0, 400);
            const chatHistory = realtimeMessages.slice(-6, -1).map((msg) => `${msg.isUser ? msg.username || "User" : "AI"}: ${msg.text}`).join("\n");
            room.requestPresenceUpdate(hostId, {
              type: "passthrough_request",
              userMessageText,
              availableSnippets,
              chatHistory,
              profanityFilter
            });
            await room.collection("realtime_chat_messages").create({
              author: "system",
              text: `Request failed. Passing to ${room.peers[hostId]?.username || "another user"}...`,
              audio_urls: []
            });
            setIsAiThinking(false);
            return;
          }
        }
        const errorMessage = "The AI failed to respond after multiple attempts. Please try again later.";
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
        setIsAiThinking(false);
      }
    }
  };
  const handleResetHistory = async () => {
    if (!currentUser) return;
    try {
      await room.collection("chat_histories").delete(currentUser.id);
      const userRealtimeMessages = await room.collection("realtime_chat_messages").filter({ username: currentUser.username }).getList();
      const deletePromises = userRealtimeMessages.map(
        (msg) => room.collection("realtime_chat_messages").delete(msg.id)
      );
      await Promise.all(deletePromises);
      if (chatMode === "personal") {
        setMessages([PERSONAL_CHAT_GREETING]);
      }
    } catch (error) {
      console.error("Error resetting chat history:", error);
      const systemMessage = { author: "system", text: "Failed to reset history. Please try again." };
      if (chatMode === "personal") {
        setMessages((prev) => [...prev, systemMessage]);
      } else {
        await room.collection("realtime_chat_messages").create({
          author: "system",
          text: systemMessage.text,
          audio_urls: []
        });
      }
    } finally {
      setIsResetConfirmOpen(false);
      setIsSettingsOpen(false);
    }
  };
  const isSubmitDisabled = isAiThinking || isUserSubmitting;
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("header", { className: "bg-gray-800 p-4 shadow-md z-10 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxDEV("h1", { className: "text-xl font-bold text-indigo-400", children: "Copycat?" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 615,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: handleOpenSettings, className: `p-2 rounded-md hover:bg-gray-700 focus-ring ${!hasClickedSettings ? "glow-animation" : ""}`, children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-cog" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 617,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 616,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 614,
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
            lineNumber: 624,
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
            lineNumber: 630,
            columnNumber: 25
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 623,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 622,
        columnNumber: 17
      }, this),
      chatMode === "realtime" && /* @__PURE__ */ jsxDEV(RealtimeUsersHeader, { peers }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 638,
        columnNumber: 45
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 621,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("main", { className: "flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900", children: [
      messages.map((msg, index) => /* @__PURE__ */ jsxDEV(
        ChatMessage,
        {
          msg,
          index,
          chatMode,
          currentUser,
          nowPlayingInfo,
          onPlayPause: handlePlayPause,
          onRetry: handleRetry,
          isAiThinking
        },
        msg.id || index,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 643,
          columnNumber: 21
        },
        this
      )),
      /* @__PURE__ */ jsxDEV("div", { ref: chatEndRef }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 655,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 641,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("footer", { className: "p-4 bg-gray-800 shadow-inner", children: /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSendMessage, className: "flex gap-2 items-center", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "relative", ref: voiceSelectorRef, children: [
        /* @__PURE__ */ jsxDEV(VoiceSelectorButton, { selectedVoice, onClick: () => setIsVoiceSelectorOpen((prev) => !prev) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 661,
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
            lineNumber: 662,
            columnNumber: 25
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 660,
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
          lineNumber: 669,
          columnNumber: 21
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("button", { type: "submit", className: "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed text-white font-bold p-2 rounded-md focus-ring w-12 h-10 flex items-center justify-center", disabled: isSubmitDisabled, children: isUserSubmitting ? /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 678,
        columnNumber: 45
      }, this) : /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-paper-plane" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 678,
        columnNumber: 148
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 677,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 659,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 658,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(
      Settings,
      {
        isOpen: isSettingsOpen,
        onClose: () => setIsSettingsOpen(false),
        aiDataSourceCount,
        setAiDataSourceCount,
        profanityFilter,
        setProfanityFilter,
        usePassthrough,
        setUsePassthrough,
        allowPassthrough,
        onToggleAllowPassthrough: handleToggleAllowPassthrough,
        onResetHistory: () => setIsResetConfirmOpen(true)
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 683,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      ResetConfirmationModal,
      {
        isOpen: isResetConfirmOpen,
        onClose: () => setIsResetConfirmOpen(false),
        onConfirm: handleResetHistory
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 697,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 613,
    columnNumber: 9
  }, this);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 707,
  columnNumber: 13
}));
