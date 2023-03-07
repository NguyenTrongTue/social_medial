import axios from "axios";
import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ChatOnline.module.scss";

const cx = classNames.bind(styles);
export default function ChatOnline() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className={cx("chatOnline")}>
      <div className={cx("chatOnlineFriend")}>
        <div className={cx("chatOnlineImgContainer")}>
          <img
            className={cx("chatOnlineImg")}
            src={PF + "person/1.jpeg"}
            alt=""
          />
          <div className={cx("chatOnlineBadge")}></div>
        </div>
        <span className={cx("chatOnlineName")}>Trong Nguyen</span>
      </div>
    </div>
  );
}
