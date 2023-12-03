"use client"
import { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

// Chat component
const Chat = () => {
  // State and refs initialization
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [targetUserId, setTargetUserId] = useState(null);
  const [partnerUserId, setPartnerUserId] = useState(null);
  const socketRef = useRef();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnectionRef = useRef();

  // Function to handle skipping to the next user
  const handleSkip = () => {
    socketRef.current.emit('skip', targetUserId);
    setTargetUserId(null);
  };

  // Function to send a message
  const handleSendMessage = () => {
    if (message.trim() !== '') {
      socketRef.current.emit('message', message);
      setMessage('');
    }
  };

  // Function to set up ICE candidates and offer/answer handling
  const setupICEHandling = () => {
    // Implement ICE candidate handling
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        // Send the ICE candidate to the other user
        socketRef.current.emit('ice-candidate', event.candidate, targetUserId);
      }
    };

    // Implement offer/answer handling
    socketRef.current.on('offer', async (offer, senderUserId) => {
      // Handle incoming offer
      // ...

      // Example: Set remote description
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));

      // Example: Create and send answer
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socketRef.current.emit('answer', answer, senderUserId);
    });

    socketRef.current.on('answer', async (answer) => {
      // Handle incoming answer
      // ...

      // Example: Set remote description
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socketRef.current.on('ice-candidate', async (candidate) => {
      // Handle incoming ICE candidate
      // ...

      // Example: Add the ICE candidate to the peer connection
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    });
  };

  // Function to clean up video call
  const cleanupVideoCall = () => {
    // Close the peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Stop and close the local video stream
    const localStream = localVideoRef.current ? localVideoRef.current.srcObject : null;
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }

    // Stop and close the remote video stream
    const remoteStream = remoteVideoRef.current ? remoteVideoRef.current.srcObject : null;
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
  };

  // Function to set up video call
  const setupVideoCall = async () => {
    // Example: Get user media
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;

    // Example: Create peer connection
    peerConnectionRef.current = new RTCPeerConnection();

    // Example: Add tracks to peer connection
    stream.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, stream);
    });

    // Set up ICE candidates and offer/answer handling
    setupICEHandling();

    // Example: Set remote video element source
    peerConnectionRef.current.ontrack = (event) => {
      if (event.streams[0].id === targetUserId) {
        localVideoRef.current.srcObject = event.streams[0];
      } else if (event.streams[0].id === partnerUserId) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Additional logic to handle partner disconnect
    socketRef.current.on('partnerDisconnected', () => {
      cleanupVideoCall();
      // Additional logic to handle partner disconnection
    });

    try {
      // Example: Create and send offer
      const offer = await peerConnectionRef.current.createOffer();

      // Check signaling state before setting local description
      if (peerConnectionRef.current.signalingState === 'stable') {
        await peerConnectionRef.current.setLocalDescription(offer);
        // Use targetUserId from state
        socketRef.current.emit('offer', offer, targetUserId);
      } else {
        console.warn('Signaling state is not stable. Offer not sent.');
      }
    } catch (error) {
      console.error('Error accessing camera and/or microphone:', error);
    }
  };

  // useEffect to set up socket connection
  useEffect(() => {
    socketRef.current = io('https://sk-omegle-backend.onrender.com');

    socketRef.current.on('connected', ({ userId, partnerUserId }) => {
      setTargetUserId(userId);
      setPartnerUserId(partnerUserId);
      setupVideoCall(); // Initialize video call setup here
    });

    socketRef.current.on('message', ({ userId, message }) => {
      setMessages((prevMessages) => [...prevMessages, `${userId}: ${message}`]);
    });

    socketRef.current.on('onlineUsers', (count) => {
      setOnlineUsers(count);
    });

    socketRef.current.on('connectedUsers', (users) => {
      setOnlineUsers(users.length);
      if (!users.includes(targetUserId)) {
        handleSkip();
      }
    });

    socketRef.current.on('skip', () => {
      // Handle skip response (if needed)
    });

    return () => {
      socketRef.current.disconnect();
      cleanupVideoCall();
    };
  }, []); // Remove dependencies to avoid re-running useEffect

  // Return the JSX structure
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex items-center p-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 mr-2 border rounded-md"
        />
        <button onClick={handleSendMessage} className="p-2 bg-blue-500 text-white rounded-md">
          Send
        </button>
        <button onClick={handleSkip} className="p-2 bg-red-500 text-white rounded-md">
          Skip
        </button>
      </div>
      <div>
        {/* Add video call elements here */}
        <video ref={localVideoRef} autoPlay muted className="w-1/2" />
        <video ref={remoteVideoRef} autoPlay className="w-1/2" />
      </div>
      <p className="text-center">Online Users: {onlineUsers}</p>
    </div>
  );
};

export default Chat;
