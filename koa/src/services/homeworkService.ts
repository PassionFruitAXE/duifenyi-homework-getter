import axios from "axios";
import { THomework } from "../types/response";

export function getHomeworkList(props: {
  courseid: string;
  classid: string;
  cookie: string;
}) {
  const data = {
    action: "gethomeworklist",
    classtypeid: "2",
    refresh: "0",
    ...props,
  };
  return axios.post<THomework>(
    "https://www.duifene.com/_HomeWork/HomeWorkInfo.ashx",
    data,
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        cookie: props.cookie,
      },
    },
  );
}
