import "./conversation.css";
import React from "react";

export default function Conversation() {
  return (
    <div className="conversation">
      <img
        src="https://images.pexels.com/photos/8435232/pexels-photo-8435232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt=""
        className="conversationImg"
      />
      <span className="conversationName">John Doe</span>
    </div>
  );
}
