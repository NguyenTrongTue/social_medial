import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector } from "react-redux";

import { NavLink, Link } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import classNames from "classnames/bind";
import styles from "./Topbar.module.scss";
import { useEffect, useRef, useState } from "react";
import {
  HomeIcon,
  MarketIcon,
  GroupIcon,
  WatchListIcon,
  MenuIcon,
  MessengerIcon,
  NotifycationIcon,
} from "../icon/Icon";

const cx = classNames.bind(styles);

export default function Topbar({ socket }) {
  const { currentUser } = useSelector((state) => state.user);
  const [openSearch, setOpenSearch] = useState(false);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messagesCount, setMessagesCount] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState([]);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const searchRef = useRef();

  useEffect(() => {
    socket?.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    socket?.on("getNotification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });
  }, [socket]);

  useEffect(() => {
    const messageMap = new Map();
    const notificationMap = new Map();

    for (const obj of messages) {
      messageMap.set(obj.senderId, obj);
    }
    for (const obj of notifications) {
      notificationMap.set(obj.senderId, obj);
    }
    const filteredArr = Array.from(messageMap.values());
    const filteredArrNofitication = Array.from(notificationMap.values());
    setMessagesCount(filteredArr);
    setNotificationsCount(filteredArrNofitication);
  }, [messages, notifications]);

  useEffect(() => {
    const total = messagesCount.length + notificationsCount.length;
    document.title = total > 0 ? `(${total}) Facebook` : "Facebook";
  }, [messagesCount, notificationsCount]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("left", openSearch ? "openSearch" : "")}>
        {!openSearch ? (
          <Link to="/" className={cx("logo")}>
            <img src={PF + "logo.png"} alt="" />
          </Link>
        ) : (
          <div className={cx("back")} onClick={() => setOpenSearch(false)}>
            <ArrowBackIcon className={cx("backIcon")} />
          </div>
        )}

        <div className={cx("searchbar")}>
          <SearchIcon className={cx("searchIcon")} />
          <input
            placeholder="Search Facebook"
            className={cx("searchInput")}
            ref={searchRef}
            onFocus={() => setOpenSearch(true)}
          />
        </div>
        <div className={cx("resultSearch")}></div>
      </div>
      <div className={cx("center")}>
        <Tippy content="Home" arrow={false} offset={[0, 5]}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "active navbarItem" : "navbarItem"
            }
          >
            <HomeIcon />
          </NavLink>
        </Tippy>
        <Tippy content="Watch" arrow={false} offset={[0, 5]}>
          <NavLink
            to="/watch"
            className={({ isActive }) =>
              isActive ? "active navbarItem" : "navbarItem"
            }
          >
            <WatchListIcon />
          </NavLink>
        </Tippy>
        <Tippy content="Market" arrow={false} offset={[0, 5]}>
          <NavLink
            to="/market"
            className={({ isActive }) =>
              isActive ? "active navbarItem" : "navbarItem"
            }
          >
            <MarketIcon />
          </NavLink>
        </Tippy>
        <Tippy content="Gaming" arrow={false} offset={[0, 5]}>
          <NavLink
            to="/gaming"
            className={({ isActive }) =>
              isActive ? "active navbarItem" : "navbarItem"
            }
          >
            <GroupIcon />
          </NavLink>
        </Tippy>
      </div>
      <div className={cx("right")}>
        <Tippy content="Menu" arrow={false} offset={[0, 5]}>
          <Link to="/menu" className={cx("topbarIcon")}>
            <MenuIcon />
          </Link>
        </Tippy>
        <Tippy content="Messenger" arrow={false} offset={[0, 5]}>
          <Link
            to="/messenger"
            className={cx("topbarIcon")}
            onClick={() => {
              setMessagesCount(0);
            }}
          >
            <MessengerIcon />
            {messagesCount.length > 0 && (
              <span className={cx("badge")}>{messagesCount.length}</span>
            )}
          </Link>
        </Tippy>
        <Tippy content="Notifycations" arrow={false} offset={[0, 5]}>
          <Link to="/notification" className={cx("topbarIcon")}>
            <NotifycationIcon />
            {notificationsCount.length > 0 && (
              <span className={cx("badge")}>{notificationsCount.length}</span>
            )}
          </Link>
        </Tippy>

        <Tippy content="Account" arrow={false} offset={[0, 5]}>
          <img
            src={PF + `person/${currentUser?.avatar}`}
            alt=""
            className={cx("topbarImg")}
          />
        </Tippy>
      </div>
    </div>
  );
}
