import _ from "lodash";
import dayjs from "../vendor/dayjs";
import Koa from "koa";
import { baseResponse } from "../utils/response";
import { getHomeworkList } from "../services/homeworkService";
import { getStudentCourse } from "../services/courseService";
import { login } from "../services/loginService";

class HomeworkController {
  async getHomework(ctx: Koa.Context): Promise<void> {
    const { loginname, password } = ctx.request.body;
    // 检验传入请求体
    if (!loginname || !password) {
      throw new Error("账号密码未填写完善");
    }
    try {
      // 根据账户密码获取cookie
      const cookie = await login({
        loginname,
        password,
      }).then(response => response.headers["set-cookie"]?.join(";") || "");
      // 所有作业信息
      const { data: CourseInfo } = await getStudentCourse(cookie);
      if (!Array.isArray(CourseInfo)) {
        throw new Error("可能是账号密码不正确");
      }
      // 获取未完成作业信息
      const data = await Promise.all(
        CourseInfo.map(item =>
          getHomeworkList({
            courseid: item.CourseID,
            classid: item.TClassID,
            cookie,
          }).then(response =>
            response.data
              // 筛掉已提交作业
              .filter(res => res.IsSubmit !== "1")
              // 返回指定字段
              .map(res => ({
                // 课程名
                CourseName: item.CourseName,
                // 作业信息
                ..._.pick(res, ["HWName", "EndDate", "IsSubmit", "OverDue"]),
                // 剩余时间
                CountTime: dayjs(res.EndDate, "YYYY-MM-DD HH:mm:ss").fromNow(),
              })),
          ),
        ),
      );
      ctx.body = baseResponse({
        // 数组扁平化，按剩余时间排序
        data: _.flattenDeep(data).sort(
          (a, b) =>
            dayjs(a.EndDate, "YYYY-MM-DD HH:mm:ss").unix() -
            dayjs(b.EndDate, "YYYY-MM-DD HH:mm:ss").unix(),
        ),
      });
    } catch (error) {
      console.log(error);
      ctx.body = baseResponse({
        data: null,
        msg: `数据获取失败${error}}`,
      });
    }
  }
}

export default new HomeworkController();
