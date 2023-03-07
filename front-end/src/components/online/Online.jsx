import classNames from "classnames/bind";
import styles from "./Online.module.scss";

const cx = classNames.bind(styles);

export default function Online({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className={cx("rightbarFriend")}>
      <div className={cx("rightbarProfileImgContainer")}>
        <img
          className={cx("rightbarProfileImg")}
          src={PF + user.profilePicture}
          alt=""
        />
        <span className={cx("rightbarOnline")}></span>
      </div>
      <span className={cx("rightbarUsername")}>{user.username}</span>
    </li>
  );
}
