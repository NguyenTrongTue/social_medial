import { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./Comment.module.scss";
import { ArrowDownIcon } from "../icon/Icon";
import Modal from "../Modal/Modal";
import Post from "../post/Post";
import UserComment from "../userComment/UserComment";
import { useSelector } from "react-redux";
const cx = classNames.bind(styles);

export default function Comment({ post, setOpenComment }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    const getComments = async () => {
      const res = await axios.get(`/comments/${post?._id}`);
      setComments(
        res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    };
    getComments();
  }, [post]);

  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get(`/users?userId=${post?.userId}`);
      setUser(res.data);
    };
    getUser();
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(`/comments`, {
      text: comment,
      postId: post?._id,
    });
    setComments([res.data, ...comments]);
    setComment("");
  };

  return (
    <Modal setIsOpen={setOpenComment} headerTitle={user?.username}>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <Post post={post} noPost={true} countCommnets={comments.length} />
          <div className={cx("comments")}>
            {comments.map((comment) => (
              <UserComment
                key={comment._id}
                comment={comment}
                setComments={setComments}
              />
            ))}
          </div>
        </div>
        <div className={cx("bottom")}>
          <div className={cx("avatar")}>
            <img src={PF + `person/${currentUser?.avatar}`} alt="avatar" />
            <div className={cx("arrowIcon")}>
              <ArrowDownIcon height={12} width={12} />
            </div>
          </div>
          <div className={cx("input")}>
            <input
              ref={inputRef}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              type="text"
              placeholder="Write a comment..."
            />
            <div className={cx("sendIcon")} onClick={handleSubmit}>
              <SendIcon />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
