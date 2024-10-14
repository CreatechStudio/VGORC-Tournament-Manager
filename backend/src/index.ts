import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";

const app = new Elysia()
    .use(swagger())
    .get("/", () => "Hello VGORC")
    .listen(3000);

console.log(
    `🦊 VGORC Api Server is running at http://${app.server?.hostname}:${app.server?.port}`
);
