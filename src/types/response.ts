export type TBaseResponse<T> = {
  code: number;
  msg: string;
  data: T;
};

export type TGetHomeworkList = {
  CourseName: string;
  EndDate: string;
  HWName: string;
  IsSubmit: string;
  OverDue: string;
}[];
