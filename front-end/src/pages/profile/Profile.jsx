import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import Topbar from "../../components/topbar/Topbar";
import Feed from "../../components/feed/Feed";
import { OptionIcon } from "../../components/icon/Icon";
import { useDispatch, useSelector } from "react-redux";

import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import Sidebar from "./component/sidebar/Sidebar";
import { userUpdate } from "../../redux/userSlice";
import Modal from "../../components/Modal/Modal";
const cx = classNames.bind(styles);

export default function Profile() {
  const { username } = useParams();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [friends, setFriends] = useState([]);
  const [mutuals, setMutuals] = useState([]);
  const [coverImg, setCoverImg] = useState(null);
  const [avatarImg, setAvatarImg] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (username === currentUser?.username) {
      setUser(currentUser);
      setIsCurrentUser(true);
    } else {
      const getUser = async () => {
        const res = await axios.get(`/users?username=${username}`);
        console.log(res.data._id);
        const mutualList = await axios.get(`/users/mutuals/${res.data?._id}`);
        setMutuals(mutualList.data);
        setUser(res.data);
      };
      setIsCurrentUser(false);

      getUser();
    }
  }, [username, currentUser]);

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get(`/users/friends/${user?._id}`);
      setFriends(res.data);
    };
    getFriends();
    setCoverPicture(
      user?.coverPicture
        ? PF + `person/${user.coverPicture}`
        : PF + "person/myCover.jpg"
    );
    setAvatarFile(
      user?.avatar ? PF + `person/${user?.avatar}` : PF + "person/noAvatar.png"
    );
  }, [user, PF]);

  const handleUploadFile = async (file, typePhoto) => {
    const data = new FormData();
    const fileName = Date.now() + file?.name;
    data.append("name", fileName);
    data.append("file", file);

    try {
      await axios.post(`/users/upload/${typePhoto}`, data);
      console.log("Saved successfully");

      await axios.put(`/users/${user?._id}`, { [typePhoto]: fileName });
      dispatch(userUpdate({ [typePhoto]: fileName }));
      window.location.reload();
    } catch (err) {}
  };

  return (
    <>
      <Topbar />
      <div className={cx("wrapper")}>
        <div className={cx("header")}>
          <div
            className={cx("coverImg")}
            style={{
              background: `url(${
                coverImg ? URL.createObjectURL(coverImg) : coverPicture
              }) center / cover no-repeat`,
            }}
          >
            {isCurrentUser &&
              (coverImg ? (
                <div className={cx("modalBottom")}>
                  <div
                    className={cx("modalCancelBtn")}
                    onClick={() => setCoverImg(null)}
                  >
                    Cancel
                  </div>
                  <div
                    className={cx("modalUpdateBtn")}
                    onClick={() => handleUploadFile(coverImg, "coverPicture")}
                  >
                    Save
                  </div>
                </div>
              ) : (
                <>
                  <label htmlFor="file" className={cx("editCoverBtn")}>
                    <i
                      data-visualcompletion="css-img"
                      className="icon-8 photo-1"
                    ></i>
                    <span>Edit Cover Photo</span>
                  </label>
                  <input
                    style={{ display: "none" }}
                    type="file"
                    id="file"
                    name="file"
                    accept="image/*"
                    onChange={(e) => setCoverImg(e.target.files[0])}
                  />
                </>
              ))}
          </div>
          <div className={cx("headerCenter")}>
            <div className={cx("avatar")}>
              <img src={avatarFile} alt="" />
              {isCurrentUser && (
                <div
                  htmlFor="avatar"
                  className={cx("editAvatarBtn")}
                  onClick={() => setIsOpen(true)}
                >
                  <i
                    data-visualcompletion="css-img"
                    className="icon-8 photo-1"
                    style={{ transform: "scale(1.25)" }}
                  ></i>
                </div>
              )}
            </div>
            <div className={cx("user")}>
              <div className={cx("userDetail")}>
                <div className={cx("username")}>{user?.username}</div>

                <div className={cx("friendNumber")}>
                  {friends?.length} friends{" "}
                  {!isCurrentUser && <span>• {mutuals.length} mutual</span>}
                </div>
                <div className={cx("mutualImgs")}>
                  {friends.map((friend) => {
                    return (
                      <Link
                        to={`/profile/${friend.username}`}
                        className={cx("mutualImg")}
                        key={friend._id}
                      >
                        <img src={PF + `person/${friend.avatar}`} alt="" />
                      </Link>
                    );
                  })}
                </div>
              </div>
              {!isCurrentUser ? (
                <div className={cx("react")}>
                  <div className={cx("makeFriend")}>
                    <img src={PF + "makefriend.png"} alt="" />
                    <span>Friends</span>
                  </div>
                  <div className={cx("message")}>
                    <img src={PF + "message.png"} alt="" />
                    <span>Message</span>
                  </div>
                </div>
              ) : (
                <div className={cx("react")}>
                  <div className={cx("message")}>
                    <img src={PF + "icon/add.png"} alt="" />
                    <span>Add to Story</span>
                  </div>
                  <div className={cx("makeFriend")}>
                    <img src={PF + "icon/pencel.png"} alt="" />
                    <span>Edit profile</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={cx("details")}>
            <div className={cx("list")}>
              <div className={cx("detailItem", "active")}>Posts</div>
              <div className={cx("detailItem")}>About</div>
              <div className={cx("detailItem")}>Friends</div>
              <div className={cx("detailItem")}>Photos</div>
              <div className={cx("detailItem")}>Videos</div>
              <div className={cx("detailItem")}>Check-ins</div>
              <div className={cx("detailItem")}>More</div>
            </div>
            <div className={cx("interact")}>
              <OptionIcon />
            </div>
          </div>
        </div>
        <div className={cx("container")}>
          <div className={cx("main")}>
            <Sidebar
              friends={friends}
              user={user}
              isCurrentUser={isCurrentUser}
            />
            <div className={cx("rightContainer")}>
              <Feed user={user} />
            </div>
          </div>
        </div>
      </div>
      {modalIsOpen && (
        <Modal setIsOpen={setIsOpen} headerTitle="Update profile picture">
          <div className={cx("modal")}>
            <div className={cx("modalContainer")}>
              <label htmlFor="avatar" className={cx("uploadBtn")}>
                <AddIcon />
                <span>Upload Photo</span>
              </label>
              <input
                style={{ display: "none" }}
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={(e) => setAvatarImg(e.target.files[0])}
              />
              {avatarImg && (
                <div className={cx("preview")}>
                  <div
                    className={cx("previewImg")}
                    style={{
                      background: `url(${URL.createObjectURL(
                        avatarImg
                      )}) center / cover no-repeat`,
                    }}
                  ></div>
                </div>
              )}
            </div>

            <div className={cx("modalBottom")}>
              <div
                className={cx("modalCancelBtn")}
                onClick={() => {
                  setAvatarImg(null);
                  setIsOpen(false);
                }}
              >
                Cancel
              </div>
              <div
                className={cx("modalUpdateBtn")}
                onClick={() => handleUploadFile(avatarImg, "avatar")}
              >
                Save
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
