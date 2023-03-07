import axios from "axios";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import formatTime from "../../../../utils/formatDate";
import styles from "./Message.module.scss";

const cx = classNames.bind(styles);
export default function Message({ message, own }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (own) {
      setUser(currentUser);
    } else {
      const getUser = async () => {
        const res = await axios.get(`/users?userId=${message?.sender}`);
        setUser(res.data);
      };
      getUser();
    }
  }, [currentUser, own, message.sender]);
  return (
    <div className={cx("message", own && "own")}>
      <div className={cx("messageTop")}>
        <img className={cx("messageImg")} src={PF + `person/${user?.avatar}`} alt="" />
        <p className={cx("messageText")}>{message.text}</p>
      </div>
      <div className={cx("messageBottom")}>{formatTime(message.createdAt)}</div>
    </div>
  );
}
