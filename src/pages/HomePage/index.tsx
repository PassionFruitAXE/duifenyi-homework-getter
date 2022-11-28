import _ from "lodash";
import dayjs from "@/vendor/dayjs";
import { FC, useMemo, useRef, useState } from "react";
import { getHomeworkList } from "@/api";
import { Table, Tag } from "antd";
import { TGetHomeworkList } from "@/types/response";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  key: string;
  status: string;
}

interface ExpandedDataType {
  HWName: string;
  CourseName: string;
  EndDate: string;
  tags: {
    OverDue: string;
  };
  CountTime: string;
}

const columns: ColumnsType<DataType> = [
  { title: "完成状态", dataIndex: "status", key: "status" },
];

const expandedColumns: ColumnsType<ExpandedDataType> = [
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
    render: (_: unknown, { tags }) => (
      <>
        {Object.entries(tags).map(([key, value]) =>
          tagRender[key] ? tagRender[key](value) : <></>
        )}
      </>
    ),
  },
  {
    title: "倒计时",
    dataIndex: "CountTime",
    key: "CountTime",
  },
];

enum Status {
  NOT_OVER_DUE = "1",
  OVER_DUE = "2",
}

const data: DataType[] = [
  { status: "未逾期", key: Status.NOT_OVER_DUE },
  { status: "已逾期", key: Status.OVER_DUE },
];

enum Color {
  GEEK_BLUE = "geekblue",
  GREEN = "green",
  VOLCANO = "volcano",
}

const tagRender: {
  [key: string]: (value: string) => JSX.Element;
} = {
  /**
   * 是否可以逾期提交
   * @param value 0: 允许 1：不允许
   * @returns
   */
  OverDue: value => {
    const color = value === "0" ? Color.GREEN : Color.VOLCANO;
    value = value === "0" ? "允许逾期提交" : "不允许逾期提交";
    return (
      <Tag color={color} key={value}>
        {value}
      </Tag>
    );
  },
};

const HomePage: FC = () => {
  const [homeworkData, setHomeworkData] = useState<TGetHomeworkList>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  // 未逾期作业
  const notOverdueData = useMemo<ExpandedDataType[]>(
    () =>
      homeworkData
        .filter(item =>
          // 截止日期在系统时间前
          dayjs(new Date()).isBefore(dayjs(item.EndDate, "YYYY/M/D H:m:s"))
        )
        .sort(
          (a, b) =>
            dayjs(a.EndDate, "YYYY/M/D H:m:s").unix() -
            dayjs(b.EndDate, "YYYY/M/D H:m:s").unix()
        )
        .map(item => ({
          ..._.pick(item, ["HWName", "CourseName", "EndDate"]),
          tags: { OverDue: item.OverDue },
          CountTime: dayjs(item.EndDate, "YYYY/M/D H:m:s").fromNow(),
        })) || [],
    [homeworkData]
  );
  // 已逾期作业
  const overdueData = useMemo<ExpandedDataType[]>(
    () =>
      homeworkData
        .filter(item => {
          // 截止日期在系统时间前
          return dayjs(new Date()).isAfter(
            dayjs(item.EndDate, "YYYY/M/D H:m:s")
          );
        })
        .sort(
          (a, b) =>
            dayjs(a.EndDate, "YYYY/M/D H:m:s").unix() -
            dayjs(b.EndDate, "YYYY/M/D H:m:s").unix()
        )
        .map(item => ({
          ..._.pick(item, ["HWName", "CourseName", "EndDate"]),
          tags: { OverDue: item.OverDue },
          CountTime: dayjs(item.EndDate, "YYYY/M/D H:m:s").fromNow(),
        })) || [],
    [homeworkData]
  );

  const login = () => {
    const loginname = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    setIsLoading(true);
    getHomeworkList({ loginname, password })
      .then(response => {
        setHomeworkData(response.data.data || []);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const expandedRowRender = (record: DataType) => {
    const data: ExpandedDataType[] =
      record.key === Status.NOT_OVER_DUE ? notOverdueData : overdueData;
    return (
      <Table
        columns={expandedColumns}
        dataSource={data}
        pagination={{ pageSize: 6 }}
      />
    );
  };

  return (
    <div className="flex justify-center content-center p-8 h-screen">
      <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6 overflow-auto">
        <div className="flex-1">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">
              一键获取对分易作业
            </h2>

            <p className="mt-3 text-gray-500 dark:text-gray-300">
              请将已经结课的课程进行归档 避免获取结课课程的作业
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
                onKeyUp={e => {
                  if (e.key === "Enter") {
                    login();
                  }
                }}
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
                onKeyUp={e => {
                  if (e.key === "Enter") {
                    login();
                  }
                }}
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
      <div className="flex flex-col w-3/4 overflow-auto">
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={data}
          expandable={{
            expandedRowRender: expandedRowRender,
            defaultExpandedRowKeys: [Status.NOT_OVER_DUE],
          }}
          pagination={false}
          className="shadow-md"
        />
      </div>
    </div>
  );
};

export default HomePage;
