import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.scss";
import { useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../components/sockerProvider/SocketProvider";

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const socket = useContext(SocketContext);
  const [mySocket, setMySocket] = useState(null);
  useEffect(() => {
    setMySocket(socket);
  }, []);

  useEffect(() => {
    socket.emit("addUser", currentUser._id);
    socket.on("getUsers", (users) => {
      console.log(users);
    });
  }, [socket, currentUser]);
  return (
    <>
      <Topbar socket={mySocket} />
      <div className="homeContainer">
        <Sidebar />
        <Feed user={currentUser} />
        <Rightbar />
      </div>
    </>
  );
}
