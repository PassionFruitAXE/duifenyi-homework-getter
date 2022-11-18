export const baseResponse = <T = null>(props: {
  data?: T;
  code?: number;
  msg?: string;
}): String =>
  JSON.stringify({
    code: props.code ?? 200,
    msg: props.msg ?? null,
    data: props.data ?? null,
  });
