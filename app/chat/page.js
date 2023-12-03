"use client";
import { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [targetUserId, setTargetUserId] = useState(null);
  const [partnerUserId, setPartnerUserId] = useState(null);
  const socketRef = useRef();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnectionRef = useRef();

  const handleSkip = () => {
    socketRef.current.emit('skip', targetUserId);
    setTargetUserId(null);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      socketRef.current.emit('message', message);
      setMessage('');
    }
  };

  const setupICEHandling = () => {
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', event.candidate, partnerUserId);
      }
    };
  
    socketRef.current.on('offer', async (offer, senderUserId) => {
      if (peerConnectionRef.current.signalingState !== 'stable') return;
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socketRef.current.emit('answer', answer, senderUserId);
    });
  
    socketRef.current.on('answer', async (answer) => {
      if (peerConnectionRef.current.signalingState !== 'stable') return;
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });
  
    socketRef.current.on('ice-candidate', async (candidate) => {
      if (candidate) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
  };

  const cleanupVideoCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    const localStream = localVideoRef.current ? localVideoRef.current.srcObject : null;
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }

    const remoteStream = remoteVideoRef.current ? remoteVideoRef.current.srcObject : null;
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
  };

  
  
  const setupVideoCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;
  
    peerConnectionRef.current = new RTCPeerConnection();
  
    stream.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, stream);
    });
  
    setupICEHandling();
  
    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
        remoteVideoRef.current.srcObject = new MediaStream(event.track);
      }
    };
  
    socketRef.current.on('partnerDisconnected', () => {
      cleanupVideoCall();
    });
  
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    socketRef.current.emit('offer', offer, partnerUserId);
  };
  
  

  useEffect(() => {
    socketRef.current = io('http://localhost:8000');

    socketRef.current.on('connected', ({ userId, partnerUserId }) => {
      setTargetUserId(userId);
      setPartnerUserId(partnerUserId);
      setupVideoCall();
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
      // Handle skip response if needed
    });

    return () => {
      socketRef.current.disconnect();
      cleanupVideoCall();
    };
  }, []); 

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
        <video ref={localVideoRef} autoPlay muted className="w-1/2" />
        <video ref={remoteVideoRef} autoPlay className="w-1/2" />
      </div>
      <p className="text-center">Online Users: {onlineUsers}</p>
    </div>
  );
};

export default Chat;
