import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { VOICES } from "../constants.js";
function VoiceSelectorButton({ selectedVoice, onClick }) {
  const voiceDetails = VOICES.find((v) => v.id === selectedVoice);
  return /* @__PURE__ */ jsxDEV("button", { type: "button", onClick, className: "bg-gray-700 border border-gray-600 rounded-md p-2 focus-ring flex items-center gap-2 flex-shrink-0", children: [
    /* @__PURE__ */ jsxDEV("span", { className: "text-lg", children: voiceDetails?.flag || "\u{1F50A}" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 8,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-chevron-down text-xs text-gray-400" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 9,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 7,
    columnNumber: 5
  }, this);
}
function VoiceSelectorDropdown({ isOpen, onClose, selectedVoice, onSelectVoice }) {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-full left-0 mb-2 w-64 bg-gray-800 rounded-lg shadow-lg z-20 border border-gray-700 transition-all duration-300 ease-in-out transform opacity-0 translate-y-2 data-[open=true]:opacity-100 data-[open=true]:translate-y-0", "data-open": isOpen, children: /* @__PURE__ */ jsxDEV("div", { className: "p-2 max-h-[40vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-semibold text-center mb-2 text-gray-400 px-2 pt-1", children: "Select a Voice" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 19,
      columnNumber: 9
    }, this),
    VOICES.map((voice) => /* @__PURE__ */ jsxDEV("button", { onClick: () => {
      onSelectVoice(voice.id);
      onClose();
    }, className: `w-full text-left p-2 rounded-md flex items-center gap-3 transition-colors text-sm ${selectedVoice === voice.id ? "bg-indigo-600 text-white" : "hover:bg-gray-700"}`, children: [
      /* @__PURE__ */ jsxDEV("span", { className: "text-xl", children: voice.flag }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 22,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: voice.name }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 23,
        columnNumber: 13
      }, this)
    ] }, voice.id, true, {
      fileName: "<stdin>",
      lineNumber: 21,
      columnNumber: 11
    }, this))
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 18,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 17,
    columnNumber: 5
  }, this);
}
export {
  VoiceSelectorButton,
  VoiceSelectorDropdown
};
