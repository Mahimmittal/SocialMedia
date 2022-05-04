import React from "react";
import "./message.css";

export default function Message({ own }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://images.pexels.com/photos/8435232/pexels-photo-8435232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt=""
        />
        <p className="messageText">Hello this is a message</p>
      </div>
      <div className="messageBottom">1hour ago</div>
    </div>
  );
}
