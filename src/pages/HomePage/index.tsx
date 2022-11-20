import _ from "lodash";
import { FC, useMemo, useRef, useState } from "react";
import { getHomeworkList } from "@/api";
import { Table, Tag } from "antd";
import { TGetHomeworkList } from "@/types/response";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  HWName: string;
  CourseName: string;
  EndDate: string;
  CountTime: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: "作业",
    dataIndex: "HWName",
    key: "HWName",
  },
  {
    title: "学科",
    dataIndex: "CourseName",
    key: "CourseName",
  },
  {
    title: "截止日期",
    dataIndex: "EndDate",
    key: "EndDate",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_: unknown, { tags }: { tags: string[] }) => (
      <>
        {tags.map(tag => {
          enum Color {
            GEEK_BLUE = "geekblue",
            GREEN = "green",
            VOLCANO = "volcano",
          }
          let color = Color.GEEK_BLUE;
          if (tag === "1") {
            color = Color.GREEN;
            tag = "可逾期提交";
          } else {
            color = Color.VOLCANO;
            tag = "不可逾期提交";
          }
          return (
            <Tag color={color} key={tag}>
              {tag}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "倒计时",
    dataIndex: "CountTime",
    key: "CountTime",
  },
];

const HomePage: FC = () => {
  const [homeworkData, setHomeworkData] = useState<TGetHomeworkList>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const login = () => {
    const loginname = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    setIsLoading(true);
    getHomeworkList({ loginname, password })
      .then(response => {
        setHomeworkData(response.data.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const data = useMemo<DataType[]>(
    () =>
      homeworkData.map(item => ({
        ..._.pick(item, ["HWName", "CourseName", "EndDate", "CountTime"]),
        tags: [item.OverDue],
      })) || [],
    [homeworkData]
  );

  return (
    <div
      className="flex justify-center content-center p-8"
      style={{ height: 765 }}
    >
      <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
        <div className="flex-1">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">
              一键获取对分易作业
            </h2>

            <p className="mt-3 text-gray-500 dark:text-gray-300">
              登录您的对分易账号已获取未完成作业信息
            </p>
          </div>

          <div className="mt-8">
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
              >
                Username
              </label>
              <input
                type="username"
                name="username"
                id="username"
                ref={usernameRef}
                placeholder="对分易账号"
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-sm text-gray-600 dark:text-gray-200"
                >
                  Password
                </label>
              </div>

              <input
                type="password"
                name="password"
                id="password"
                ref={passwordRef}
                placeholder="对分易密码"
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div className="mt-6">
              <button
                onClick={() => login()}
                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
              >
                Sign in / Reload
              </button>
            </div>

            <p className="mt-6 text-sm text-center text-gray-400">
              没有对分易账号? 点我去对分易绑定&nbsp;
              <a
                href="https://www.duifene.com/Home.aspx"
                target="_blank"
                className="text-blue-500 focus:outline-none focus:underline hover:underline"
                rel="noreferrer"
              >
                对分易
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data}
        pagination={{ position: ["topLeft"] }}
        rowKey={item => item.HWName}
        className="shadow-md w-3/4"
      />
    </div>
  );
};

export default HomePage;
