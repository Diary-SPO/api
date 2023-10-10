import { Elysia } from 'elysia';
import { 
  helloRoute,
} from '@src/routes';

const port = process.env.PORT ?? 3003;
const app = new Elysia()
  .use(helloRoute)
  .listen(port);

console.log(
  `Backend running at http://${app.server?.hostname}:${app.server?.port}`
);
