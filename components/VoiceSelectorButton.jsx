import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { VOICES } from "../constants.js";
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
          lineNumber: 12,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-chevron-down text-xs text-gray-400" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 13,
          columnNumber: 13
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "<stdin>",
      lineNumber: 7,
      columnNumber: 9
    },
    this
  );
}
export {
  VoiceSelectorButton
};
