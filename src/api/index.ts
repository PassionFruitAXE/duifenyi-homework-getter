import { BACKEND_PREFIX } from "@/config";
import { TBaseResponse, TGetHomeworkList } from "@/types/response";
import { createAxiosByInterceptors } from "@/vendor/request";

const request = createAxiosByInterceptors({
  baseURL: BACKEND_PREFIX,
});

export function getHomeworkList(props: {
  loginname: string;
  password: string;
}) {
  const { loginname, password } = props;
  return request.post<TBaseResponse<TGetHomeworkList>>(`/getHomework`, {
    loginname,
    password,
  });
}
