import axios from "axios";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./UserComment.module.scss";
import formatTime from "../../utils/formatDate";
import { DummyArrowIcon, OptionIcon } from "../icon/Icon";
import HeadlessTippy from "@tippyjs/react/headless";
import SendIcon from "@mui/icons-material/Send";
import { ArrowDownIcon } from "../icon/Icon";
import { useSelector } from "react-redux";

const cx = classNames.bind(styles);
export default function UserComment({ comment, setComments }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [newComment, setNewComment] = useState(comment?.text);
  const [cmt, setCmt] = useState(comment?.text);
  const [allowEdit] = useState(comment?.userId === currentUser?._id);
  const [like, setLike] = useState();

  useEffect(() => {
    setLike(comment?.likes.includes(currentUser?._id));
  }, [currentUser, comment]);

  const inputRef = useRef();

  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get(`/users?userId=${comment.userId}`);
      setUser(res.data);
    };
    getUser();
  }, [comment]);
  const handleEdit = () => {
    setIsEdit(true);
    inputRef.current.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`/comments/update/${comment._id}`, { text: newComment });
    setIsEdit(false);

    setCmt(newComment);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await axios.delete(`/comments/delete/${comment._id}`);
    setComments((prev) => {
      return prev.filter((cmt) => cmt._id !== comment._id);
    });
  };

  const handleLike = async (e) => {
    e.preventDefault();
    await axios.put(`/comments/${comment._id}/like`, {
      userId: currentUser?._id,
    });
    setLike(!like);
  };

  return (
    <>
      {!isEdit ? (
        <div className={cx("wrapper")}>
          <div className={cx("avatar")}>
            <img src={PF + `person/${user?.avatar}`} alt="" />
          </div>
          <div className={cx("container")}>
            <div className={cx("messageContainer")}>
              <div className={cx("content")}>
                <span className={cx("username")}>{user?.username}</span>
                <span className={cx("text")}>{cmt}</span>
              </div>
              {allowEdit && (
                <HeadlessTippy
                  interactive={true}
                  delay={[200, 500]}
                  // visible={true}

                  trigger="click"
                  render={(attrs) => (
                    <>
                      <div className={cx("tippyBox")} tabIndex="-1" {...attrs}>
                        <span className={cx("edit")} onClick={handleEdit}>
                          Edit
                        </span>
                        <span className={cx("delete")} onClick={handleDelete}>
                          Delete
                        </span>
                        <DummyArrowIcon className={cx("arrow")} />
                      </div>
                    </>
                  )}
                >
                  <div className={cx("option")}>
                    <OptionIcon width="16" height="16" />
                  </div>
                </HeadlessTippy>
              )}
            </div>
            <div className={cx("react")}>
              <div
                className={cx("like", like && "isLike")}
                onClick={handleLike}
              >
                Like
              </div>
              <div className={cx("reply")}>Reply</div>
              <span className={cx("time")}>
                {comment?.isEdit
                  ? formatTime(comment.updatedAt)
                  : formatTime(comment.createdAt)}
              </span>
              {comment?.isEdit && <span className="time">Edited</span>}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className={cx("bottom")}>
            <div className={cx("avatar")}>
              <img src={PF + `person/${user?.avatar}`} alt="avatar" />
              <div className={cx("arrowIcon")}>
                <ArrowDownIcon height={12} width={12} />
              </div>
            </div>
            <div className={cx("input")}>
              <input
                ref={inputRef}
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className={cx("sendIcon")} onClick={handleSubmit}>
                <SendIcon />
              </div>
            </div>
          </div>
          <div className={cx("cancel")} onClick={() => setIsEdit(false)}>
            Cancel
          </div>
        </div>
      )}
    </>
  );
}
