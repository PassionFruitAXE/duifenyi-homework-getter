import HomeworkController from "../controllers/homeworkController";
import Router from "koa-router";
import koaBody from "koa-body";

const router = new Router();

router.post("/getHomework", koaBody(), HomeworkController.getHomework);

export default router;
