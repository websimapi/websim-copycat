import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { VOICES } from "../constants.js";
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
          lineNumber: 13,
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
                lineNumber: 20,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("span", { children: voice.name }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 21,
                columnNumber: 25
              }, this)
            ]
          },
          voice.id,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 15,
            columnNumber: 21
          },
          this
        ))
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 12,
        columnNumber: 13
      }, this)
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 8,
      columnNumber: 9
    },
    this
  );
}
export {
  VoiceSelectorDropdown
};
