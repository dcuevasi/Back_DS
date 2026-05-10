import { Hono } from 'hono';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notes.controller.js';

export const notesRouter = new Hono();

notesRouter.get('/', getNotes);
notesRouter.get('/:id', getNoteById);
notesRouter.post('/', createNote);
notesRouter.patch('/:id', updateNote);
notesRouter.delete('/:id', deleteNote);
