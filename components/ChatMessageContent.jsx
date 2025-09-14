import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState } from "react";
function ChatMessageContent({ text }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const needsTruncation = text && text.length > 500;
  if (!needsTruncation) {
    return /* @__PURE__ */ jsxDEV(Fragment, { children: text }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 8,
      columnNumber: 16
    }, this);
  }
  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };
  return /* @__PURE__ */ jsxDEV("div", { onClick: toggleExpansion, className: "cursor-pointer", children: isExpanded ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
    text,
    /* @__PURE__ */ jsxDEV("span", { className: "text-gray-400 text-xs block mt-1 italic", children: "... click to collapse" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 20,
      columnNumber: 21
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 18,
    columnNumber: 17
  }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
    text.substring(0, 500),
    "...",
    /* @__PURE__ */ jsxDEV("span", { className: "text-gray-400 text-xs block mt-1 italic", children: "... click to see more" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 25,
      columnNumber: 21
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 23,
    columnNumber: 17
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 16,
    columnNumber: 9
  }, this);
}
export {
  ChatMessageContent
};
