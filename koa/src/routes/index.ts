import Router from "koa-router";
import homeworkRouter from "./homework";
// import fs from "fs";

const router = new Router();

router.use(homeworkRouter.routes()).use(homeworkRouter.allowedMethods());

export default router;
