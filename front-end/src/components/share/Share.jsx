import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../Modal/Modal";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Share.module.scss";

const cx = classNames.bind(styles);

export default function Share() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [typeFile, setTypeFile] = useState("");

  useEffect(() => {
    if (file) {
      setTypeFile(file.type.split("/")[0]);
    }
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: currentUser._id,
      desc,
    };
    if (file) {
      const data = new FormData();
      var fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);

      try {
        await axios.post(`/posts/upload/${typeFile}`, data);
      } catch (e) {
        console.log(e);
      }
    }

    if (typeFile === "image") {
      newPost.img = fileName;
    } else if (typeFile === "video") {
      newPost.video = fileName;
    }

    try {
      await axios.post(`/posts`, newPost);
      window.location.reload();
      setIsOpen(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={cx("warraper")}>
      <div className={cx("shareTop")}>
        <Link to={`/profile/:username`}>
          <img className={cx("img")} src={PF + "noAvatar.png"} alt="" />
        </Link>
        <input
          placeholder="What's in your mind Trong?"
          className={cx("shareInput")}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onClick={() => setIsOpen(true)}
        />
      </div>
      <hr className={cx("shareHr")} />
      <form>
        <div className={cx("shareBottom")}>
          <label className={cx("shareOption")} onClick={() => setIsOpen(true)}>
            <i data-visualcompletion="css-img" className={"icon photo"}></i>
            <div className={cx("shareOptionText")}>Photo/Video</div>
          </label>

          <div className={cx("shareOption")}>
            <i data-visualcompletion="css-img" className={"icon live"}></i>
            <span className={cx("shareOptionText")}>Live video</span>
          </div>
          <div className={cx("shareOption")}>
            <i data-visualcompletion="css-img" className={"icon activity"}></i>
            <span className={cx("shareOptionText")}>Feeling/activity</span>
          </div>
        </div>
      </form>

      {modalIsOpen && (
        <Modal
          isOpen={modalIsOpen}
          setIsOpen={setIsOpen}
          headerTitle="Create Post"
        >
          <div className={cx("shareModal")}>
            <div className={cx("container")}>
              <div className={cx("user")}>
                <img
                  className={cx("img")}
                  src={PF + `person/${currentUser.avatar}`}
                  alt=""
                />
                <p className={cx("userName")}>{currentUser.username}</p>
              </div>
              <div className={cx("modalCenter")}>
                <textarea
                  className={cx("shareText")}
                  placeholder="What's in your mind Trong?"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
                {file && (
                  <div className={cx("preview")}>
                    {typeFile === "image" ? (
                      <div className={cx("imgPost")}>
                        <img src={URL.createObjectURL(file)} alt="" />
                        <div
                          className={cx("clearFile")}
                          onClick={() => setFile(null)}
                        >
                          <i
                            data-visualcompletion="css-img"
                            className={"icon-2 close"}
                          ></i>
                        </div>
                      </div>
                    ) : (
                      <div className={cx("imgPost")}>
                        <video width="432" height="310" controls>
                          <source
                            src={URL.createObjectURL(file)}
                            type="video/mp4"
                          />
                        </video>
                        <div
                          className={cx("clearFile")}
                          onClick={() => setFile(null)}
                        >
                          <i
                            data-visualcompletion="css-img"
                            className={"icon-2 close"}
                          ></i>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className={cx("shareOptionModal")}>
                <span className={cx("desc")}>Add to your post</span>
                <div className={cx("iconModal")}>
                  <label htmlFor="file" style={{ cursor: "pointer" }}>
                    <i
                      data-visualcompletion="css-img"
                      className={"icon photo"}
                    ></i>
                  </label>
                  <input
                    style={{ display: "none" }}
                    type="file"
                    name="file"
                    id="file"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                    }}
                  />
                  <img className={cx("icon")} src={PF + "tags.png"} alt="" />
                  <i
                    data-visualcompletion="css-img"
                    className={"icon activity"}
                  ></i>
                  <img
                    className={cx("icon")}
                    src={PF + "location.png"}
                    alt=""
                  />{" "}
                  <img className={cx("icon")} src={PF + "event.png"} alt="" />
                  <i
                    data-visualcompletion="css-img"
                    className={"icon-3 more"}
                  ></i>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className={cx("post", !file && !desc.trim() ? "disabled" : "")}
              >
                Post
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// sakira data base sample
