import React, { useContext, useEffect, useRef, useState } from "react";
import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config.js";
import { io } from "socket.io-client";
export default function Messenger() {
  const { user } = useContext(AuthContext);

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();

  const scrollRef = useRef();
  useEffect(() => {
    socket.current = io("wss://mahimsocialapp.herokuapp.com/");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);
  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat &&
      currentChat.members.includes(arrivalMessage.sender)
    ) {
      console.log("Update");
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);
  useEffect(() => {
    if (user) {
      socket.current.emit("addUser", user._id);
      socket.current.on("getUsers", (users) => {
        setOnlineUsers(
          user.followings.filter((f) => users.some((u) => u.userId === f))
        );
      });
    }
  }, [user]);
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axiosInstance.get("/conversations/" + user._id);

        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (user) getConversations();
  }, [user]);
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axiosInstance.get("/messages/" + currentChat._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (currentChat) getMessages();
  }, [currentChat]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });
    try {
      const res = await axiosInstance.post("/messages/", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              placeholder="Search For Friends"
              className="chatMenuInput"
            />

            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} key={c._id} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message
                        message={m}
                        own={m.sender === user._id}
                        key={m._id}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                    placeholder="Write Something..."
                    className="chatMessageInput"
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a Conversation to start a chat
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
}
