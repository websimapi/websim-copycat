import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { createRoot } from "react-dom/client";
import { WebsimSocket, useQuery } from "@websim/use-query";
const room = new WebsimSocket();
const App = () => {
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("header", { className: "bg-gray-800 p-4 shadow-md z-10 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxDEV("h1", { className: "text-xl font-bold text-indigo-400", children: "Copycat?" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 11,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("button", { className: "p-2 rounded-md hover:bg-gray-700 focus-ring", children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-cog" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 13,
        columnNumber: 21
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 12,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 10,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-800", children: /* @__PURE__ */ jsxDEV("div", { className: "px-4 pt-2", children: /* @__PURE__ */ jsxDEV("div", { className: "flex border-b border-gray-700", children: [
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
          lineNumber: 20,
          columnNumber: 25
        }
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
          lineNumber: 26,
          columnNumber: 25
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 19,
      columnNumber: 21
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 18,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 17,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("main", { className: "flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900", children: [
      messages.map((msg, index) => /* @__PURE__ */ jsxDEV("div", { className: `flex items-end gap-2 chat-bubble ${msg.isUser ? "justify-end" : "justify-start"}`, children: [
        msg.author === "ai" && /* @__PURE__ */ jsxDEV("div", { className: "w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-robot" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 39,
          columnNumber: 148
        }) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 39,
          columnNumber: 49
        }),
        /* @__PURE__ */ jsxDEV("div", { className: `max-w-[80%] md:max-w-md p-3 rounded-lg break-words ${msg.isUser ? "bg-blue-600 rounded-br-none" : "bg-gray-700 rounded-bl-none"} ${msg.author === "system" ? "bg-red-600" : ""}`, children: [
          msg.isTyping ? /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center space-x-1", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 43,
              columnNumber: 37
            }),
            /* @__PURE__ */ jsxDEV("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 44,
              columnNumber: 37
            }),
            /* @__PURE__ */ jsxDEV("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 45,
              columnNumber: 37
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 42,
            columnNumber: 33
          }) : msg.isRetrying ? /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-yellow-300 italic", children: msg.text }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 48,
            columnNumber: 33
          }) : /* @__PURE__ */ jsxDEV(ChatMessageContent, { text: msg.text }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 49,
            columnNumber: 33
          }),
          msg.author === "ai" && msg.audioUrls && msg.audioUrls.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "mt-2 flex items-center gap-4", children: /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => handlePlayPause(msg.id || index, msg.audioUrls),
              className: "text-indigo-300 hover:text-indigo-200 text-sm flex items-center gap-1",
              children: nowPlayingInfo.key === (msg.id || index) && nowPlayingInfo.isPlaying ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-pause-circle" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 58,
                  columnNumber: 49
                }),
                " Pause"
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 57,
                columnNumber: 45
              }) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
                /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-play-circle" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 62,
                  columnNumber: 49
                }),
                nowPlayingInfo.key === (msg.id || index) && !nowPlayingInfo.isPlaying ? "Resume" : "Play"
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 61,
                columnNumber: 45
              })
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 52,
              columnNumber: 37
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 51,
            columnNumber: 33
          }),
          msg.canRetry && /* @__PURE__ */ jsxDEV("button", { onClick: handleRetry, className: "mt-2 text-indigo-300 hover:text-indigo-200 text-sm", disabled: isAiThinking, children: [
            /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-arrows-rotate mr-1" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 71,
              columnNumber: 37
            }),
            " Try Again"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 70,
            columnNumber: 33
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 40,
          columnNumber: 25
        })
      ] }, msg.id || index, true, {
        fileName: "<stdin>",
        lineNumber: 38,
        columnNumber: 21
      })),
      /* @__PURE__ */ jsxDEV("div", { ref: chatEndRef }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 77,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 36,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("footer", { className: "p-4 bg-gray-800 shadow-inner", children: /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSendMessage, className: "flex gap-2 items-center", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "relative", ref: voiceSelectorRef, children: [
        /* @__PURE__ */ jsxDEV(VoiceSelectorButton, { selectedVoice, onClick: () => setIsVoiceSelectorOpen((prev) => !prev) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 83,
          columnNumber: 25
        }),
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
            lineNumber: 84,
            columnNumber: 25
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 82,
        columnNumber: 21
      }),
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
          lineNumber: 91,
          columnNumber: 21
        }
      ),
      /* @__PURE__ */ jsxDEV("button", { type: "submit", className: "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed text-white font-bold p-2 rounded-md focus-ring w-12 h-10 flex items-center justify-center", disabled: isSubmitDisabled, children: isUserSubmitting ? /* @__PURE__ */ jsxDEV("div", { className: "w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 100,
        columnNumber: 45
      }) : /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-paper-plane" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 100,
        columnNumber: 148
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 99,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 81,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 80,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { className: `fixed inset-0 bg-black bg-opacity-50 z-40 ${isSettingsOpen ? "block" : "hidden"}`, onClick: () => setIsSettingsOpen(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 106,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { className: `fixed bottom-0 left-0 right-0 bg-gray-800 p-6 rounded-t-2xl shadow-2xl z-50 settings-panel ${isSettingsOpen ? "open" : "closed"}`, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-lg font-semibold", children: "AI Settings" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 109,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("button", { onClick: () => setIsSettingsOpen(false), className: "p-2 rounded-md hover:bg-gray-700 focus-ring", children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-times" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 111,
          columnNumber: 25
        }) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 110,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 108,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { htmlFor: "aiDataSource", className: "block mb-2 text-sm font-medium text-gray-300", children: [
            "Other users to learn from: ",
            /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-indigo-400", children: aiDataSourceCount === 0 ? "Just Me" : aiDataSourceCount }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 117,
              columnNumber: 56
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 116,
            columnNumber: 25
          }),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400 mb-3", children: "Controls how many random users' chat snippets the AI can use." }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 119,
            columnNumber: 25
          }),
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
              lineNumber: 120,
              columnNumber: 25
            }
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 115,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "border-t border-gray-700 pt-6", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-md font-semibold mb-3", children: "Content Filter" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 131,
            columnNumber: 26
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("label", { htmlFor: "profanityFilter", className: "font-medium text-gray-300", children: "Profanity Filter" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 134,
                columnNumber: 33
              }),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400 mt-1", children: "When enabled, the AI will avoid responses containing PG-13+ language." }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 135,
                columnNumber: 33
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 133,
              columnNumber: 29
            }),
            /* @__PURE__ */ jsxDEV("label", { className: "toggle-switch", children: [
              /* @__PURE__ */ jsxDEV("input", { id: "profanityFilter", type: "checkbox", checked: profanityFilter, onChange: () => setProfanityFilter((prev) => !prev) }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 138,
                columnNumber: 33
              }),
              /* @__PURE__ */ jsxDEV("span", { className: "toggle-slider" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 139,
                columnNumber: 33
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 137,
              columnNumber: 29
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 132,
            columnNumber: 26
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 130,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "border-t border-gray-700 pt-6", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-md font-semibold mb-3", children: "Passthrough Network" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 144,
            columnNumber: 26
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("label", { htmlFor: "usePassthrough", className: "font-medium text-gray-300", children: "Use Passthrough on Failure" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 147,
                columnNumber: 33
              }),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400 mt-1", children: "If your AI request fails, send it to another user to process." }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 148,
                columnNumber: 33
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 146,
              columnNumber: 29
            }),
            /* @__PURE__ */ jsxDEV("label", { className: "toggle-switch", children: [
              /* @__PURE__ */ jsxDEV("input", { id: "usePassthrough", type: "checkbox", checked: usePassthrough, onChange: () => setUsePassthrough((prev) => !prev) }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 151,
                columnNumber: 33
              }),
              /* @__PURE__ */ jsxDEV("span", { className: "toggle-slider" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 152,
                columnNumber: 33
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 150,
              columnNumber: 29
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 145,
            columnNumber: 26
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between mt-4", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("label", { htmlFor: "allowPassthrough", className: "font-medium text-gray-300", children: "Process Others' Requests" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 157,
                columnNumber: 33
              }),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400 mt-1", children: "Help others by processing their failed AI requests." }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 158,
                columnNumber: 33
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 156,
              columnNumber: 29
            }),
            /* @__PURE__ */ jsxDEV("label", { className: "toggle-switch", children: [
              /* @__PURE__ */ jsxDEV("input", { id: "allowPassthrough", type: "checkbox", checked: allowPassthrough, onChange: handleToggleAllowPassthrough }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 161,
                columnNumber: 33
              }),
              /* @__PURE__ */ jsxDEV("span", { className: "toggle-slider" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 162,
                columnNumber: 33
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 160,
              columnNumber: 30
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 155,
            columnNumber: 26
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 143,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "border-t border-gray-700 pt-6", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-md font-semibold mb-3 text-red-400", children: "Danger Zone" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 167,
            columnNumber: 25
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("label", { className: "font-medium text-gray-300", children: "Reset Chat History" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 170,
                columnNumber: 33
              }),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400 mt-1", children: "Permanently delete all your messages from solo and realtime chats." }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 171,
                columnNumber: 33
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 169,
              columnNumber: 29
            }),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => setIsResetConfirmOpen(true),
                className: "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus-ring text-sm",
                children: "Reset"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 173,
                columnNumber: 29
              }
            )
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 168,
            columnNumber: 25
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 166,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 114,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 107,
      columnNumber: 13
    }),
    isResetConfirmOpen && /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 bg-black bg-opacity-75 z-[60] flex items-center justify-center p-4", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full border border-gray-700", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-lg font-bold text-red-400", children: "Are you sure?" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 188,
        columnNumber: 25
      }),
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-300 mt-2 mb-6", children: "This action is irreversible. It will permanently delete your personal chat history and all of your messages from the realtime chat." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 189,
        columnNumber: 25
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end gap-4", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setIsResetConfirmOpen(false),
            className: "px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white font-semibold focus-ring",
            children: "Cancel"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 193,
            columnNumber: 29
          }
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleResetHistory,
            className: "px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold focus-ring",
            children: "Confirm Reset"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 199,
            columnNumber: 29
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 192,
        columnNumber: 25
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 187,
      columnNumber: 21
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 186,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 9,
    columnNumber: 9
  });
};
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 214,
  columnNumber: 13
}));
