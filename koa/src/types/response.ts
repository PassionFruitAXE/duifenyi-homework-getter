export type TCourseInfo = {
  BackgroundColor: string;
  ClassName: string;
  Color: string;
  CourseID: string;
  CourseName: string;
  CreaterDate: string;
  CreaterID: string;
  IsCanel: string;
  Status: string;
  TClassID: string;
  TUserID: string;
  TermId: string;
  TermName: string;
}[];

export type THomework = {
  StudentID: string;
  TClassID: string;
  CourseID: string;
  HWID: string;
  HWName: string;
  Depressions: string;
  HWTypeID: string; // x：个人作业 2: 小组作业
  SGID: string;
  CorrectTypeID: string;
  EndDate: string;
  PostTime: string;
  UpdateTime: string;
  IsTimer: string;
  HWCycleID: string;
  OverDue: string; // 0: 允许逾期提交 1: 不允许逾期提交
  CommentType: string;
  Status: string;
  IsSend: string;
  Score: string;
  CorrectDes: string;
  CreateDate: string;
  SubmitDate: string;
  CorrectDate: string;
  ReturnDate: string;
  ReturnReason: string;
  SubmitNumber: string;
  CorrectNumber: string;
  SumNumber: string;
  CommentSign: string;
  CommentObject: string;
  Submit: string;
  Correct: string;
  Total: string;
  LastCreateDate: string;
  LastCreateDate1: string;
  IsSubmit: string;
}[];
