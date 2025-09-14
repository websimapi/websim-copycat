import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
function RealtimeUsersHeader({ peers }) {
  const peerList = Object.values(peers || {});
  if (peerList.length === 0) return null;
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-800 px-4 pb-2", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 overflow-x-auto py-1", children: [
    /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400 font-medium mr-2 flex-shrink-0", children: "In room:" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 9,
      columnNumber: 9
    }, this),
    peerList.map((peer) => /* @__PURE__ */ jsxDEV("div", { className: "flex-shrink-0", title: peer.username, children: /* @__PURE__ */ jsxDEV("img", { src: peer.avatarUrl, alt: peer.username, className: "w-8 h-8 rounded-full border-2 border-gray-600" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 12,
      columnNumber: 13
    }, this) }, peer.id, false, {
      fileName: "<stdin>",
      lineNumber: 11,
      columnNumber: 11
    }, this))
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 8,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 7,
    columnNumber: 5
  }, this);
}
export {
  RealtimeUsersHeader as default
};
