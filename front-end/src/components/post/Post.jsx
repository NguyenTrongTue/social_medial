import { useState, useEffect, useRef, useContext } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import HeadlessTippy from "@tippyjs/react/headless";
import Tippy from "@tippyjs/react";
import classNames from "classnames/bind";

import Video from "../video/Video";
import "tippy.js/dist/tippy.css";
import { OptionIcon } from "../icon/Icon";
import formatTime from "../../utils/formatDate";
import styles from "./Post.module.scss";
import { SocketContext } from "../sockerProvider/SocketProvider";

const cx = classNames.bind(styles);

export default function Post({
  post,
  setOpenComment,
  noPost = false,
  countCommnets,
}) {
  const { currentUser } = useSelector((state) => state.user);
  const [isLiked, setIsLiked] = useState(false);
  const [visible, setVisible] = useState(false);
  const [actionType, setActionType] = useState("");
  const [likeText, setLikeText] = useState("0");
  const [lastAction, setLastAction] = useState("");
  const [comments, setComments] = useState([]);
  const [like, setLike] = useState(0);
  const [user, setUser] = useState(null);
  const isFetchData = useRef();
  const socket = useContext(SocketContext);

  useEffect(() => {
    isFetchData.current = post?.likes.some(
      (like) => like.userId === currentUser?._id
    );
  }, [currentUser, post]);

  useEffect(() => {
    const likeCurrent = post.likes.find(
      (like) => like.userId === currentUser?._id
    );
    setLike(post.likes.length);
    if (!likeCurrent) {
      return;
    } else {
      setIsLiked(true);
      setActionType(likeCurrent.action);
      setLastAction(likeCurrent.action);
    }
  }, [currentUser, post]);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get(`/users?userId=${post?.userId}`);
      setUser(res.data);
    };
    getUser();
  }, [post?.userId]);
  useEffect(() => {
    if (isLiked) {
      setLike((like) => like + 1);
    } else {
      setLike((like) => {
        if (like === 0) {
          return like;
        } else {
          return like - 1;
        }
      });
    }
  }, [isLiked]);

  useEffect(() => {
    const getComments = async () => {
      const res = await axios.get(`/comments/${post?._id}`);
      setComments(res.data);
    };
    getComments();
  }, [post]);

  const likeHandler = async () => {
    await axios.put(`/posts/${post?._id}/like`, {
      userId: currentUser?._id,
      action: "like",
    });
  };

  const handleClickAction = async (action) => {
    setActionType(action);
    setIsLiked(true);
    setVisible(false);

    socket.emit("sendNotification", {
      senderId: currentUser?._id,
      receiverId: post?.userId,
      type: 1,
    });

    if (action === lastAction) {
      return;
    } else {
      if (!isFetchData.current) {
        await axios.put(`/posts/${post?._id}/like`, {
          userId: currentUser?._id,
          action,
        });
        setLastAction(action);
        isFetchData.current = true;
      } else {
        await axios.put(`/posts/${post?._id}/like/change`, {
          userId: currentUser?._id,
          action,
        });
        setLastAction(action);
      }
    }
  };

  useEffect(() => {
    const check = post.likes.some((like) => like.userId === currentUser?._id);
    if (like === 0) {
      setLikeText("0");
    } else if (like === 1) {
      setLikeText(isLiked ? "You" : "1");
    } else {
      setLikeText(
        isLiked && check
          ? `You and ${(like - 1).toString()} ${
              like === 2 ? "other" : "others"
            }`
          : `You and ${like.toString()} others`
      );
    }
  }, [like, post, currentUser, isLiked]);

  return (
    <div className={cx("post", noPost && "noPost")}>
      <div className={cx("header")}>
        <div className={cx("headerLeft")}>
          <Link to={`/profile/${user?.username}`} className={cx("avatar")}>
            <img src={PF + `person/${user?.avatar}`} alt="" />
          </Link>
          <div className={cx("user")}>
            <Link to={`/profile/${user?.username}`}>
              <span className={cx("username")}>{user?.username}</span>
            </Link>
            <span className={cx("postDate")}>{formatTime(post.createdAt)}</span>
          </div>
        </div>
        <div className={cx("headerRight")}>
          <div className={cx("headerIcon")}>
            <OptionIcon />
          </div>
          {!noPost && (
            <div className={cx("headerIcon")}>
              <i data-visualcompletion="css-img" className={"icon-2 close"}></i>
            </div>
          )}
        </div>
      </div>
      <div className={cx("postCenter")}>
        <p className={cx("postText")}>{post?.desc}</p>
        {post.video ? (
          <Video src={post?.video} />
        ) : (
          <img className={cx("postImg")} src={PF + `post/${post.img}`} alt="" />
        )}
      </div>
      <div className={cx("postBottom")}>
        <div className={cx("postBottomLeft")}>
          <img className={cx("likeIcon")} src={PF + "like.png"} alt="" />
          <img className={cx("likeIcon")} src={PF + "love.png"} alt="" />
          <img className={cx("likeIcon")} src={PF + "haha.png"} alt="" />
          <span className={cx("postLikeCounter")}>{likeText}</span>
        </div>
        {comments.length > 0 && (
          <div
            className={cx("postBottomRight")}
            onClick={() => setOpenComment(true)}
          >
            <span className={cx("postCommentText")}>
              {countCommnets ? countCommnets : comments.length} comments
            </span>
          </div>
        )}
      </div>
      <div className={cx("action")}>
        <>
          <HeadlessTippy
            interactive={true}
            delay={[1000, 500]}
            visible={visible}
            onClickOutside={() => setVisible(false)}
            onMouseLeave={() => setVisible(false)}
            render={(attrs) => (
              <div className={cx("tippyBox")} tabIndex="-1" {...attrs}>
                <Tippy content="Like" arrow={false} offset={[0, 0]}>
                  <img
                    className={cx("tippyIcon")}
                    src={PF + "like.png"}
                    onClick={() => handleClickAction("like")}
                    alt=""
                  />
                </Tippy>
                <Tippy content="Love" arrow={false} offset={[0, 0]}>
                  <img
                    className={cx("tippyIcon")}
                    src={PF + "love.png"}
                    onClick={() => handleClickAction("love")}
                    alt=""
                  />
                </Tippy>
                <Tippy content="Haha" arrow={false} offset={[0, 0]}>
                  <img
                    className={cx("tippyIcon")}
                    src={PF + "haha.png"}
                    onClick={() => handleClickAction("haha")}
                    alt=""
                  />
                </Tippy>
              </div>
            )}
          >
            <div
              className={cx("item")}
              onMouseEnter={() => setVisible(true)}
              onClick={() => {
                setIsLiked(!isLiked);
                setActionType(!isLiked ? "like" : "");
                likeHandler();
                setVisible(false);
              }}
            >
              {!isLiked ? (
                <>
                  <i
                    data-visualcompletion="css-img"
                    className="icon-6 like"
                  ></i>
                  <span className={cx("actionText")}>Like</span>
                </>
              ) : (
                <>
                  <img
                    className={cx("actionIcon")}
                    src={
                      actionType ? PF + `${actionType}.png` : PF + "like.png"
                    }
                    alt=""
                  />
                  <span className={cx("actionText", `${actionType}`)}>
                    {actionType
                      ? actionType?.charAt(0).toUpperCase() +
                        actionType?.slice(1)
                      : "Like"}
                  </span>
                </>
              )}
            </div>
          </HeadlessTippy>
        </>
        <div className={cx("item")} onClick={() => setOpenComment(true)}>
          <i data-visualcompletion="css-img" className="icon-6 comment"></i>
          <span className={cx("actionText")}>Comment</span>
        </div>
        <div className={cx("item")}>
          <i data-visualcompletion="css-img" className="icon-6 share"></i>

          <span className={cx("actionText")}>Share</span>
        </div>
      </div>
    </div>
  );
}
