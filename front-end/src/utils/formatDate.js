import { format } from "timeago.js";

export default function formatTime(date) {
  const time = format(date);
  const t = time.split(" ");
  return `${t[0]}${t[1][0]} `;
}
