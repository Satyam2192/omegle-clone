"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/chat/page",{

/***/ "(app-pages-browser)/./app/chat/page.js":
/*!**************************!*\
  !*** ./app/chat/page.js ***!
  \**************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! socket.io-client */ \"(app-pages-browser)/./node_modules/socket.io-client/build/esm/index.js\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\nconst Chat = ()=>{\n    _s();\n    const [messages, setMessages] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    const [message, setMessage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"\");\n    const [onlineUsers, setOnlineUsers] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);\n    const [targetUserId, setTargetUserId] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [partnerUserId, setPartnerUserId] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const socketRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)();\n    const localVideoRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)();\n    const remoteVideoRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)();\n    const peerConnectionRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)();\n    const handleSkip = ()=>{\n        socketRef.current.emit(\"skip\", targetUserId);\n        setTargetUserId(null);\n    };\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        // Set up socket connection\n        socketRef.current = (0,socket_io_client__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\"http://localhost:5000\");\n        socketRef.current.on(\"connected\", (param)=>{\n            let { userId, partnerUserId } = param;\n            setTargetUserId(userId);\n            setPartnerUserId(partnerUserId);\n            setupVideoCall(); // Initialize video call setup here\n        });\n        // Event listener for incoming messages\n        socketRef.current.on(\"message\", (param)=>{\n            let { userId, message } = param;\n            setMessages((prevMessages)=>[\n                    ...prevMessages,\n                    \"\".concat(userId, \": \").concat(message)\n                ]);\n        });\n        // Event listener for online user count\n        socketRef.current.on(\"onlineUsers\", (count)=>{\n            setOnlineUsers(count);\n        });\n        // Event listener for connected users\n        socketRef.current.on(\"connectedUsers\", (users)=>{\n            // Update online users count\n            setOnlineUsers(users.length);\n            // Skip to the next user if the current user disconnects\n            if (!users.includes(targetUserId)) {\n                handleSkip();\n            }\n        });\n        socketRef.current.on(\"skip\", ()=>{\n        // Handle skip response (if needed)\n        });\n        // Set up video call\n        const setupVideoCall = async ()=>{\n            // Example: Get user media\n            const stream = await navigator.mediaDevices.getUserMedia({\n                video: true,\n                audio: true\n            });\n            localVideoRef.current.srcObject = stream;\n            // Example: Create peer connection\n            peerConnectionRef.current = new RTCPeerConnection();\n            // Example: Add tracks to peer connection\n            stream.getTracks().forEach((track)=>{\n                peerConnectionRef.current.addTrack(track, stream);\n            });\n            // Set up ICE candidates and offer/answer handling\n            setupICEHandling();\n            // Example: Set remote video element source\n            peerConnectionRef.current.ontrack = (event)=>{\n                if (event.streams[0].id === targetUserId) {\n                    localVideoRef.current.srcObject = event.streams[0];\n                } else if (event.streams[0].id === partnerUserId) {\n                    remoteVideoRef.current.srcObject = event.streams[0];\n                }\n            };\n            try {\n                // Example: Create and send offer\n                const offer = await peerConnectionRef.current.createOffer();\n                // Check signaling state before setting local description\n                if (peerConnectionRef.current.signalingState === \"stable\") {\n                    await peerConnectionRef.current.setLocalDescription(offer);\n                    // Use targetUserId from state\n                    socketRef.current.emit(\"offer\", offer, targetUserId);\n                } else {\n                    console.warn(\"Signaling state is not stable. Offer not sent.\");\n                }\n            } catch (error) {\n                console.error(\"Error accessing camera and/or microphone:\", error);\n            }\n        };\n        setupVideoCall();\n        return ()=>{\n            socketRef.current.disconnect();\n            cleanupVideoCall();\n        };\n    }, [\n        targetUserId,\n        partnerUserId\n    ]);\n    const handleSendMessage = ()=>{\n        if (message.trim() !== \"\") {\n            socketRef.current.emit(\"message\", message);\n            setMessage(\"\");\n        }\n    };\n    // Set up ICE candidates and offer/answer handling\n    const setupICEHandling = ()=>{\n        // Implement ICE candidate handling\n        peerConnectionRef.current.onicecandidate = (event)=>{\n            if (event.candidate) {\n                // Send the ICE candidate to the other user\n                socketRef.current.emit(\"ice-candidate\", event.candidate, targetUserId);\n            }\n        };\n        // Implement offer/answer handling\n        socketRef.current.on(\"offer\", async (offer, senderUserId)=>{\n            // Handle incoming offer\n            // ...\n            // Example: Set remote description\n            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));\n            // Example: Create and send answer\n            const answer = await peerConnectionRef.current.createAnswer();\n            await peerConnectionRef.current.setLocalDescription(answer);\n            socketRef.current.emit(\"answer\", answer, senderUserId);\n        });\n        socketRef.current.on(\"answer\", async (answer)=>{\n            // Handle incoming answer\n            // ...\n            // Example: Set remote description\n            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));\n        });\n        socketRef.current.on(\"ice-candidate\", async (candidate)=>{\n            // Handle incoming ICE candidate\n            // ...\n            // Example: Add the ICE candidate to the peer connection\n            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));\n        });\n    };\n    // Implement cleanup logic for video call\n    const cleanupVideoCall = ()=>{\n        // Close the peer connection\n        if (peerConnectionRef.current) {\n            peerConnectionRef.current.close();\n            peerConnectionRef.current = null;\n        }\n        // Stop and close the local video stream\n        const localStream = localVideoRef.current ? localVideoRef.current.srcObject : null;\n        if (localStream) {\n            localStream.getTracks().forEach((track)=>track.stop());\n            localVideoRef.current.srcObject = null;\n        }\n        // Stop and close the remote video stream\n        const remoteStream = remoteVideoRef.current ? remoteVideoRef.current.srcObject : null;\n        if (remoteStream) {\n            remoteStream.getTracks().forEach((track)=>track.stop());\n            remoteVideoRef.current.srcObject = null;\n        }\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"flex flex-col h-screen\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex-1 p-4 overflow-y-auto\",\n                children: messages.map((msg, index)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"mb-2\",\n                        children: msg\n                    }, index, false, {\n                        fileName: \"/home/sk/Desktop/omegle/frontend/app/chat/page.js\",\n                        lineNumber: 184,\n                        columnNumber: 11\n                    }, undefined))\n            }, void 0, false, {\n                fileName: \"/home/sk/Desktop/omegle/frontend/app/chat/page.js\",\n                lineNumber: 182,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex items-center p-4\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n                        type: \"text\",\n                        value: message,\n                        onChange: (e)=>setMessage(e.target.value),\n                        placeholder: \"Type your message...\",\n                        className: \"flex-1 p-2 mr-2 border rounded-md\"\n                    }, void 0, false, {\n                        fileName: \"/home/sk/Desktop/omegle/frontend/app/chat/page.js\",\n                        lineNumber: 190,\n                        columnNumber: 9\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                        onClick: handleSendMessage,\n                        className: \"p-2 bg-blue-500 text-white rounded-md\",\n                        children: \"Send\"\n                    }, void 0, false, {\n                        fileName: \"/home/sk/Desktop/omegle/frontend/app/chat/page.js\",\n                        lineNumber: 197,\n                        columnNumber: 9\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                        onClick: handleSkip,\n                        className: \"p-2 bg-red-500 text-white rounded-md\",\n                        children: \"Skip\"\n                    }, void 0, false, {\n                        fileName: \"/home/sk/Desktop/omegle/frontend/app/chat/page.js\",\n                        lineNumber: 200,\n                        columnNumber: 9\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/sk/Desktop/omegle/frontend/app/chat/page.js\",\n                lineNumber: 189,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"video\", {\n                        ref: localVideoRef,\n                        autoPlay: true,\n                        muted: true,\n                        className: \"w-1/2\"\n                    }, void 0, false, {\n                        fileName: \"/home/sk/Desktop/omegle/frontend/app/chat/page.js\",\n                        lineNumber: 206,\n                        columnNumber: 9\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"video\", {\n                        ref: remoteVideoRef,\n                        autoPlay: true,\n                        className: \"w-1/2\"\n                    }, void 0, false, {\n                        fileName: \"/home/sk/Desktop/omegle/frontend/app/chat/page.js\",\n                        lineNumber: 207,\n                        columnNumber: 9\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/sk/Desktop/omegle/frontend/app/chat/page.js\",\n                lineNumber: 204,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                className: \"text-center\",\n                children: [\n                    \"Online Users: \",\n                    onlineUsers\n                ]\n            }, void 0, true, {\n                fileName: \"/home/sk/Desktop/omegle/frontend/app/chat/page.js\",\n                lineNumber: 209,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"/home/sk/Desktop/omegle/frontend/app/chat/page.js\",\n        lineNumber: 181,\n        columnNumber: 5\n    }, undefined);\n};\n_s(Chat, \"OwCZpRpMW3fkQm+EaM4yhrcvmMw=\");\n_c = Chat;\n/* harmony default export */ __webpack_exports__[\"default\"] = (Chat);\nvar _c;\n$RefreshReg$(_c, \"Chat\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LGVBQWVHLE9BQU8sQ0FBQ2dCLFNBQVMsR0FBRztRQUNqRixJQUFJa0MsY0FBYztZQUNoQkEsYUFBYWhDLFNBQVMsR0FBR0MsT0FBTyxDQUFDLENBQUNDLFFBQVVBLE1BQU02QixJQUFJO1lBQ3REcEQsZUFBZUcsT0FBTyxDQUFDZ0IsU0FBUyxHQUFHO1FBQ3JDO0lBQ0Y7SUFFQSxxQkFDRSw4REFBQ21DO1FBQUlDLFdBQVU7OzBCQUNiLDhEQUFDRDtnQkFBSUMsV0FBVTswQkFDWm5FLFNBQVNvRSxHQUFHLENBQUMsQ0FBQ0MsS0FBS0Msc0JBQ2xCLDhEQUFDSjt3QkFBZ0JDLFdBQVU7a0NBQ3hCRTt1QkFET0M7Ozs7Ozs7Ozs7MEJBS2QsOERBQUNKO2dCQUFJQyxXQUFVOztrQ0FDYiw4REFBQ0k7d0JBQ0NDLE1BQUs7d0JBQ0xDLE9BQU92RTt3QkFDUHdFLFVBQVUsQ0FBQ0MsSUFBTXhFLFdBQVd3RSxFQUFFQyxNQUFNLENBQUNILEtBQUs7d0JBQzFDSSxhQUFZO3dCQUNaVixXQUFVOzs7Ozs7a0NBRVosOERBQUNXO3dCQUFPQyxTQUFTNUI7d0JBQW1CZ0IsV0FBVTtrQ0FBd0M7Ozs7OztrQ0FHdEYsOERBQUNXO3dCQUFPQyxTQUFTakU7d0JBQVlxRCxXQUFVO2tDQUF1Qzs7Ozs7Ozs7Ozs7OzBCQUloRiw4REFBQ0Q7O2tDQUVDLDhEQUFDckM7d0JBQU1tRCxLQUFLckU7d0JBQWVzRSxRQUFRO3dCQUFDQyxLQUFLO3dCQUFDZixXQUFVOzs7Ozs7a0NBQ3BELDhEQUFDdEM7d0JBQU1tRCxLQUFLcEU7d0JBQWdCcUUsUUFBUTt3QkFBQ2QsV0FBVTs7Ozs7Ozs7Ozs7OzBCQUVqRCw4REFBQ2dCO2dCQUFFaEIsV0FBVTs7b0JBQWM7b0JBQWUvRDs7Ozs7Ozs7Ozs7OztBQUdoRDtHQS9NTUw7S0FBQUE7QUFpTk4sK0RBQWVBLElBQUlBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vYXBwL2NoYXQvcGFnZS5qcz9iMzY4Il0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGNsaWVudFwiXG5pbXBvcnQgeyB1c2VSZWYsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XG5cbmNvbnN0IENoYXQgPSAoKSA9PiB7XG4gIGNvbnN0IFttZXNzYWdlcywgc2V0TWVzc2FnZXNdID0gdXNlU3RhdGUoW10pO1xuICBjb25zdCBbbWVzc2FnZSwgc2V0TWVzc2FnZV0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtvbmxpbmVVc2Vycywgc2V0T25saW5lVXNlcnNdID0gdXNlU3RhdGUoMCk7XG4gIGNvbnN0IFt0YXJnZXRVc2VySWQsIHNldFRhcmdldFVzZXJJZF0gPSB1c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW3BhcnRuZXJVc2VySWQsIHNldFBhcnRuZXJVc2VySWRdID0gdXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IHNvY2tldFJlZiA9IHVzZVJlZigpO1xuXG4gIGNvbnN0IGxvY2FsVmlkZW9SZWYgPSB1c2VSZWYoKTtcbiAgY29uc3QgcmVtb3RlVmlkZW9SZWYgPSB1c2VSZWYoKTtcbiAgY29uc3QgcGVlckNvbm5lY3Rpb25SZWYgPSB1c2VSZWYoKTtcblxuICBjb25zdCBoYW5kbGVTa2lwID0gKCkgPT4ge1xuICAgIHNvY2tldFJlZi5jdXJyZW50LmVtaXQoJ3NraXAnLCB0YXJnZXRVc2VySWQpO1xuICAgIHNldFRhcmdldFVzZXJJZChudWxsKTtcbiAgfTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIFNldCB1cCBzb2NrZXQgY29ubmVjdGlvblxuICAgIHNvY2tldFJlZi5jdXJyZW50ID0gaW8oJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMCcpO1xuXG4gICAgc29ja2V0UmVmLmN1cnJlbnQub24oJ2Nvbm5lY3RlZCcsICh7IHVzZXJJZCwgcGFydG5lclVzZXJJZCB9KSA9PiB7XG4gICAgICBzZXRUYXJnZXRVc2VySWQodXNlcklkKTtcbiAgICAgIHNldFBhcnRuZXJVc2VySWQocGFydG5lclVzZXJJZCk7XG4gICAgICBzZXR1cFZpZGVvQ2FsbCgpOyAvLyBJbml0aWFsaXplIHZpZGVvIGNhbGwgc2V0dXAgaGVyZVxuICAgIH0pO1xuXG4gICAgLy8gRXZlbnQgbGlzdGVuZXIgZm9yIGluY29taW5nIG1lc3NhZ2VzXG4gICAgc29ja2V0UmVmLmN1cnJlbnQub24oJ21lc3NhZ2UnLCAoeyB1c2VySWQsIG1lc3NhZ2UgfSkgPT4ge1xuICAgICAgc2V0TWVzc2FnZXMoKHByZXZNZXNzYWdlcykgPT4gWy4uLnByZXZNZXNzYWdlcywgYCR7dXNlcklkfTogJHttZXNzYWdlfWBdKTtcbiAgICB9KTtcblxuICAgIC8vIEV2ZW50IGxpc3RlbmVyIGZvciBvbmxpbmUgdXNlciBjb3VudFxuICAgIHNvY2tldFJlZi5jdXJyZW50Lm9uKCdvbmxpbmVVc2VycycsIChjb3VudCkgPT4ge1xuICAgICAgc2V0T25saW5lVXNlcnMoY291bnQpO1xuICAgIH0pO1xuXG4gICAgLy8gRXZlbnQgbGlzdGVuZXIgZm9yIGNvbm5lY3RlZCB1c2Vyc1xuICAgIHNvY2tldFJlZi5jdXJyZW50Lm9uKCdjb25uZWN0ZWRVc2VycycsICh1c2VycykgPT4ge1xuICAgICAgLy8gVXBkYXRlIG9ubGluZSB1c2VycyBjb3VudFxuICAgICAgc2V0T25saW5lVXNlcnModXNlcnMubGVuZ3RoKTtcblxuICAgICAgLy8gU2tpcCB0byB0aGUgbmV4dCB1c2VyIGlmIHRoZSBjdXJyZW50IHVzZXIgZGlzY29ubmVjdHNcbiAgICAgIGlmICghdXNlcnMuaW5jbHVkZXModGFyZ2V0VXNlcklkKSkge1xuICAgICAgICBoYW5kbGVTa2lwKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzb2NrZXRSZWYuY3VycmVudC5vbignc2tpcCcsICgpID0+IHtcbiAgICAgIC8vIEhhbmRsZSBza2lwIHJlc3BvbnNlIChpZiBuZWVkZWQpXG4gICAgfSk7XG5cbiAgICAvLyBTZXQgdXAgdmlkZW8gY2FsbFxuICAgIGNvbnN0IHNldHVwVmlkZW9DYWxsID0gYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gRXhhbXBsZTogR2V0IHVzZXIgbWVkaWFcbiAgICAgIGNvbnN0IHN0cmVhbSA9IGF3YWl0IG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHsgdmlkZW86IHRydWUsIGF1ZGlvOiB0cnVlIH0pO1xuICAgICAgbG9jYWxWaWRlb1JlZi5jdXJyZW50LnNyY09iamVjdCA9IHN0cmVhbTtcblxuICAgICAgLy8gRXhhbXBsZTogQ3JlYXRlIHBlZXIgY29ubmVjdGlvblxuICAgICAgcGVlckNvbm5lY3Rpb25SZWYuY3VycmVudCA9IG5ldyBSVENQZWVyQ29ubmVjdGlvbigpO1xuXG4gICAgICAvLyBFeGFtcGxlOiBBZGQgdHJhY2tzIHRvIHBlZXIgY29ubmVjdGlvblxuICAgICAgc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2goKHRyYWNrKSA9PiB7XG4gICAgICAgIHBlZXJDb25uZWN0aW9uUmVmLmN1cnJlbnQuYWRkVHJhY2sodHJhY2ssIHN0cmVhbSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gU2V0IHVwIElDRSBjYW5kaWRhdGVzIGFuZCBvZmZlci9hbnN3ZXIgaGFuZGxpbmdcbiAgICAgIHNldHVwSUNFSGFuZGxpbmcoKTtcblxuICAgICAgLy8gRXhhbXBsZTogU2V0IHJlbW90ZSB2aWRlbyBlbGVtZW50IHNvdXJjZVxuICAgICAgcGVlckNvbm5lY3Rpb25SZWYuY3VycmVudC5vbnRyYWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChldmVudC5zdHJlYW1zWzBdLmlkID09PSB0YXJnZXRVc2VySWQpIHtcbiAgICAgICAgICBsb2NhbFZpZGVvUmVmLmN1cnJlbnQuc3JjT2JqZWN0ID0gZXZlbnQuc3RyZWFtc1swXTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5zdHJlYW1zWzBdLmlkID09PSBwYXJ0bmVyVXNlcklkKSB7XG4gICAgICAgICAgcmVtb3RlVmlkZW9SZWYuY3VycmVudC5zcmNPYmplY3QgPSBldmVudC5zdHJlYW1zWzBdO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB0cnkge1xuICAgICAgICAvLyBFeGFtcGxlOiBDcmVhdGUgYW5kIHNlbmQgb2ZmZXJcbiAgICAgICAgY29uc3Qgb2ZmZXIgPSBhd2FpdCBwZWVyQ29ubmVjdGlvblJlZi5jdXJyZW50LmNyZWF0ZU9mZmVyKCk7XG5cbiAgICAgICAgLy8gQ2hlY2sgc2lnbmFsaW5nIHN0YXRlIGJlZm9yZSBzZXR0aW5nIGxvY2FsIGRlc2NyaXB0aW9uXG4gICAgICAgIGlmIChwZWVyQ29ubmVjdGlvblJlZi5jdXJyZW50LnNpZ25hbGluZ1N0YXRlID09PSAnc3RhYmxlJykge1xuICAgICAgICAgIGF3YWl0IHBlZXJDb25uZWN0aW9uUmVmLmN1cnJlbnQuc2V0TG9jYWxEZXNjcmlwdGlvbihvZmZlcik7XG4gICAgICAgICAgLy8gVXNlIHRhcmdldFVzZXJJZCBmcm9tIHN0YXRlXG4gICAgICAgICAgc29ja2V0UmVmLmN1cnJlbnQuZW1pdCgnb2ZmZXInLCBvZmZlciwgdGFyZ2V0VXNlcklkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ1NpZ25hbGluZyBzdGF0ZSBpcyBub3Qgc3RhYmxlLiBPZmZlciBub3Qgc2VudC4nKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgYWNjZXNzaW5nIGNhbWVyYSBhbmQvb3IgbWljcm9waG9uZTonLCBlcnJvcik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNldHVwVmlkZW9DYWxsKCk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgc29ja2V0UmVmLmN1cnJlbnQuZGlzY29ubmVjdCgpO1xuICAgICAgY2xlYW51cFZpZGVvQ2FsbCgpO1xuICAgIH07XG4gIH0sIFt0YXJnZXRVc2VySWQsIHBhcnRuZXJVc2VySWRdKTtcblxuICBjb25zdCBoYW5kbGVTZW5kTWVzc2FnZSA9ICgpID0+IHtcbiAgICBpZiAobWVzc2FnZS50cmltKCkgIT09ICcnKSB7XG4gICAgICBzb2NrZXRSZWYuY3VycmVudC5lbWl0KCdtZXNzYWdlJywgbWVzc2FnZSk7XG4gICAgICBzZXRNZXNzYWdlKCcnKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gU2V0IHVwIElDRSBjYW5kaWRhdGVzIGFuZCBvZmZlci9hbnN3ZXIgaGFuZGxpbmdcbiAgY29uc3Qgc2V0dXBJQ0VIYW5kbGluZyA9ICgpID0+IHtcbiAgICAvLyBJbXBsZW1lbnQgSUNFIGNhbmRpZGF0ZSBoYW5kbGluZ1xuICAgIHBlZXJDb25uZWN0aW9uUmVmLmN1cnJlbnQub25pY2VjYW5kaWRhdGUgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5jYW5kaWRhdGUpIHtcbiAgICAgICAgLy8gU2VuZCB0aGUgSUNFIGNhbmRpZGF0ZSB0byB0aGUgb3RoZXIgdXNlclxuICAgICAgICBzb2NrZXRSZWYuY3VycmVudC5lbWl0KCdpY2UtY2FuZGlkYXRlJywgZXZlbnQuY2FuZGlkYXRlLCB0YXJnZXRVc2VySWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBJbXBsZW1lbnQgb2ZmZXIvYW5zd2VyIGhhbmRsaW5nXG4gICAgc29ja2V0UmVmLmN1cnJlbnQub24oJ29mZmVyJywgYXN5bmMgKG9mZmVyLCBzZW5kZXJVc2VySWQpID0+IHtcbiAgICAgIC8vIEhhbmRsZSBpbmNvbWluZyBvZmZlclxuICAgICAgLy8gLi4uXG5cbiAgICAgIC8vIEV4YW1wbGU6IFNldCByZW1vdGUgZGVzY3JpcHRpb25cbiAgICAgIGF3YWl0IHBlZXJDb25uZWN0aW9uUmVmLmN1cnJlbnQuc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihvZmZlcikpO1xuXG4gICAgICAvLyBFeGFtcGxlOiBDcmVhdGUgYW5kIHNlbmQgYW5zd2VyXG4gICAgICBjb25zdCBhbnN3ZXIgPSBhd2FpdCBwZWVyQ29ubmVjdGlvblJlZi5jdXJyZW50LmNyZWF0ZUFuc3dlcigpO1xuICAgICAgYXdhaXQgcGVlckNvbm5lY3Rpb25SZWYuY3VycmVudC5zZXRMb2NhbERlc2NyaXB0aW9uKGFuc3dlcik7XG4gICAgICBzb2NrZXRSZWYuY3VycmVudC5lbWl0KCdhbnN3ZXInLCBhbnN3ZXIsIHNlbmRlclVzZXJJZCk7XG4gICAgfSk7XG5cbiAgICBzb2NrZXRSZWYuY3VycmVudC5vbignYW5zd2VyJywgYXN5bmMgKGFuc3dlcikgPT4ge1xuICAgICAgLy8gSGFuZGxlIGluY29taW5nIGFuc3dlclxuICAgICAgLy8gLi4uXG5cbiAgICAgIC8vIEV4YW1wbGU6IFNldCByZW1vdGUgZGVzY3JpcHRpb25cbiAgICAgIGF3YWl0IHBlZXJDb25uZWN0aW9uUmVmLmN1cnJlbnQuc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihhbnN3ZXIpKTtcbiAgICB9KTtcblxuICAgIHNvY2tldFJlZi5jdXJyZW50Lm9uKCdpY2UtY2FuZGlkYXRlJywgYXN5bmMgKGNhbmRpZGF0ZSkgPT4ge1xuICAgICAgLy8gSGFuZGxlIGluY29taW5nIElDRSBjYW5kaWRhdGVcbiAgICAgIC8vIC4uLlxuXG4gICAgICAvLyBFeGFtcGxlOiBBZGQgdGhlIElDRSBjYW5kaWRhdGUgdG8gdGhlIHBlZXIgY29ubmVjdGlvblxuICAgICAgYXdhaXQgcGVlckNvbm5lY3Rpb25SZWYuY3VycmVudC5hZGRJY2VDYW5kaWRhdGUobmV3IFJUQ0ljZUNhbmRpZGF0ZShjYW5kaWRhdGUpKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBJbXBsZW1lbnQgY2xlYW51cCBsb2dpYyBmb3IgdmlkZW8gY2FsbFxuICBjb25zdCBjbGVhbnVwVmlkZW9DYWxsID0gKCkgPT4ge1xuICAgIC8vIENsb3NlIHRoZSBwZWVyIGNvbm5lY3Rpb25cbiAgICBpZiAocGVlckNvbm5lY3Rpb25SZWYuY3VycmVudCkge1xuICAgICAgcGVlckNvbm5lY3Rpb25SZWYuY3VycmVudC5jbG9zZSgpO1xuICAgICAgcGVlckNvbm5lY3Rpb25SZWYuY3VycmVudCA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gU3RvcCBhbmQgY2xvc2UgdGhlIGxvY2FsIHZpZGVvIHN0cmVhbVxuICAgIGNvbnN0IGxvY2FsU3RyZWFtID0gbG9jYWxWaWRlb1JlZi5jdXJyZW50ID8gbG9jYWxWaWRlb1JlZi5jdXJyZW50LnNyY09iamVjdCA6IG51bGw7XG5cbiAgICBpZiAobG9jYWxTdHJlYW0pIHtcbiAgICAgIGxvY2FsU3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2goKHRyYWNrKSA9PiB0cmFjay5zdG9wKCkpO1xuICAgICAgbG9jYWxWaWRlb1JlZi5jdXJyZW50LnNyY09iamVjdCA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gU3RvcCBhbmQgY2xvc2UgdGhlIHJlbW90ZSB2aWRlbyBzdHJlYW1cbiAgICBjb25zdCByZW1vdGVTdHJlYW0gPSByZW1vdGVWaWRlb1JlZi5jdXJyZW50ID8gcmVtb3RlVmlkZW9SZWYuY3VycmVudC5zcmNPYmplY3QgOiBudWxsO1xuICAgIGlmIChyZW1vdGVTdHJlYW0pIHtcbiAgICAgIHJlbW90ZVN0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKCh0cmFjaykgPT4gdHJhY2suc3RvcCgpKTtcbiAgICAgIHJlbW90ZVZpZGVvUmVmLmN1cnJlbnQuc3JjT2JqZWN0ID0gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaC1zY3JlZW5cIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIHAtNCBvdmVyZmxvdy15LWF1dG9cIj5cbiAgICAgICAge21lc3NhZ2VzLm1hcCgobXNnLCBpbmRleCkgPT4gKFxuICAgICAgICAgIDxkaXYga2V5PXtpbmRleH0gY2xhc3NOYW1lPVwibWItMlwiPlxuICAgICAgICAgICAge21zZ31cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgcC00XCI+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICB2YWx1ZT17bWVzc2FnZX1cbiAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldE1lc3NhZ2UoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVHlwZSB5b3VyIG1lc3NhZ2UuLi5cIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXgtMSBwLTIgbXItMiBib3JkZXIgcm91bmRlZC1tZFwiXG4gICAgICAgIC8+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17aGFuZGxlU2VuZE1lc3NhZ2V9IGNsYXNzTmFtZT1cInAtMiBiZy1ibHVlLTUwMCB0ZXh0LXdoaXRlIHJvdW5kZWQtbWRcIj5cbiAgICAgICAgICBTZW5kXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e2hhbmRsZVNraXB9IGNsYXNzTmFtZT1cInAtMiBiZy1yZWQtNTAwIHRleHQtd2hpdGUgcm91bmRlZC1tZFwiPlxuICAgICAgICAgIFNraXBcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXY+XG4gICAgICAgIHsvKiBBZGQgdmlkZW8gY2FsbCBlbGVtZW50cyBoZXJlICovfVxuICAgICAgICA8dmlkZW8gcmVmPXtsb2NhbFZpZGVvUmVmfSBhdXRvUGxheSBtdXRlZCBjbGFzc05hbWU9XCJ3LTEvMlwiIC8+XG4gICAgICAgIDx2aWRlbyByZWY9e3JlbW90ZVZpZGVvUmVmfSBhdXRvUGxheSBjbGFzc05hbWU9XCJ3LTEvMlwiIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+T25saW5lIFVzZXJzOiB7b25saW5lVXNlcnN9PC9wPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hhdDtcblxuIl0sIm5hbWVzIjpbInVzZVJlZiIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiaW8iLCJDaGF0IiwibWVzc2FnZXMiLCJzZXRNZXNzYWdlcyIsIm1lc3NhZ2UiLCJzZXRNZXNzYWdlIiwib25saW5lVXNlcnMiLCJzZXRPbmxpbmVVc2VycyIsInRhcmdldFVzZXJJZCIsInNldFRhcmdldFVzZXJJZCIsInBhcnRuZXJVc2VySWQiLCJzZXRQYXJ0bmVyVXNlcklkIiwic29ja2V0UmVmIiwibG9jYWxWaWRlb1JlZiIsInJlbW90ZVZpZGVvUmVmIiwicGVlckNvbm5lY3Rpb25SZWYiLCJoYW5kbGVTa2lwIiwiY3VycmVudCIsImVtaXQiLCJvbiIsInVzZXJJZCIsInNldHVwVmlkZW9DYWxsIiwicHJldk1lc3NhZ2VzIiwiY291bnQiLCJ1c2VycyIsImxlbmd0aCIsImluY2x1ZGVzIiwic3RyZWFtIiwibmF2aWdhdG9yIiwibWVkaWFEZXZpY2VzIiwiZ2V0VXNlck1lZGlhIiwidmlkZW8iLCJhdWRpbyIsInNyY09iamVjdCIsIlJUQ1BlZXJDb25uZWN0aW9uIiwiZ2V0VHJhY2tzIiwiZm9yRWFjaCIsInRyYWNrIiwiYWRkVHJhY2siLCJzZXR1cElDRUhhbmRsaW5nIiwib250cmFjayIsImV2ZW50Iiwic3RyZWFtcyIsImlkIiwib2ZmZXIiLCJjcmVhdGVPZmZlciIsInNpZ25hbGluZ1N0YXRlIiwic2V0TG9jYWxEZXNjcmlwdGlvbiIsImNvbnNvbGUiLCJ3YXJuIiwiZXJyb3IiLCJkaXNjb25uZWN0IiwiY2xlYW51cFZpZGVvQ2FsbCIsImhhbmRsZVNlbmRNZXNzYWdlIiwidHJpbSIsIm9uaWNlY2FuZGlkYXRlIiwiY2FuZGlkYXRlIiwic2VuZGVyVXNlcklkIiwic2V0UmVtb3RlRGVzY3JpcHRpb24iLCJSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJhbnN3ZXIiLCJjcmVhdGVBbnN3ZXIiLCJhZGRJY2VDYW5kaWRhdGUiLCJSVENJY2VDYW5kaWRhdGUiLCJjbG9zZSIsImxvY2FsU3RyZWFtIiwic3RvcCIsInJlbW90ZVN0cmVhbSIsImRpdiIsImNsYXNzTmFtZSIsIm1hcCIsIm1zZyIsImluZGV4IiwiaW5wdXQiLCJ0eXBlIiwidmFsdWUiLCJvbkNoYW5nZSIsImUiLCJ0YXJnZXQiLCJwbGFjZWhvbGRlciIsImJ1dHRvbiIsIm9uQ2xpY2siLCJyZWYiLCJhdXRvUGxheSIsIm11dGVkIiwicCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./app/chat/page.js\n"));

/***/ })

});