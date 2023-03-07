import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import CloseFriend from "../../../../components/closeFriend/CloseFriend";
import Modal from "../../../../components/Modal/Modal";
import moment from 'moment';

import axios from "axios";
const cx = classNames.bind(styles);
function Sidebar({ friends, user, isCurrentUser }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [photos, setPhotos] = useState([]);
  const [studiesAt, setStudiesAt] = useState("");
  const [livesIn, setLivesIn] = useState(``);
  const [relationship, setRelationship] = useState(`${user?.relationship}`);
  const [modalIsOpen, setIsOpen] = useState(false);
  const studiesRef = useRef(null);
  const livesRef = useRef(null);
  
  useEffect(() => {
    const getPhotos = async () => {
      const res = await axios.get(`/users/photos/${user?._id}`);
      setPhotos(res.data);
    };
    getPhotos();
    setStudiesAt(user?.studiesAt);
    setLivesIn(user?.livesIn);
  }, [user]);

  const handleFocus = (input) => {
    input.focus();
    if (input.value === "Not update") {
      input.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put(`/users/${user?._id}`, {
      studiesAt,
      livesIn,
      relationship,
    });
    setIsOpen(false);
  };
  return (
    <>
      <div className={cx("leftContainer")}>
        <div className={cx("intro", "card")}>
          <div className={cx("cardTitle")}>Intro</div>
          <div className={cx("introList")}>
            {studiesAt && (
              <div className={cx("introItem")}>
                <img src={PF + "studies.png"} alt="" />
                <p>
                  Studies at <span>{studiesAt}</span>
                </p>
              </div>
            )}
            {livesIn && (
              <div className={cx("introItem")}>
                <img src={PF + "home.png"} alt="" />
                <p>
                  Lives in <span>{livesIn}</span>
                </p>
              </div>
            )}

            <div className={cx("introItem")}>
              <img src={PF + "time.png"} alt="" />
              <p>
                Joined on <span>{moment(user?.createdAt).format('MMM D, YYYY')}</span>
              </p>
            </div>
            <div className={cx("introItem")}>
              <img src={PF + "icon/relationship.png"} alt="" />
              <p>
                Relationship{" "}
                <span>
                  {relationship === "1"
                    ? "Single"
                    : relationship === "2"
                    ? "Married"
                    : "Other"}
                </span>
              </p>
            </div>
            {user?.followers.length > 0 && (
              <div className={cx("introItem")}>
                <img src={PF + "followed.png"} alt="" />
                <p>
                  Followed by <span>{user.followers.length} people</span>
                </p>
              </div>
            )}
            {isCurrentUser && (
              <div className={cx("editBtn")} onClick={() => setIsOpen(true)}>
                Edit details
              </div>
            )}
          </div>
        </div>
        <div className={cx("card")}>
          <div className={cx("cardTitle")}>Photos</div>
          <div className={cx("photos")}>
            {photos.map((photo) => {
              return (
                photo?.trim() && (
                  <div
                    className={cx("photo")}
                    style={{
                      backgroundImage: `url(${PF + photo})`,
                      paddingTop: "100%",
                      width: "100%",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  ></div>
                )
              );
            })}
          </div>
        </div>
        <div className={cx("card")}>
          <div className={cx("cardTitle")}>Friends</div>
          <div className={cx("cardContainer")}>
            {friends?.map((friend) => {
              return <CloseFriend key={friend._id} user={friend} />;
            })}
          </div>
        </div>
      </div>
      {modalIsOpen && (
        <Modal setIsOpen={setIsOpen} headerTitle="Edit details">
          <div className={cx("modal")}>
            <div className={cx("modalContainer")}>
              <div className={cx("modalItem")}>
                <div className={cx("modalItemTitle")}>Education</div>
                <div className={cx("modalItemContent")}>
                  <img
                    className={cx("modalIcon")}
                    src={PF + "studies.png"}
                    alt=""
                  />
                  <div className={cx("modalText")}>
                    <span> Studies at</span>
                    <input
                      ref={studiesRef}
                      value={studiesAt?.trim() ? studiesAt : "Not update"}
                      onFocus={() => handleFocus(studiesRef.current)}
                      onBlur={(e) => {
                        e.target.value = e.target.value.trim()
                          ? e.target.value
                          : "Not update";
                      }}
                      onChange={(e) => setStudiesAt(e.target.value)}
                    />
                  </div>

                  <img
                    className={cx("editIcon")}
                    src={PF + "icon/pencel.png"}
                    alt=""
                    onClick={() => handleFocus(studiesRef.current)}
                  />
                </div>
              </div>
              <div className={cx("modalItem")}>
                <div className={cx("modalItemTitle")}>Current town/city</div>
                <div className={cx("modalItemContent")}>
                  <img
                    className={cx("modalIcon")}
                    src={PF + "home.png"}
                    alt=""
                  />
                  <div className={cx("modalText")}>
                    <span> Lives in</span>
                    <input
                      ref={livesRef}
                      value={livesIn?.trim() ? livesIn : "Not update"}
                      onFocus={() => handleFocus(livesRef.current)}
                      onBlur={(e) => {
                        e.target.value = e.target.value.trim()
                          ? e.target.value
                          : "Not update";
                      }}
                      onChange={(e) => setLivesIn(e.target.value)}
                    />
                  </div>
                  <img
                    className={cx("editIcon")}
                    src={PF + "icon/pencel.png"}
                    alt=""
                    onClick={() => handleFocus(livesRef.current)}
                  />
                </div>
              </div>
              <div className={cx("modalItem")}>
                <div className={cx("modalItemTitle")}>Joined Facebook</div>
                <div className={cx("modalItemContent")}>
                  <img
                    className={cx("modalIcon")}
                    src={PF + "icon/relationship.png"}
                    alt=""
                  />
                  <div className={cx("modalText")}>
                    <span> Relationship</span>
                    <div className={cx("relationship")}>
                      <select
                        required
                        onChange={(e) => setRelationship(e.target.value)}
                        value={relationship}
                      >
                        <option value="1">Single</option>
                        <option value="2">Married</option>
                        <option value="3">Others</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className={cx("modalBottom")}>
              <div
                className={cx("modalCancelBtn")}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </div>
              <div className={cx("modalUpdateBtn")} onClick={handleSubmit}>
                Save
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default Sidebar;
