import { Elysia } from "elysia";

const app = new Elysia()
.get("/", () => "Backend on Bun+ElysiaJS is running.")
.listen(3003);

console.log(
  `Backend running at http://${app.server?.hostname}:${app.server?.port}`
);
