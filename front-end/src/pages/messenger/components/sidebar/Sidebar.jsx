import { useRef, useState } from "react";
import Conversation from "../Conversation/Conversation";
import { OptionIcon, SearchIcon } from "../../../../components/icon/Icon";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import { useDispatch } from "react-redux";
import { chooseUser } from "../../../../redux/chatSlice";

const cx = classNames.bind(styles);

export default function Sidebar({ conversations }) {
  const dispatch = useDispatch();
  return (
    <div className={cx("wrapper")}>
      <div className={cx("headerWrapper")}>
        <div className={cx("header")}>
          <span className={cx("title")}>Chats</span>
          <div className={cx("options")}>
            <div className={cx("optionItem")}>
              <OptionIcon />
            </div>
            <div className={cx("optionItem")}>
              <i
                data-visualcompletion="css-img"
                className="icon-7 projector"
              ></i>
            </div>
            <div className={cx("optionItem")}>
              <i data-visualcompletion="css-img" className="icon-7 new"></i>
            </div>
          </div>
        </div>
        <div className={cx("search")}>
          <div className={cx("searchInput")}>
            <SearchIcon className={cx("searchIcon")} />
            <input type="text" placeholder="Search Messenger" />
          </div>
          <div className={cx("tags")}>
            <div className={cx("tagItem", "active")}>Inbox</div>
            <div className={cx("tagItem")}>Communities</div>
          </div>
        </div>
      </div>
      <div className={cx("chatMenu")}>
        <div className={cx("chatMenuWrapper")}>
          {conversations.map((conversation) => {
            return (
              <div
                key={conversation._id}
                onClick={() => dispatch(chooseUser(conversation))}
              >
                <Conversation conversation={conversation} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
