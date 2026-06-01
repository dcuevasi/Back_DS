import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').max(100),
  content: z.string().min(1, 'El contenido es obligatorio'),
  categoryId: z.number().int().positive('La categoría es obligatoria'),
  imageUrl: z.string().url().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  content: z.string().min(1).optional(),
  categoryId: z.number().int().positive().optional(),
  imageUrl: z.string().url().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
