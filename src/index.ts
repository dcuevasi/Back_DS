import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { notesRouter } from './routes/notes.routes.js';
import { categoriesRouter } from './routes/categories.routes.js';

const app = new Hono();
const port = Number(process.env.PORT ?? 3000);

app.use('/*', cors());
app.use('/*', logger());

app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'API de Notas — IPSS' });
});

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
