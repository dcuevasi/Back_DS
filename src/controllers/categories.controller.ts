import type { Context } from 'hono';
import { categoryRepository } from '../repositories/categories.repository.js';
import { createCategorySchema, updateCategorySchema } from '../schemas/categories.schema.js';
import { parsePrismaError } from '../lib/prisma-error.js';

export async function getCategories(c: Context) {
  const categories = await categoryRepository.findAll();
  return c.json(categories);
}

export async function getCategoryById(c: Context) {
  const id = Number(c.req.param('id'));

  if (isNaN(id)) {
    return c.json({ error: 'ID inválido' }, 400);
  }

  const category = await categoryRepository.findById(id);

  if (!category) {
    return c.json({ error: 'Categoría no encontrada' }, 404);
  }

  return c.json(category);
}

export async function createCategory(c: Context) {
  const body = await c.req.json();
  const result = createCategorySchema.safeParse(body);

  if (!result.success) {
    return c.json({ errors: result.error.issues }, 400);
  }

  try {
    const category = await categoryRepository.create(result.data);
    return c.json(category, 201);
  } catch (error) {
    const { status, message } = parsePrismaError(error);
    return c.json({ error: message }, status);
  }
}

export async function updateCategory(c: Context) {
  const id = Number(c.req.param('id'));

  if (isNaN(id)) {
    return c.json({ error: 'ID inválido' }, 400);
  }

  const body = await c.req.json();
  const result = updateCategorySchema.safeParse(body);

  if (!result.success) {
    return c.json({ errors: result.error.issues }, 400);
  }

  try {
    const category = await categoryRepository.update(id, result.data);
    return c.json(category);
  } catch (error) {
    const { status, message } = parsePrismaError(error);
    return c.json({ error: message }, status);
  }
}

export async function deleteCategory(c: Context) {
  const id = Number(c.req.param('id'));

  if (isNaN(id)) {
    return c.json({ error: 'ID inválido' }, 400);
  }

  try {
    await categoryRepository.remove(id);
    return c.json({ message: 'Categoría eliminada' });
  } catch (error) {
    const { status, message } = parsePrismaError(error);
    return c.json({ error: message }, status);
  }
}
