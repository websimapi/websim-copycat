import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
function Settings({
  isOpen,
  onClose,
  aiDataSourceCount,
  setAiDataSourceCount,
  profanityFilter,
  setProfanityFilter,
  usePassthrough,
  setUsePassthrough,
  allowPassthrough,
  onToggleAllowPassthrough,
  onResetHistory
}) {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-40", onClick: onClose }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 20,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "fixed bottom-0 left-0 right-0 bg-gray-800 p-6 rounded-t-2xl shadow-2xl z-50 settings-panel open", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-lg font-semibold", children: "AI Settings" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 23,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("button", { onClick: onClose, className: "p-2 rounded-md hover:bg-gray-700 focus-ring", children: /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-times" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 25,
          columnNumber: 25
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 24,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 22,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("label", { htmlFor: "aiDataSource", className: "block mb-2 text-sm font-medium text-gray-300", children: [
            "Other users to learn from: ",
            /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-indigo-400", children: aiDataSourceCount === 0 ? "Just Me" : aiDataSourceCount }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 31,
              columnNumber: 56
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 30,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400 mb-3", children: "Controls how many random users' chat snippets the AI can use." }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 33,
            columnNumber: 25
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
              lineNumber: 34,
              columnNumber: 25
            },
            this
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 29,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "border-t border-gray-700 pt-6", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-md font-semibold mb-3", children: "Content Filter" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 45,
            columnNumber: 26
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("label", { htmlFor: "profanityFilter", className: "font-medium text-gray-300", children: "Profanity Filter" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 48,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400 mt-1", children: "When enabled, the AI will avoid responses containing PG-13+ language." }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 49,
                columnNumber: 33
              }, this)
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 47,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV("label", { className: "toggle-switch", children: [
              /* @__PURE__ */ jsxDEV("input", { id: "profanityFilter", type: "checkbox", checked: profanityFilter, onChange: () => setProfanityFilter((prev) => !prev) }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 52,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "toggle-slider" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 53,
                columnNumber: 33
              }, this)
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 51,
              columnNumber: 29
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 46,
            columnNumber: 26
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 44,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "border-t border-gray-700 pt-6", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-md font-semibold mb-3", children: "Passthrough Network" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 58,
            columnNumber: 26
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("label", { htmlFor: "usePassthrough", className: "font-medium text-gray-300", children: "Use Passthrough on Failure" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 61,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400 mt-1", children: "If your AI request fails, send it to another user to process." }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 62,
                columnNumber: 33
              }, this)
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 60,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV("label", { className: "toggle-switch", children: [
              /* @__PURE__ */ jsxDEV("input", { id: "usePassthrough", type: "checkbox", checked: usePassthrough, onChange: () => setUsePassthrough((prev) => !prev) }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 65,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "toggle-slider" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 66,
                columnNumber: 33
              }, this)
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 64,
              columnNumber: 29
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 59,
            columnNumber: 26
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between mt-4", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("label", { htmlFor: "allowPassthrough", className: "font-medium text-gray-300", children: "Process Others' Requests" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 71,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400 mt-1", children: "Help others by processing their failed AI requests." }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 72,
                columnNumber: 33
              }, this)
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 70,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV("label", { className: "toggle-switch", children: [
              /* @__PURE__ */ jsxDEV("input", { id: "allowPassthrough", type: "checkbox", checked: allowPassthrough, onChange: onToggleAllowPassthrough }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 75,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "toggle-slider" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 76,
                columnNumber: 33
              }, this)
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 74,
              columnNumber: 30
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 69,
            columnNumber: 26
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 57,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "border-t border-gray-700 pt-6", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: "text-md font-semibold mb-3 text-red-400", children: "Danger Zone" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 81,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("label", { className: "font-medium text-gray-300", children: "Reset Chat History" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 84,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400 mt-1", children: "Permanently delete all your messages from solo and realtime chats." }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 85,
                columnNumber: 33
              }, this)
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 83,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: onResetHistory,
                className: "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus-ring text-sm",
                children: "Reset"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 87,
                columnNumber: 29
              },
              this
            )
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 82,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 80,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 28,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 21,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 19,
    columnNumber: 9
  }, this);
}
function ResetConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 bg-black bg-opacity-75 z-[60] flex items-center justify-center p-4", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full border border-gray-700", children: [
    /* @__PURE__ */ jsxDEV("h2", { className: "text-lg font-bold text-red-400", children: "Are you sure?" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 107,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-300 mt-2 mb-6", children: "This action is irreversible. It will permanently delete your personal chat history and all of your messages from the realtime chat." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 108,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end gap-4", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: onClose,
          className: "px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white font-semibold focus-ring",
          children: "Cancel"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 112,
          columnNumber: 21
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: onConfirm,
          className: "px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold focus-ring",
          children: "Confirm Reset"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 118,
          columnNumber: 21
        },
        this
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 111,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 106,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 105,
    columnNumber: 9
  }, this);
}
export {
  ResetConfirmationModal,
  Settings
};
