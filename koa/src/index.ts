import chalk from "chalk";
import error from "koa-json-error";
import Koa from "koa";
import routers from "./routes";
import views from "koa-views";

type JSONError = Error & { status: number };

const app = new Koa();
const port = 7000;
const options = {
  postFormat: (_: JSONError, { stack, ...rest }: any) =>
    process.env.NODE_ENV === "production" ? rest : { stack, ...rest },
};

app.use(error(options));
app.use(
  views("src/templates", {
    extension: "ejs",
  }),
);
app.use(routers.routes()).use(routers.allowedMethods());

app.listen(port, async () => {
  console.log(`${chalk.bgGreen("Server running successfully!")}`);
  console.log(
    chalk.cyan(`${chalk.bold("Location: ")}`, `http://localhost:${port}`),
  );
});
