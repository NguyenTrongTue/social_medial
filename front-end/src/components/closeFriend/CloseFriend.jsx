import { Link } from "react-router-dom";

import classNames from "classnames/bind";
import styles from "./CloseFriend.module.scss";
const cx = classNames.bind(styles);

export default function CloseFriend({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const background = user?.avatar ? PF + `person/${user?.avatar}` : PF + "noAavatar.png";
  return (
    <Link to={`/profile/${user.username}`} className={cx("sidebarFriend")}>
      <div
        className="background"
        style={{
          backgroundImage: `url(${background})`,
          paddingTop: "100%",
          width: "100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          borderRadius: "8px",
        }}
      ></div>

      <span className={cx("username")}>{user.username}</span>
    </Link>
  );
}
