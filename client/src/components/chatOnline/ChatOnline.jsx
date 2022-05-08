import axios from "axios";
import React, { useEffect, useState } from "react";
import "./chatOnline.css";
export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/users/friends/" + currentId, {
        baseURL: "http://localhost:8000/api/",
      });
      setFriends(res.data);
    };
    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [onlineFriends, friends]);
  const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `/conversations/find/${currentId}/${user._id}`,
        {
          baseURL: "http://localhost:8000/api/",
        }
      );
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div
          className="chatOnlineFriend"
          onClick={() => {
            handleClick(o);
          }}
        >
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                o && o.profilePicture
                  ? PF + o.profilePicture
                  : PF + "person/noAvatar.png"
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineText">{o.username}</span>
        </div>
      ))}
    </div>
  );
}
