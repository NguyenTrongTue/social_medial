import { useEffect, useState } from "react";
import axios from "axios";

import classNames from "classnames/bind";
import styles from "./Video.module.scss";

const cx = classNames.bind(styles);

export default function Video({ src }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const videoElement = document.querySelector(".video");
  const [videoWidth, setVideoWidth] = useState(videoElement?.clientWidth);
  const [videoHeight, setVideoHeight] = useState(
    videoElement?.clientWidth * 0.8
  );

  useEffect(() => {
    setVideoWidth(videoElement?.clientWidth);
    setVideoHeight(videoElement?.clientWidth * 0.8);
    const handleResize = () => {
      setVideoWidth(videoElement?.clientWidth);
      setVideoHeight(videoElement?.clientWidth * 0.8);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [videoElement?.clientWidth]);

  return (
    <div className={cx("video")}>
      <video width={videoWidth} height={videoHeight} controls>
        <source src={PF + `video/${src}`} type="video/mp4" />
      </video>
    </div>
  );
}
