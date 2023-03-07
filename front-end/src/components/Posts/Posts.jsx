import React, { useState } from "react";
import Comment from "../Comment/Comment";
import Post from "../post/Post";

const Posts = ({ post }) => {
  const [openComment, setOpenComment] = useState(false);

  return (
    <>
      <Post post={post} setOpenComment={setOpenComment} />
      {openComment && <Comment post={post} setOpenComment={setOpenComment} />}
    </>
  );
};

export default Posts;
