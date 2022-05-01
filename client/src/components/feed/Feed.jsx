import { useContext, useEffect, useState } from "react";
import "./feed.css";
import Share from "../Share/Share";
import Post from "../post/Post";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get("/posts/profile/" + username, {
            baseURL: "http://localhost:8000/api",
          })
        : await axios.get("posts/timeline/" + user._id, {
            baseURL: "http://localhost:8000/api",
          });
      setPosts(res.data);
    };
    fetchPosts();
  }, [username, user._id]);
  return (
    <div className="feed">
      <Share />
      {posts.map((p) => (
        <Post key={p._id} post={p} />
      ))}
    </div>
  );
}
