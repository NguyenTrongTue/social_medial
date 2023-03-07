import { Link } from "react-router-dom";
import { features } from "../../dummyData";
import { ArrowDownIcon, ArrowUpIcon } from "../icon/Icon";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";

const cx = classNames.bind(styles);

export default function Sidebar() {
  const { currentUser } = useSelector((state) => state.user);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [seeMore, setSeeMore] = useState(false);
  const [length, setLength] = useState(false);
  useEffect(() => {
    setLength(!seeMore ? 8 : features.length);
  }, [seeMore]);

  return (
    <div className={cx("sidebar")}>
      <div className={cx("sidebarWrapper")}>
        <Link
          to={`/profile/${currentUser?.username}`}
          className={cx("sidebarListItem")}
        >
          <img src={PF + `person/${currentUser?.avatar}`} alt="" />
          <span className={cx("sidebarListItemText")}>
            {currentUser.username}
          </span>
        </Link>
        <ul className={cx("sidebarList")}>
          {features.slice(0, length).map((feature, index) => {
            return (
              <li className={cx("sidebarListItem")} key={index}>
                <i
                  data-visualcompletion="css-img"
                  className={`icon-4 ${feature.icon}`}
                ></i>
                <span className={cx("sidebarListItemText")}>
                  {feature.name}
                </span>
              </li>
            );
          })}
        </ul>
        <li
          className={cx("sidebarListItem")}
          onClick={() => setSeeMore(!seeMore)}
        >
          <div className={cx("arrowIcon")}>
            {seeMore ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </div>
          <span className={cx("sidebarListItemText")}>
            {seeMore ? "See less" : `See more`}
          </span>
        </li>
        <hr className={cx("sidebarHr")} />
      </div>
    </div>
  );
}
