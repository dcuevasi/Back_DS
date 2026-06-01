import 'dotenv/config';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authRouter } from './routes/auth.routes.js';
import { notesRouter } from './routes/notes.routes.js';
import { categoriesRouter } from './routes/categories.routes.js';
import { authMiddleware } from './middlewares/auth.middleware.js';

type Variables = {
  userId: number;
};

const app = new Hono<{ Variables: Variables }>();
const port = Number(process.env.PORT ?? 3000);

app.use('/*', cors());
app.use('/*', logger());

app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'API de Notas — IPSS' });
});

app.use('/uploads/*', serveStatic({ root: './' }));

app.route('/auth', authRouter);

app.use('/notes/*', authMiddleware);
app.use('/categories/*', authMiddleware);

app.route('/notes', notesRouter);
app.route('/categories', categoriesRouter);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Servidor corriendo en http://localhost:${info.port}`);
  },
);
