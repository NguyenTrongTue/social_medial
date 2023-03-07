import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import SendIcon from "@mui/icons-material/Send";
import Topbar from "../../components/topbar/Topbar";
import Message from "./components/Message/Message";
import Sidebar from "./components/sidebar/Sidebar";
import { InfoIcon, PhoneIcon, ProjectorIcon } from "../../components/icon/Icon";

import classNames from "classnames/bind";
import styles from "./Messenger.module.scss";
import { chooseUser } from "../../redux/chatSlice";
import { SocketContext } from "../../components/sockerProvider/SocketProvider";
const cx = classNames.bind(styles);

export default function Messenger() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { currentChat } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [userChat, setUserChat] = useState(null);

  const [newMessage, setNewMessage] = useState("");

  const { currentUser } = useSelector((state) => state.user);
  const scrollRef = useRef(null);
  const socket = useContext(SocketContext);
  useEffect(() => {
    document.title = "Messenger";
  }, [currentUser])

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        createdAt: Date.now(),
        text: data.text,
      });
    });
  }, [socket]);
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    var userId = currentUser?._id;
    const getConversation = async () => {
      const res = await axios.get(`/conversations/${userId}`);
      setConversations(res.data);
      dispatch(chooseUser(res.data[0]));
    };
    getConversation();

    socket.on("getUsers", (users) => {
      console.log(users);
    });
  }, [currentUser, dispatch, socket]);

  useEffect(() => {
    const getMessages = async () => {
      const res = await axios.get(`/messages/${currentChat?._id}`);
      setMessages(res.data);
    };
    getMessages();
  }, [currentChat]);

  useEffect(() => {
    const getUserChat = async () => {
      const id = currentChat?.members.find(
        (userId) => userId !== currentUser._id
      );
      const res = await axios.get(`/users?userId=${id}`);
      setUserChat(res.data);
    };
    getUserChat();
  }, [currentChat, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: currentUser._id,
      text: newMessage,
      conversationId: currentChat?._id,
    };

    const receiverId = currentChat.members.find((m) => m !== currentUser._id);

    socket.emit("sendMessage", {
      receiverId,
      text: newMessage,
      senderId: currentUser?._id,
    });

    try {
      const res = await axios.post(`/messages`, message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);
  return (
    <>
      <Topbar />
      <div className={cx("messenger")}>
        <Sidebar conversations={conversations} />
        <div className={cx("chatBox")}>
          <div className={cx("chatBoxWrapper")}>
            <div className={cx("header")}>
              <div className={cx("rightHeader")}>
                <div className={cx("chatImg")}>
                  <img src={PF + `person/${userChat?.avatar}`} alt="" />
                  <div className={cx("isActive")}></div>
                </div>
                <div className={cx("userName")}>{userChat?.username}</div>
              </div>
              <div className={cx("leftHeader")}>
                <Tippy
                  content="Start a voice call"
                  arrow={false}
                  offset={[0, 5]}
                >
                  <div className={cx("featureItem")}>
                    <PhoneIcon />
                  </div>
                </Tippy>
                <Tippy
                  content="Start a video call"
                  arrow={false}
                  offset={[0, 5]}
                >
                  <div className={cx("featureItem")}>
                    <ProjectorIcon />
                  </div>
                </Tippy>
                <Tippy
                  content="Conversation infomation"
                  arrow={false}
                  offset={[0, 5]}
                >
                  <div className={cx("featureItem")}>
                    <InfoIcon />
                  </div>
                </Tippy>
              </div>
            </div>

            <div className={cx("chatBoxTop")}>
              {messages.map((message) => {
                return (
                  <div ref={scrollRef} key={message._id}>
                    <Message
                      message={message}
                      own={currentUser?._id === message.sender}
                    />
                  </div>
                );
              })}
            </div>
            <div className={cx("chatBoxBottom")}>
              <input
                className={cx("chatMessageInput")}
                placeholder="Write something..."
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
              />
              <div className={cx("chatSubmitButton")} onClick={handleSubmit}>
                <SendIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
