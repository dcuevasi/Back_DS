import type { Context } from 'hono';
import { noteRepository } from '../repositories/notes.repository.js';
import { createNoteSchema, updateNoteSchema } from '../schemas/notes.schema.js';
import { parsePrismaError } from '../lib/prisma-error.js';

export async function getNotes(c: Context) {
  const notes = await noteRepository.findAll();
  return c.json(notes);
}

export async function getNoteById(c: Context) {
  const id = Number(c.req.param('id'));

  if (isNaN(id)) {
    return c.json({ error: 'ID inválido' }, 400);
  }

  const note = await noteRepository.findById(id);

  if (!note) {
    return c.json({ error: 'Nota no encontrada' }, 404);
  }

  return c.json(note);
}

export async function createNote(c: Context) {
  const body = await c.req.json();
  const result = createNoteSchema.safeParse(body);

  if (!result.success) {
    return c.json({ errors: result.error.issues }, 400);
  }

  try {
    const note = await noteRepository.create(result.data);
    return c.json(note, 201);
  } catch (error) {
    const { status, message } = parsePrismaError(error);
    return c.json({ error: message }, status);
  }
}

export async function updateNote(c: Context) {
  const id = Number(c.req.param('id'));

  if (isNaN(id)) {
    return c.json({ error: 'ID inválido' }, 400);
  }

  const body = await c.req.json();
  const result = updateNoteSchema.safeParse(body);

  if (!result.success) {
    return c.json({ errors: result.error.issues }, 400);
  }

  try {
    const note = await noteRepository.update(id, result.data);
    return c.json(note);
  } catch (error) {
    const { status, message } = parsePrismaError(error);
    return c.json({ error: message }, status);
  }
}

export async function deleteNote(c: Context) {
  const id = Number(c.req.param('id'));

  if (isNaN(id)) {
    return c.json({ error: 'ID inválido' }, 400);
  }

  try {
    await noteRepository.remove(id);
    return c.json({ message: 'Nota eliminada' });
  } catch (error) {
    const { status, message } = parsePrismaError(error);
    return c.json({ error: message }, status);
  }
}
