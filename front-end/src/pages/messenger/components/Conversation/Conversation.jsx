import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames/bind";
import styles from "./Conversation.module.scss";
const cx = classNames.bind(styles);

export default function Conversation({ conversation, currentChat }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const userId = conversation?.members.filter((m) => m !== currentUser?._id);
    const getUser = async () => {
      try {
        const res = await axios.get(`/users?userId=${userId}`);
        setUser(res.data);
      } catch (err) {}
    };
    getUser();
  }, [conversation, currentUser]);

  return (
    <div className={cx("conversation", currentChat && "currentChat")}>
      <div className={cx("conversationImg")}>
        <img src={PF + `person/${user?.avatar}`} alt="" />
        <div className={cx("isActive")}></div>
      </div>
      <span className={cx("conversationName")}>{user?.username}</span>
    </div>
  );
}
