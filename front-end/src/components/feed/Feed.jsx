import Posts from "../Posts/Posts";
import Share from "../share/Share";
import "./feed.scss";
import { useEffect, useState } from "react";
import axios from "axios";
export default function Feed({ user }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get(`/posts/timeline/${user?._id}`);
      setPosts(
        res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    };
    fetchPosts();
  }, [user?._id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {posts.map((p) => (
          <Posts key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
