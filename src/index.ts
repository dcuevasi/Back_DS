import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

const app = new Hono();
const port = Number(process.env.PORT ?? 3000);

let todos: Todo[] = [];

app.use('/*', cors());
app.use('/*', logger());

app.get('/health', (c) => {
  console.log('GET /health');
  return c.json({ ok: true });
});

app.get('/todos', (c) => {
  console.log(`GET /todos (${todos.length} items)`);
  return c.json(todos);
});

app.get('/todos/:id', (c) => {
  const id = c.req.param('id');
  const todo = todos.find((item) => item.id === id);

  console.log(`GET /todos/${id}`);

  if (!todo) {
    return c.json({ message: 'Todo no encontrado.' }, 404);
  }

  return c.json(todo);
});

app.post('/todos', async (c) => {
  const body = await c.req.json<{ title?: string; completed?: boolean }>();
  const title = body.title?.trim();

  console.log('POST /todos', { title: title ?? '' });

  if (!title) {
    return c.json({ message: 'El campo title es obligatorio.' }, 400);
  }

  const todo: Todo = {
    id: crypto.randomUUID(),
    title,
    completed: Boolean(body.completed),
    createdAt: new Date().toISOString(),
  };

  todos = [todo, ...todos];
  return c.json(todo, 201);
});

app.put('/todos/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<{ title?: string; completed?: boolean }>();
  const index = todos.findIndex((item) => item.id === id);

  console.log(`PUT /todos/${id}`, body);

  if (index === -1) {
    return c.json({ message: 'Todo no encontrado.' }, 404);
  }

  const current = todos[index];
  const updated: Todo = {
    ...current,
    title: body.title?.trim() ? body.title.trim() : current.title,
    completed: typeof body.completed === 'boolean' ? body.completed : current.completed,
  };

  todos[index] = updated;
  return c.json(updated);
});

app.delete('/todos/:id', (c) => {
  const id = c.req.param('id');
  const exists = todos.some((item) => item.id === id);

  console.log(`DELETE /todos/${id}`);

  if (!exists) {
    return c.json({ message: 'Todo no encontrado.' }, 404);
  }

  todos = todos.filter((item) => item.id !== id);
  return c.body(null, 204);
});

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${info.port}`);
});
