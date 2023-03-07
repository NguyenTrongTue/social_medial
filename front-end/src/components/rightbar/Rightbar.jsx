import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Rightbar.module.scss";

const cx = classNames.bind(styles);

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { currentUser } = useSelector((state) => state.user);
  const [followed, setFollowed] = useState(
    user?.followings.includes(currentUser?._id)
  );

  const [friends, setFriends] = useState([]);
  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get(`/users/friends/${user?._id}`);
      setFriends(res.data);
    };
    getFriends();
  }, [user]);

  const handleClick = async (e) => {
    try {
      if (followed) {
        await axios.put(`/users/${user?._id}/unfollow`, {
          userId: currentUser._id,
        });
        setFollowed(false);
      } else {
        await axios.put(`/users/${user?._id}/follow`, {
          userId: currentUser._id,
        });
        setFollowed(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className={cx("birthdayContainer")}>
          <h5 className={cx("title")}>Birthday</h5>
          <li className={cx("sidebarListItem")}>
            <i data-visualcompletion="css-img" className={`icon-5 gift`}></i>
            <span className={cx("sidebarListItemText")}>
              <span className={cx("username")}>Trong Nguyen</span>
              's birthday is to day.
            </span>
          </li>
        </div>
        <hr className={cx("hr")} />
        <h5 className={cx("title")}>Contact</h5>
        <ul className={cx("rightbarFriendList")}>
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user?.username !== currentUser?.username && (
          <button className={cx("rightbarFollowButton")} onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <RemoveIcon /> : <AddIcon />}
          </button>
        )}
        <h4 className={cx("rightbarTitle")}>User information</h4>
        <div className={cx("rightbarInfo")}>
          <div className={cx("rightbarInfoItem")}>
            <span className={cx("rightbarInfoKey")}>City:</span>
            <span className={cx("rightbarInfoValue")}>{user?.city}</span>
          </div>
          <div className={cx("rightbarInfoItem")}>
            <span className={cx("rightbarInfoKey")}>From:</span>
            <span className={cx("rightbarInfoValue")}>{user?.from}</span>
          </div>
          <div className={cx("rightbarInfoItem")}>
            <span className={cx("rightbarInfoKey")}>Relationship:</span>
            <span className={cx("rightbarInfoValue")}>
              {user?.relationship === 1
                ? "Single"
                : user?.relationship == 2
                ? "Married"
                : "Other"}
            </span>
          </div>
        </div>
        <h4 className={cx("rightbarTitle")}>User friends</h4>
        <div className={cx("rightbarFollowings")}>
          {friends.map((f) => {
            return (
              <Link
                className={cx("rightbarFollowing")}
                to={`/profile/${f.username}`}
                key={f._id}
                style={{ textDecoration: "none", color: "black" }}
              >
                <img
                  src={PF + f.avatar}
                  alt=""
                  className={cx("rightbarFollowingImg")}
                />
                <span className={cx("rightbarFollowingName")}>
                  {f.username}
                </span>
              </Link>
            );
          })}
        </div>
      </>
    );
  };
  return (
    <div className={cx("rightbar")}>
      {user ? <ProfileRightbar /> : <HomeRightbar />}
    </div>
  );
}
